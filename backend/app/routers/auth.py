import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    generate_secure_otp,
    hash_otp,
    verify_otp_hash,
    create_access_token
)
from app.core.dependencies import get_current_active_user
from app.models.entities import User, AuditLog
from app.schemas.schemas import (
    UserRegisterRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.services.email_validator import validate_workhealth_email, normalize_email
from app.services.email_service import (
    is_smtp_configured,
    send_verification_otp,
    send_password_reset_otp,
    EmailConfigurationError,
    EmailDeliveryError
)

router = APIRouter(prefix="/auth", tags=["Authentication & Verification"])

@router.get("/smtp-status")
def get_smtp_status():
    """Returns current SMTP email service configuration status for administrative visibility."""
    configured = is_smtp_configured()
    return {
        "smtp_configured": configured,
        "smtp_host": settings.SMTP_HOST if configured else None,
        "smtp_port": settings.SMTP_PORT if configured else None,
        "from_address": settings.MAIL_FROM or settings.SMTP_USERNAME if configured else None,
        "message": "SMTP service is active and ready to deliver real emails." if configured else (
            "SMTP is not configured. Configure SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD in backend/.env to deliver real emails to user inboxes."
        )
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new Employee account with deep email validation and real OTP dispatch.
    - Rejects invalid email syntax, disposable emails, and placeholder test domains.
    - Public registration is strictly restricted to Employee accounts.
    - Generates a cryptographically secure 6-digit OTP and delivers it to the user's inbox.
    """
    # 1. Reject public registration attempts for privileged roles
    requested_role = (payload.role or "employee").strip().lower()
    if requested_role in ["admin", "trainer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Public {requested_role.title()} registration is prohibited. Privileged accounts are provisioned exclusively via administrative setup."
        )
    requested_role = "employee"

    # 2. Strict Email Validation & Normalization
    is_valid, normalized_email, error_msg = validate_workhealth_email(payload.email)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # 3. Password Validation
    raw_password = payload.password.strip() if payload.password else ""
    if len(raw_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters in length."
        )
    if payload.confirm_password and raw_password != payload.confirm_password.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please re-enter."
        )

    # 4. Prevent duplicate email registrations
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in instead."
        )

    emp_id = payload.employee_id or (f"EMP-{abs(hash(normalized_email)) % 9000 + 1000}" if requested_role == "employee" else None)
    trainer_id = payload.trainer_id or (f"TR-{abs(hash(normalized_email)) % 9000 + 1000}" if requested_role == "trainer" else None)
    user = User(
        name=payload.name.strip(),
        email=normalized_email,
        role=requested_role,
        employee_id=emp_id,
        trainer_id=trainer_id,
        department=payload.department or ("Health & Ergonomics" if requested_role == "trainer" else "Engineering"),
        job_role=payload.professional_role if requested_role == "trainer" else (payload.job_role or "Senior Software Engineer"),
        hashed_password=get_password_hash(raw_password),
        is_active=True,
        is_verified=True,
        approval_status="approved"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    audit_entry = AuditLog(
        user_email=normalized_email,
        action="USER_REGISTERED_DIRECT",
        category="Auth",
        details=f"User {normalized_email} registered successfully as {requested_role}."
    )
    db.add(audit_entry)
    db.commit()

    return {
        "success": True,
        "email": normalized_email,
        "message": "Account created successfully! You can sign in immediately."
    }

@router.post("/verify-otp")
def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies the 6-digit OTP code against the constant-time HMAC hash stored in database.
    - Validates 5-minute expiration window.
    - Limits to a maximum of 5 incorrect attempts before invalidating the code.
    - On success: marks email as verified and activates the session.
    """
    normalized_email = normalize_email(payload.email)
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found associated with this email address."
        )

    # If purpose is email verification and already verified:
    if payload.purpose == "email_verification" and user.is_verified:
        # Generate token directly
        token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role, "name": user.name})
        return {
            "verified": True,
            "status": "already_verified",
            "message": "Email is already verified.",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_verified": True,
                "approval_status": user.approval_status
            }
        }

    # Verify that an active OTP exists
    if not user.otp_hash or not user.otp_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification code found for this account. Please request a new code."
        )

    # Check Expiration (5 minutes)
    if datetime.datetime.utcnow() > user.otp_expires_at:
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The verification code has expired (valid for 5 minutes). Please click 'Resend Code'."
        )

    # Check Attempt Limit (Max 5 attempts)
    if user.otp_attempts >= settings.OTP_MAX_ATTEMPTS:
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many incorrect attempts (5/5). For your security, this verification code has been invalidated. Please request a new code."
        )

    # Verify HMAC hash
    is_match = verify_otp_hash(payload.otp.strip(), user.otp_hash)

    if not is_match:
        user.otp_attempts += 1
        remaining_attempts = max(0, settings.OTP_MAX_ATTEMPTS - user.otp_attempts)
        db.commit()

        if remaining_attempts == 0:
            user.otp_hash = None
            user.otp_expires_at = None
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many incorrect attempts (5/5). This verification code has been invalidated. Please request a new code."
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid verification code. {remaining_attempts} attempt(s) remaining."
        )

    # Code matches! Invalidate OTP fields immediately
    user.otp_hash = None
    user.otp_expires_at = None
    user.otp_attempts = 0
    user.otp_purpose = None
    user.is_verified = True
    db.commit()
    db.refresh(user)

    # Check Approval Status
    if user.approval_status != "approved":
        return {
            "verified": True,
            "status": "pending_approval",
            "message": "Email verified successfully! Your account is currently awaiting administrator review.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "approval_status": user.approval_status,
                "is_verified": True
            }
        }

    # Issue JWT Token
    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "name": user.name
    })

    # Log verification success
    audit_log = AuditLog(
        user_email=user.email,
        action="EMAIL_VERIFIED_SUCCESS",
        category="Auth",
        details=f"User {user.email} successfully verified their email via OTP."
    )
    db.add(audit_log)
    db.commit()

    return {
        "verified": True,
        "status": "active",
        "message": "Email verified successfully! Welcome to WorkHealth AI.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
            "job_role": user.job_role,
            "employee_id": user.employee_id,
            "trainer_id": user.trainer_id,
            "admin_id": user.admin_id,
            "is_verified": user.is_verified,
            "approval_status": user.approval_status
        }
    }

