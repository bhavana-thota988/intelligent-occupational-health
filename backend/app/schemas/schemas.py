from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "employee"
    department: Optional[str] = "Engineering"
    job_role: Optional[str] = "Software Engineer"
    employee_id: Optional[str] = None
    trainer_id: Optional[str] = None
    admin_id: Optional[str] = None

class UserCreate(UserBase):
    password: str
    confirm_password: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=6, max_length=254)
    password: str = Field(..., min_length=6, max_length=128)
    confirm_password: Optional[str] = None
    department: Optional[str] = "Engineering"
    job_role: Optional[str] = "Software Engineer"
    employee_id: Optional[str] = None
    trainer_id: Optional[str] = None
    professional_role: Optional[str] = None
    role: Optional[str] = "employee"

class VerifyOTPRequest(BaseModel):
    email: str = Field(..., min_length=6, max_length=254)
    otp: str = Field(..., min_length=6, max_length=6)
    purpose: Optional[str] = "email_verification"

class ResendOTPRequest(BaseModel):
    email: str = Field(..., min_length=6, max_length=254)
    purpose: Optional[str] = "email_verification"

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=6, max_length=254)

class ResetPasswordRequest(BaseModel):
    email: str = Field(..., min_length=6, max_length=254)
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6, max_length=128)
    confirm_password: Optional[str] = None

class TrainerInviteRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=6, max_length=254)
    title: Optional[str] = "Occupational Health Specialist"
    specialty: Optional[str] = "Musculoskeletal Ergonomics & Posture"
    degrees: Optional[str] = "PT, CPE"
    phone: Optional[str] = None

class UserApprovalRequest(BaseModel):
    user_id: int
    action: str = Field(..., pattern="^(approve|reject)$")
    notes: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str
    requested_portal: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    approval_status: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class AssessmentInput(BaseModel):
    user_email: str
    answers: Dict[int, int]
    category_scores: Dict[str, float]
    overall_score: float

class AssessmentResponse(BaseModel):
    id: int
    overall_score: float
    posture_score: float
    activity_score: float
    stress_score: float
    recovery_score: float
    workload_score: float
    completed_at: str

class ProgramResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    trainer_name: str
    duration: str
    total_modules: int
    target_risk_area: str
    progress: Optional[int] = 0
    status: Optional[str] = "Not Started"

class SessionCreate(BaseModel):
    trainer_name: str
    employee_name: str
    employee_email: str
    topic: str
    date: str
    time: str
    notes: Optional[str] = None
