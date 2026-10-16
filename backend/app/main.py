from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.core.bootstrap import bootstrap_admin_account
from app.models.entities import User, Department, Program, HealthArticle, HealthCampaign, HealthResource
from app.routers import auth, employee, hr, trainer, admin

def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if users already seeded
        default_pwd = get_password_hash("Corporate2026!")
        if db.query(User).count() == 0:
            sample_users = [
                User(name="Bhavana Thota", email="employee@company.com", role="employee", department="Engineering", job_role="Senior Software Engineer", employee_id="EMP-1001", hashed_password=default_pwd, is_verified=True, approval_status="approved"),
                User(name="Amanda Taylor", email="hr@company.com", role="hr", department="Human Resources", job_role="VP Workplace Health & People", employee_id="HR-2001", hashed_password=default_pwd, is_verified=True, approval_status="approved"),
                User(name="Marcus Vance", email="trainer@company.com", role="trainer", department="Health & Ergonomics", job_role="Lead Physical Therapist", employee_id="TR-3001", trainer_id="TR-3001", hashed_password=default_pwd, is_verified=True, approval_status="approved"),
            ]
            db.add_all(sample_users)
            db.commit()

        # Run controlled administrator bootstrap
        bootstrap_admin_account(db)

        # Ensure existing accounts have passwords and verified status
        existing_users = db.query(User).all()
        for u in existing_users:
            if not u.hashed_password:
                u.hashed_password = default_pwd
            if not u.is_verified:
                u.is_verified = True
            if not u.approval_status:
                u.approval_status = "approved"
        db.commit()

        if db.query(Department).count() == 0:
            sample_depts = [
                Department(name="Engineering", code="ENG", head_name="David Chen", total_employees=95, avg_risk_score=38.5, high_risk_count=8),
                Department(name="Sales & Marketing", code="SAL", head_name="Sophia Martinez", total_employees=65, avg_risk_score=32.1, high_risk_count=4),
                Department(name="Operations", code="OPS", head_name="Michael Ross", total_employees=52, avg_risk_score=36.4, high_risk_count=4),
                Department(name="Finance & Legal", code="FIN", head_name="Rachel Green", total_employees=38, avg_risk_score=29.8, high_risk_count=1),
                Department(name="Human Resources", code="HRD", head_name="Amanda Taylor", total_employees=30, avg_risk_score=24.5, high_risk_count=1),
            ]
            db.add_all(sample_depts)

        if db.query(Program).count() == 0:
            sample_progs = [
                Program(title="Ergonomic Workstation Improvement", category="Posture", description="Workstation layout optimization and monitor positioning.", trainer_name="Dr. Sarah Jenkins", duration="4 Weeks", total_modules=6, target_risk_area="Posture"),
                Program(title="Workday Movement & Mobility Program", category="Activity", description="Structured micro-breaks and mobility routines for desk-bound employees.", trainer_name="Marcus Vance", duration="3 Weeks", total_modules=5, target_risk_area="Activity"),
                Program(title="Stress Recovery & Resilience Program", category="Stress", description="Cognitive reset and autonomic nervous regulation techniques.", trainer_name="Elena Rostova", duration="4 Weeks", total_modules=6, target_risk_area="Stress"),
                Program(title="Healthy Sleep & Recovery Protocol", category="Recovery", description="Circadian alignment and evening boundary management.", trainer_name="Dr. Sarah Jenkins", duration="2 Weeks", total_modules=4, target_risk_area="Recovery")
            ]
            db.add_all(sample_progs)

        # Seed Health Articles
        if db.query(HealthArticle).count() == 0:
            sample_articles = [
                HealthArticle(
                    title="Early Detection & Dietary Strategies for Type 2 Diabetes Prevention",
                    summary="Evidence-based dietary guidelines to stabilize blood glucose and reduce insulin resistance in sedentary desk workers.",
                    category="Diabetes Awareness",
                    cover_image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop",
                    content="Sedentary corporate schedules and irregular meal cadence are prominent drivers of insulin resistance. Incorporating soluble fiber, managing glycemic index, and taking 10-minute post-meal strolls substantially blunt postprandial glucose spikes.",
                    author="Dr. Anita Desai, MD (Endocrinology)",
                    publication_date="October 04, 2026",
                    status="Published",
                    views_count=142
                ),
                HealthArticle(
                    title="Workday Blood Pressure Management: The Hidden Impact of Chronic Stress",
                    summary="Understanding sympathetic nervous arousal, sodium intake, and breathing techniques to maintain healthy cardiovascular metrics.",
                    category="Blood Pressure",
                    cover_image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
                    content="Elevated workplace tension often translates into sustained arterial vasoconstriction. Adopting box-breathing protocols and monitoring sodium consumption help preserve endothelial elasticity and stabilize systolic pressure.",
                    author="Dr. Vikram Sen, Cardiologist",
                    publication_date="September 28, 2026",
                    status="Published",
                    views_count=98
                ),
                HealthArticle(
                    title="Optimizing Circadian Sleep Architecture for Cognitive Stamina",
                    summary="How blue light reduction and evening wind-down rituals restore deep slow-wave sleep and memory consolidation.",
                    category="Sleep Health",
                    cover_image="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop",
                    content="Disruptions in slow-wave sleep diminish prefrontal cortex clarity the following workday. Ceasing electronic screen exposure 45 minutes prior to sleep and maintaining a cool room temperature ensure optimal REM and NREM cycles.",
                    author="Elena Rostova, Sleep & Autonomic Coach",
                    publication_date="September 20, 2026",
                    status="Published",
                    views_count=185
                ),
                HealthArticle(
                    title="Ergonomics & Desk-Side Movement: Preventing Obesity & Metabolic Slump",
                    summary="Actionable micro-movement sequences to stimulate lymphatic drainage and boost daily non-exercise physical activity.",
                    category="Physical Activity",
                    cover_image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
                    content="Sitting continuously for beyond 6 hours slows lipoprotein lipase activity by up to 90%. Integrating 50/10 work-to-movement rhythms reactivates lower limb muscle pumps and boosts daily metabolic rate.",
                    author="Marcus Vance, Physical Therapist",
                    publication_date="October 08, 2026",
                    status="Published",
                    views_count=210
                )
            ]
            db.add_all(sample_articles)

        # Seed Health Campaigns
        if db.query(HealthCampaign).count() == 0:
            sample_camps = [
                HealthCampaign(
                    name="Community Blood Pressure & Cardiovascular Screening Camp",
                    description="Free comprehensive blood pressure assessment, arterial stiffness check, and on-site clinical consultation with cardiology specialists.",
                    campaign_type="Screening Drive",
                    date="October 28, 2026",
                    time="09:00 AM - 02:00 PM",
                    venue="Community Health Center, Block A Auditorium",
                    registration_deadline="October 26, 2026",
                    capacity=120,
                    contact_details="health-events@communitycare.org | (555) 234-5678",
                    status="Upcoming",
                    registrations_count=84,
                    attendance_count=0
                ),
                HealthCampaign(
                    name="Workplace Diabetes Risk & Glucose Awareness Drive",
                    description="HbA1c rapid testing, personalized nutrition counseling, and interactive meal-planning workshop for high-risk individuals.",
                    campaign_type="Workshop & Screening",
                    date="November 05, 2026",
                    time="10:00 AM - 04:00 PM",
                    venue="Civic Wellness Pavilion, 2nd Floor",
                    registration_deadline="November 02, 2026",
                    capacity=100,
                    contact_details="diabetes-initiative@publichealth.gov | (555) 890-1234",
                    status="Upcoming",
                    registrations_count=62,
                    attendance_count=0
                ),
                HealthCampaign(
                    name="Active Spine & Ergonomic Posture Masterclass",
                    description="Hands-on workstation alignment session led by certified ergonomists. Practical drills to counteract desk slump and neck pain.",
                    campaign_type="Interactive Workshop",
                    date="September 15, 2026",
                    time="02:00 PM - 05:00 PM",
                    venue="Corporate Townhall Main Stage",
                    registration_deadline="September 12, 2026",
                    capacity=80,
                    contact_details="ergonomics-team@workhealth.org | (555) 678-9012",
                    status="Completed",
                    registrations_count=78,
                    attendance_count=74
                )
            ]
            db.add_all(sample_camps)

        # Seed Health Resources
        if db.query(HealthResource).count() == 0:
            sample_resources = [
                HealthResource(
                    title="Comprehensive Diabetes Diet & Glycemic Index Guide",
                    description="16-page clinician-approved handbook detailing glycemic indices, meal prep templates, and healthy carbohydrate swaps.",
                    category="Diabetes Awareness",
                    resource_type="PDF Guide",
                    file_url="https://www.who.int/publications/i/item/9789241565257",
                    upload_date="October 02, 2026",
                    status="Published",
                    views_count=320,
                    downloads_count=184
                ),
                HealthResource(
                    title="OSHA-Aligned Ergonomic Workstation Calibration Poster",
                    description="High-resolution visual infographic illustrating 90-degree arm alignment, eye-level monitor height, and lumbar support adjustments.",
                    category="Physical Activity",
                    resource_type="Awareness Poster",
                    file_url="https://www.osha.gov/etools/computer-workstations/components",
                    upload_date="September 24, 2026",
                    status="Published",
                    views_count=540,
                    downloads_count=412
                ),
                HealthResource(
                    title="Hypertension Care Protocol & Home BP Monitoring Log",
                    description="Printable blood pressure tracking sheet with physician thresholds and morning/evening measurement best practices.",
                    category="Blood Pressure",
                    resource_type="Health Document",
                    file_url="https://www.heart.org/en/health-topics/high-blood-pressure",
                    upload_date="September 18, 2026",
                    status="Published",
                    views_count=215,
                    downloads_count=145
                ),
                HealthResource(
                    title="Autonomic Nervous System Reset: 5-Minute Guided Audio Video",
                    description="Clinical diaphragmatic respiration walkthrough to reduce sympathetic tone and reduce workplace cortisol surges.",
                    category="Sleep Health",
                    resource_type="Educational Video",
                    file_url="https://www.youtube.com/watch?v=tybOi4hjZFQ",
                    upload_date="October 05, 2026",
                    status="Published",
                    views_count=430,
                    downloads_count=89
                )
            ]
            db.add_all(sample_resources)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup database tables on startup
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Corporate Occupational Health, Risk Screening & Wellbeing Platform REST API",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(employee.router, prefix="/api")
app.include_router(hr.router, prefix="/api")
app.include_router(trainer.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "Online",
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
