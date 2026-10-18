import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    employee_id = Column(String(50), unique=True, index=True, nullable=True)
    role = Column(String(20), nullable=False, default="employee")  # employee, hr, trainer, admin
    department = Column(String(100), default="Engineering")
    job_role = Column(String(100), default="Software Engineer")
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    approval_status = Column(String(20), default="approved", nullable=False) # approved, pending, rejected
    trainer_id = Column(String(50), unique=True, index=True, nullable=True)
    admin_id = Column(String(50), unique=True, index=True, nullable=True)
    otp_hash = Column(String(255), nullable=True)
    otp_purpose = Column(String(50), nullable=True) # email_verification, password_reset, trainer_activation
    otp_expires_at = Column(DateTime, nullable=True)
    otp_attempts = Column(Integer, default=0, nullable=False)
    otp_last_sent_at = Column(DateTime, nullable=True)
    password_reset_token_hash = Column(String(255), nullable=True)
    password_reset_expires_at = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessments = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    enrolled_programs = relationship("EmployeeProgram", back_populates="user", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    head_name = Column(String(100), default="Department Head")
    total_employees = Column(Integer, default=0)
    avg_risk_score = Column(Float, default=32.0)
    high_risk_count = Column(Integer, default=0)

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    overall_score = Column(Float, default=0.0)
    posture_score = Column(Float, default=0.0)
    activity_score = Column(Float, default=0.0)
    stress_score = Column(Float, default=0.0)
    recovery_score = Column(Float, default=0.0)
    workload_score = Column(Float, default=0.0)
    answers_json = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="assessments")

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False) # Ergonomic Wellness, Stress Management, Fatigue and Sleep Management, Workplace Safety Essentials, Healthy Lifestyle at Work, Digital Eye Care
    tag = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    overview = Column(Text, nullable=True)
    learning_objectives_json = Column(Text, nullable=True)
    trainer_name = Column(String(100), default="Dr. Sarah Jenkins")
    trainer_id = Column(String(50), default="TR-3001")
    trainer_role = Column(String(100), default="Lead Occupational Ergonomist & Physical Therapist")
    duration = Column(String(50), default="3 Weeks")
    total_modules = Column(Integer, default=4)
    target_risk_area = Column(String(50), default="Posture")
    passing_threshold = Column(Integer, default=75)
    requires_trainer_verification = Column(Boolean, default=True)

    modules = relationship("ProgramModule", back_populates="program", cascade="all, delete-orphan", order_by="ProgramModule.module_order")
    quiz = relationship("ProgramQuiz", back_populates="program", uselist=False, cascade="all, delete-orphan")
    enrollments = relationship("EmployeeProgram", back_populates="program", cascade="all, delete-orphan")

class ProgramModule(Base):
    __tablename__ = "program_modules"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    module_order = Column(Integer, nullable=False) # 1, 2, 3, 4
    title = Column(String(200), nullable=False)
    estimated_duration = Column(String(50), default="15 mins")
    summary = Column(Text, nullable=False)
    content_markdown = Column(Text, nullable=False)
    key_takeaways_json = Column(Text, nullable=True)
    practical_activity = Column(Text, nullable=False)
    activity_instructions = Column(Text, nullable=True)

    program = relationship("Program", back_populates="modules")

class ProgramQuiz(Base):
    __tablename__ = "program_quizzes"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False, unique=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    passing_threshold = Column(Integer, default=75)
    questions_json = Column(Text, nullable=False)

    program = relationship("Program", back_populates="quiz")

