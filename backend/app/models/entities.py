import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
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
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # Posture, Activity, Stress, Recovery, General
    description = Column(Text, nullable=False)
    trainer_name = Column(String(100), default="Dr. Sarah Jenkins")
    duration = Column(String(50), default="4 Weeks")
    total_modules = Column(Integer, default=6)
    target_risk_area = Column(String(50), default="Posture")

class EmployeeProgram(Base):
    __tablename__ = "employee_programs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    progress = Column(Integer, default=0)
    status = Column(String(30), default="In Progress")
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="enrolled_programs")
    program = relationship("Program")

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

