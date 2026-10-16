import sys
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.entities import User, AuditLog

def bootstrap_admin_account(db: Session = None, force_reset: bool = False) -> None:
    """
    Controlled backend bootstrap for the initial Platform Administrator account.
    Ensures that Admin credentials originate securely from environment variables,
    never from public frontend registration.
    """
    close_db_when_done = False
    if db is None:
        db = SessionLocal()
        close_db_when_done = True

    try:
        admin_email = settings.ADMIN_BOOTSTRAP_EMAIL.strip().lower()
        admin_password = settings.ADMIN_BOOTSTRAP_PASSWORD.strip()
        admin_name = settings.ADMIN_BOOTSTRAP_NAME.strip()

        existing_admin = db.query(User).filter(User.email == admin_email).first()

        if not existing_admin:
            # Check if any admin exists
            any_admin = db.query(User).filter(User.role == "admin").first()
            if not any_admin or force_reset:
                new_admin = User(
                    name=admin_name,
                    email=admin_email,
                    role="admin",
                    admin_id="ADM-001",
                    employee_id="ADM-001",
                    department="Health Directorate & Executive Safety",
                    job_role="Chief Occupational Health Director",
                    hashed_password=get_password_hash(admin_password),
                    is_active=True,
                    is_verified=True,
                    approval_status="approved"
                )
                db.add(new_admin)
                db.commit()
                db.refresh(new_admin)

                log = AuditLog(
                    user_email=admin_email,
                    action="ADMIN_BOOTSTRAP_CREATED",
                    category="Security",
                    details="Platform administrator bootstrap account created securely."
                )
                db.add(log)
                db.commit()
                print(f"[BOOTSTRAP] Administrator account initialized for '{admin_email}'.")
        else:
            # Ensure existing admin has password hashed, verified status, and admin role
            needs_update = False
            if force_reset or not existing_admin.hashed_password:
                existing_admin.hashed_password = get_password_hash(admin_password)
                needs_update = True
            if not existing_admin.is_verified:
                existing_admin.is_verified = True
                needs_update = True
            if existing_admin.approval_status != "approved":
                existing_admin.approval_status = "approved"
                needs_update = True
            if existing_admin.role != "admin":
                existing_admin.role = "admin"
                needs_update = True

            if needs_update:
                db.commit()
                print(f"[BOOTSTRAP] Administrator credentials and verified status updated for '{admin_email}'.")
    except Exception as e:
        db.rollback()
        print(f"[BOOTSTRAP ERROR] Failed to bootstrap administrator: {e}")
    finally:
        if close_db_when_done:
            db.close()

if __name__ == "__main__":
    force = "--reset" in sys.argv
    bootstrap_admin_account(force_reset=force)