class EmployeeProgram(Base):
    __tablename__ = "employee_programs"
    __table_args__ = (UniqueConstraint("user_id", "program_id", name="uq_user_program"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    enrollment_source = Column(String(50), default="Recommended") # Assigned, Recommended, Self-Enrolled
    progress = Column(Integer, default=0) # 0 to 100
    status = Column(String(40), default="In Progress") # Not Started, In Progress, Awaiting Verification, Completed, Needs Correction
    completed_module_ids_json = Column(Text, default="[]") # JSON list of module IDs
    practical_notes = Column(Text, nullable=True)
    quiz_passed = Column(Boolean, default=False)
    quiz_score = Column(Float, nullable=True)
    quiz_attempts_count = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    submitted_for_verification_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by_trainer_id = Column(String(50), nullable=True)
    verified_by_trainer_name = Column(String(100), nullable=True)
    trainer_feedback = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    certificate_id = Column(String(50), nullable=True)

    user = relationship("User", back_populates="enrolled_programs")
    program = relationship("Program", back_populates="enrollments")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    enrollment_id = Column(Integer, ForeignKey("employee_programs.id"), nullable=False)
    score_pct = Column(Float, nullable=False)
    passed = Column(Boolean, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    submitted_answers_json = Column(Text, nullable=False)
    attempted_at = Column(DateTime, default=datetime.datetime.utcnow)

class CertificateRecord(Base):
    __tablename__ = "certificates"
    __table_args__ = (UniqueConstraint("user_id", "program_id", name="uq_cert_user_program"),)

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    employee_name = Column(String(120), nullable=False)
    employee_email = Column(String(120), nullable=False)
    employee_id_number = Column(String(50), nullable=True)
    program_title = Column(String(150), nullable=False)
    program_category = Column(String(100), nullable=False)
    trainer_name = Column(String(100), nullable=False)
    trainer_id = Column(String(50), nullable=False)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)
    issue_date_str = Column(String(50), nullable=False)
    status = Column(String(30), default="Valid") # Valid, Revoked
    qr_verification_url = Column(String(255), nullable=False)

class CoachingSession(Base):
    __tablename__ = "coaching_sessions"

    id = Column(Integer, primary_key=True, index=True)
    trainer_name = Column(String(100), default="Dr. Sarah Jenkins")
    employee_name = Column(String(100), nullable=False)
    employee_email = Column(String(120), nullable=False)
    topic = Column(String(150), nullable=False)
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=False)
    status = Column(String(30), default="Scheduled") # Scheduled, Completed, Cancelled
    notes = Column(Text, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(120), nullable=False)
    action = Column(String(100), nullable=False)
    category = Column(String(50), default="Security")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class HealthArticle(Base):
    __tablename__ = "health_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # Diabetes Awareness, Blood Pressure, Healthy Eating, Physical Activity, Sleep Health, Obesity Prevention
    cover_image = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    author = Column(String(120), default="Public Health Editorial Board")
    publication_date = Column(String(50), nullable=False)
    status = Column(String(30), default="Published")  # Draft, Published, Archived
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class HealthCampaign(Base):
    __tablename__ = "health_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    campaign_type = Column(String(100), nullable=False) # Screening Drive, Workshop, Seminar, Vaccination Camp, Fitness Challenge
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=False)
    venue = Column(String(200), nullable=False)
    registration_deadline = Column(String(50), nullable=False)
    capacity = Column(Integer, default=50)
    contact_details = Column(String(150), nullable=False)
    status = Column(String(30), default="Upcoming") # Upcoming, Ongoing, Completed, Cancelled
    registrations_count = Column(Integer, default=0)
    attendance_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class HealthResource(Base):
    __tablename__ = "health_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False) # Diabetes Awareness, Blood Pressure, Healthy Eating, Physical Activity, Sleep Health, Obesity Prevention
    resource_type = Column(String(50), nullable=False) # PDF Guide, Health Document, Awareness Poster, Educational Video
    file_url = Column(String(255), nullable=False)
    upload_date = Column(String(50), nullable=False)
    status = Column(String(30), default="Published") # Published, Draft, Archived
    views_count = Column(Integer, default=0)
    downloads_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CampaignParticipant(Base):
    __tablename__ = "campaign_participants"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("health_campaigns.id"), nullable=False)
    participant_name = Column(String(120), nullable=False)
    participant_email = Column(String(120), nullable=False)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)
    attended = Column(Boolean, default=False)