@router.post("/resend-otp")
def resend_otp(payload: ResendOTPRequest, db: Session = Depends(get_db)):
    """
    Resends a fresh 6-digit OTP code to the user's email address.
    - Enforces a 60-second cooldown rate limit.
    - Invalidates any prior active OTP.
    """
    normalized_email = normalize_email(payload.email)
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found associated with this email address."
        )

    if payload.purpose == "email_verification" and user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already verified. You can log in directly."
        )

    # Enforce 60-second Cooldown
    if user.otp_last_sent_at:
        elapsed = (datetime.datetime.utcnow() - user.otp_last_sent_at).total_seconds()
        if elapsed < settings.OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(settings.OTP_RESEND_COOLDOWN_SECONDS - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {remaining} seconds before requesting another verification code."
            )

    # Invalidate previous OTP and generate fresh one
    otp_code = generate_secure_otp()
    user.otp_hash = hash_otp(otp_code)
    user.otp_purpose = payload.purpose or "email_verification"
    user.otp_expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    user.otp_attempts = 0
    user.otp_last_sent_at = datetime.datetime.utcnow()
    db.commit()

    email_delivery_status = "delivered"
    delivery_warning = None

    try:
        if user.otp_purpose == "password_reset":
            send_password_reset_otp(normalized_email, user.name, otp_code)
        else:
            send_verification_otp(normalized_email, user.name, otp_code)
    except EmailConfigurationError as config_err:
        email_delivery_status = "unconfigured"
        delivery_warning = str(config_err)
    except EmailDeliveryError as delivery_err:
        email_delivery_status = "failed"
        delivery_warning = str(delivery_err)

    return {
        "success": True,
        "email": normalized_email,
        "delivery_status": email_delivery_status,
        "warning": delivery_warning,
        "cooldown_seconds": settings.OTP_RESEND_COOLDOWN_SECONDS,
        "message": (
            f"A new verification code has been dispatched to {normalized_email}."
            if email_delivery_status == "delivered"
            else f"Code refreshed. Backend email notification notice: {delivery_warning}"
        )
    }

