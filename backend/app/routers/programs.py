from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, Header, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import User, CertificateRecord
from app.services.wellness_program_service import WellnessProgramService

router = APIRouter(prefix="/programs", tags=["Wellness Programs & Learning"])

def get_optional_user(
    authorization: Optional[str] = Header(None),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Extracts the authenticated user from the Authorization Bearer header,
    or falls back to email query parameter, or defaults to first employee.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
        payload = decode_access_token(token)
        if payload:
            user_id = payload.get("sub")
            user_email = payload.get("email")
            user = None
            if user_id and str(user_id).isdigit():
                user = db.query(User).filter(User.id == int(user_id)).first()
            if not user and user_email:
                user = db.query(User).filter(User.email == user_email.lower().strip()).first()
            if user:
                return user

    if email and email.strip():
        user = db.query(User).filter(User.email == email.strip().lower()).first()
        if user:
            return user

    # Default to sample employee user
    user = db.query(User).filter(User.role == "employee").first()
    if not user:
        user = User(
            name="Bhavana Thota",
            email="employee@company.com",
            role="employee",
            department="Engineering",
            job_role="Senior Software Engineer",
            employee_id="EMP-1001",
            is_active=True,
            is_verified=True,
            approval_status="approved"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

# Schemas
class ModuleCompleteInput(BaseModel):
    practical_notes: Optional[str] = None

class QuizSubmitInput(BaseModel):
    answers: List[int]

class VerificationSubmitInput(BaseModel):
    reflection_notes: str

class TrainerVerifyInput(BaseModel):
    enrollment_id: int
    action: str # "approve" or "reject"
    feedback: str
    observations: Optional[str] = ""

@router.get("")
def list_programs(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    List all catalog programs, segregated into Assigned, Recommended, In Progress, and Completed.
    """
    data = WellnessProgramService.list_programs_for_user(
        db=db,
        user=user,
        category=category,
        status=status_filter,
        search=search
    )
    return data

@router.get("/details/{program_id_or_slug}")
def get_program_details(
    program_id_or_slug: str,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve dedicated program details with modules, educational materials, and quiz questions.
    """
    return WellnessProgramService.get_program_details(db, program_id_or_slug, user)

@router.post("/{program_id}/enroll")
def enroll_program(
    program_id: int,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Enroll employee into a specific wellness program.
    """
    try:
        return WellnessProgramService.enroll_program(db, user, program_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{program_id}/modules/{module_id}/complete")
def complete_module(
    program_id: int,
    module_id: int,
    payload: Optional[ModuleCompleteInput] = None,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Mark an educational module complete and save practical notes.
    """
    notes = payload.practical_notes if payload else None
    return WellnessProgramService.complete_module(db, user, program_id, module_id, notes)

@router.post("/{program_id}/quiz/submit")
def submit_quiz(
    program_id: int,
    payload: QuizSubmitInput,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Submit multiple-choice quiz answers. Validated against the backend.
    """
    try:
        return WellnessProgramService.submit_quiz(db, user, program_id, payload.answers)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{program_id}/submit-verification")
def submit_for_verification(
    program_id: int,
    payload: VerificationSubmitInput,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Submit completed program and practical notes to assigned specialist for verification.
    """
    try:
        return WellnessProgramService.submit_for_trainer_verification(
            db, user, program_id, payload.reflection_notes
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/trainer/reviews")
def get_trainer_reviews(
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    List submissions in the review queue for occupational specialists.
    """
    return {"reviews": WellnessProgramService.trainer_get_reviews_queue(db, user)}

@router.post("/trainer/verify")
def trainer_verify_submission(
    payload: TrainerVerifyInput,
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Trainer approves or rejects program completion.
    Generates verified certificate upon approval.
    """
    try:
        return WellnessProgramService.trainer_verify(
            db=db,
            enrollment_id=payload.enrollment_id,
            trainer_user=user,
            action=payload.action,
            feedback=payload.feedback,
            observations=payload.observations or ""
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/certificate/{certificate_id}")
def verify_certificate_public(
    certificate_id: str,
    db: Session = Depends(get_db)
):
    """
    Public QR code verification endpoint for corporate certificates.
    """
    cert = WellnessProgramService.get_public_certificate(db, certificate_id)
    if not cert:
        raise HTTPException(
            status_code=404,
            detail=f"Certificate ID '{certificate_id}' was not found in the official registry or has been revoked."
        )
    return cert

@router.get("/my-certificates")
def get_user_certificates(
    user: User = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Returns all certificates issued to the current employee.
    """
    certs = db.query(CertificateRecord).filter(
        CertificateRecord.user_id == user.id
    ).order_by(CertificateRecord.issued_at.desc()).all()

    return {
        "certificates": [
            {
                "certificateId": c.certificate_id,
                "programTitle": c.program_title,
                "programCategory": c.program_category,
                "employeeName": c.employee_name,
                "trainerName": c.trainer_name,
                "issuedAt": c.issue_date_str,
                "status": c.status,
                "qrUrl": c.qr_verification_url
            }
            for c in certs
        ]
    }