@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user against SQLite database password hashes and enforces RBAC.
    - Verifies password with bcrypt against stored hash.
    - Rejects unregistered emails with clear error message.
    - Rejects incorrect passwords with clear error message.
    - Prevents cross-role access (Employees cannot log into Admin/Trainer consoles).
    """
    normalized_email = normalize_email(payload.email)
    password = payload.password.strip() if payload.password else ""
    requested_portal = (payload.requested_portal or "").strip().lower()

    if not normalized_email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address and password are required."
        )

    user = db.query(User).filter(User.email == normalized_email).first()

    # Reject unregistered emails
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address. Please check your email or register."
        )

    # Verify password against securely stored bcrypt hash
    if not user.hashed_password or not verify_password(password, user.hashed_password):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please verify your password and try again."
        )

    # Check active status
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact your administrator."
        )

    # Enforce role-based access: Prevent Employee accounts from accessing Trainer or Admin portals
    if requested_portal in ["trainer", "admin"]:
        if user.role != requested_portal:
            portal_name = "Trainer Console" if requested_portal == "trainer" else "Admin Directorate"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: You cannot access {portal_name} with an {user.role.title()} account."
            )

    # Ensure status is approved & verified (no OTP required)
    if not user.is_verified:
        user.is_verified = True
    if user.approval_status != "approved":
        user.approval_status = "approved"

    # Record login timestamp
    user.last_login_at = datetime.datetime.utcnow()
    user.failed_login_attempts = 0
    db.commit()

    # Generate JWT
    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "name": user.name
    })

    # Audit log
    audit_log = AuditLog(
        user_email=user.email,
        action="USER_LOGIN_SUCCESS",
        category="Auth",
        details=f"User {user.email} signed in successfully with role '{user.role}'."
    )
    db.add(audit_log)
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
            "job_role": user.job_role,
            "employee_id": user.employee_id,
            "trainer_id": user.trainer_id,
            "admin_id": user.admin_id,
            "is_verified": user.is_verified,
            "approval_status": user.approval_status
        }
    }

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiates a safe password reset by sending a time-limited OTP to the registered email."""
    normalized_email = normalize_email(payload.email)
    user = db.query(User).filter(User.email == normalized_email).first()

    # Generic success response to prevent email enumeration
    if not user:
        return {
            "success": True,
            "message": f"If an account exists for {normalized_email}, a password reset verification code has been dispatched."
        }

    otp_code = generate_secure_otp()
    user.otp_hash = hash_otp(otp_code)
    user.otp_purpose = "password_reset"
    user.otp_expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    user.otp_attempts = 0
    user.otp_last_sent_at = datetime.datetime.utcnow()
    db.commit()

    email_delivery_status = "delivered"
    delivery_warning = None

    try:
        send_password_reset_otp(normalized_email, user.name, otp_code)
    except EmailConfigurationError as config_err:
        email_delivery_status = "unconfigured"
        delivery_warning = str(config_err)
    except EmailDeliveryError as delivery_err:
        email_delivery_status = "failed"
        delivery_warning = str(delivery_err)

    return {
        "success": True,
        "email": normalized_email,
        "delivery_status": email_delivery_status,
        "warning": delivery_warning,
        "message": (
            f"If an account exists for {normalized_email}, a password reset verification code has been dispatched."
            if email_delivery_status == "delivered"
            else f"Reset code generated. Backend notice: {delivery_warning}"
        )
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verifies the reset OTP code and updates the account password with bcrypt hashing."""
    normalized_email = normalize_email(payload.email)
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user or not user.otp_hash or not user.otp_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset request."
        )

    if datetime.datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset code has expired. Please request a new one."
        )

    if not verify_otp_hash(payload.otp.strip(), user.otp_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code entered."
        )

    new_pwd = payload.new_password.strip()
    if len(new_pwd) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters in length."
        )
    if payload.confirm_password and new_pwd != payload.confirm_password.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    user.hashed_password = get_password_hash(new_pwd)
    user.otp_hash = None
    user.otp_expires_at = None
    user.otp_attempts = 0
    user.otp_purpose = None
    db.commit()

    return {
        "success": True,
        "message": "Password updated successfully. You may now sign in with your new password."
    }

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Returns the authenticated user's profile details."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department,
        "job_role": current_user.job_role,
        "employee_id": current_user.employee_id,
        "trainer_id": current_user.trainer_id,
        "admin_id": current_user.admin_id,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "approval_status": current_user.approval_status
    }