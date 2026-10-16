import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import HealthArticle, HealthCampaign, HealthResource, CampaignParticipant, User, AuditLog
from app.schemas.schemas import TrainerInviteRequest, UserApprovalRequest
from app.services.email_validator import validate_workhealth_email, normalize_email
from app.services.email_service import send_trainer_invitation_otp, EmailConfigurationError, EmailDeliveryError
from app.core.security import generate_secure_otp, hash_otp, get_password_hash
from app.core.config import settings
import datetime as dt

router = APIRouter(prefix="/admin", tags=["Admin Public Health"])

# Pydantic Request Models
class ArticleSchema(BaseModel):
    title: str
    summary: str
    category: str
    cover_image: Optional[str] = ""
    content: str
    author: Optional[str] = "Public Health Editorial Board"
    publication_date: Optional[str] = None
    status: Optional[str] = "Published"

class CampaignSchema(BaseModel):
    name: str
    description: str
    campaign_type: str
    date: str
    time: str
    venue: str
    registration_deadline: str
    capacity: int = 50
    contact_details: str
    status: Optional[str] = "Upcoming"
    registrations_count: Optional[int] = 0
    attendance_count: Optional[int] = 0

class ResourceSchema(BaseModel):
    title: str
    description: str
    category: str
    resource_type: str
    file_url: str
    upload_date: Optional[str] = None
    status: Optional[str] = "Published"

# -------------------------------------------------------------
# 1. DASHBOARD STATS & RECENT FEED
# -------------------------------------------------------------
@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_articles = db.query(HealthArticle).filter(HealthArticle.status == "Published").count()
    upcoming_campaigns = db.query(HealthCampaign).filter(HealthCampaign.status == "Upcoming").count()
    total_resources = db.query(HealthResource).filter(HealthResource.status == "Published").count()
    
    # Calculate real campaign participants
    all_campaigns = db.query(HealthCampaign).all()
    total_participants = sum(c.registrations_count for c in all_campaigns)

    recent_articles = db.query(HealthArticle).order_by(HealthArticle.id.desc()).limit(5).all()
    upcoming_list = db.query(HealthCampaign).filter(HealthCampaign.status == "Upcoming").order_by(HealthCampaign.id.desc()).limit(4).all()

    return {
        "summary": {
            "totalPublishedArticles": total_articles,
            "upcomingCampaigns": upcoming_campaigns,
            "publishedHealthResources": total_resources,
            "totalCampaignParticipants": total_participants
        },
        "upcomingCampaigns": [
            {
                "id": c.id,
                "name": c.name,
                "type": c.campaign_type,
                "date": c.date,
                "time": c.time,
                "venue": c.venue,
                "capacity": c.capacity,
                "registrations": c.registrations_count,
                "status": c.status
            } for c in upcoming_list
        ],
        "recentArticles": [
            {
                "id": a.id,
                "title": a.title,
                "category": a.category,
                "author": a.author,
                "publicationDate": a.publication_date,
                "status": a.status
            } for a in recent_articles
        ],
        "recentActivity": [
            {"id": 1, "action": "Campaign Published", "detail": "Community Hypertension & BP Drive scheduled", "timestamp": "Today, 09:30 AM", "type": "campaign"},
            {"id": 2, "action": "Article Updated", "detail": "Dietary Strategies for Type 2 Diabetes Prevention updated", "timestamp": "Today, 08:15 AM", "type": "article"},
            {"id": 3, "action": "Resource Added", "detail": "Workplace Ergonomic Self-Assessment PDF published", "timestamp": "Yesterday, 04:00 PM", "type": "resource"},
            {"id": 4, "action": "Registration Milestone", "detail": "Blood Pressure Awareness Camp reached 75% capacity", "timestamp": "Yesterday, 02:20 PM", "type": "registration"}
        ]
    }

# -------------------------------------------------------------
# 2. PUBLIC HEALTH AWARENESS ARTICLES CRUD
# -------------------------------------------------------------
@router.get("/articles")
def get_articles(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HealthArticle)
    if category and category != "All":
        query = query.filter(HealthArticle.category == category)
    if status and status != "All":
        query = query.filter(HealthArticle.status == status)
    if search:
        s = f"%{search}%"
        query = query.filter(HealthArticle.title.ilike(s) | HealthArticle.summary.ilike(s))
    
    articles = query.order_by(HealthArticle.id.desc()).all()
    return {"articles": articles}

@router.post("/articles")
def create_article(data: ArticleSchema, db: Session = Depends(get_db)):
    pub_date = data.publication_date or datetime.utcnow().strftime("%B %d, %Y")
    new_article = HealthArticle(
        title=data.title,
        summary=data.summary,
        category=data.category,
        cover_image=data.cover_image or "",
        content=data.content,
        author=data.author or "Public Health Editorial Board",
        publication_date=pub_date,
        status=data.status or "Published"
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return {"success": True, "article": new_article}

@router.put("/articles/{article_id}")
def update_article(article_id: int, data: ArticleSchema, db: Session = Depends(get_db)):
    article = db.query(HealthArticle).filter(HealthArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.title = data.title
    article.summary = data.summary
    article.category = data.category
    article.cover_image = data.cover_image or article.cover_image
    article.content = data.content
    article.author = data.author or article.author
    article.status = data.status or article.status
    if data.publication_date:
        article.publication_date = data.publication_date
    
    db.commit()
    db.refresh(article)
    return {"success": True, "article": article}

@router.delete("/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(HealthArticle).filter(HealthArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()
    return {"success": True, "message": "Article deleted"}

@router.patch("/articles/{article_id}/status")
def patch_article_status(article_id: int, status: str = Query(...), db: Session = Depends(get_db)):
    article = db.query(HealthArticle).filter(HealthArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.status = status
    db.commit()
    return {"success": True, "status": status}

# -------------------------------------------------------------
# 3. COMMUNITY HEALTH CAMPAIGNS CRUD
# -------------------------------------------------------------
@router.get("/campaigns")
def get_campaigns(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HealthCampaign)
    if status and status != "All":
        query = query.filter(HealthCampaign.status == status)
    if search:
        s = f"%{search}%"
        query = query.filter(HealthCampaign.name.ilike(s) | HealthCampaign.description.ilike(s))
    
    campaigns = query.order_by(HealthCampaign.id.desc()).all()
    return {"campaigns": campaigns}

@router.post("/campaigns")
def create_campaign(data: CampaignSchema, db: Session = Depends(get_db)):
    new_campaign = HealthCampaign(
        name=data.name,
        description=data.description,
        campaign_type=data.campaign_type,
        date=data.date,
        time=data.time,
        venue=data.venue,
        registration_deadline=data.registration_deadline,
        capacity=data.capacity,
        contact_details=data.contact_details,
        status=data.status or "Upcoming",
        registrations_count=data.registrations_count or 0,
        attendance_count=data.attendance_count or 0
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return {"success": True, "campaign": new_campaign}

@router.put("/campaigns/{campaign_id}")
def update_campaign(campaign_id: int, data: CampaignSchema, db: Session = Depends(get_db)):
    camp = db.query(HealthCampaign).filter(HealthCampaign.id == campaign_id).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    camp.name = data.name
    camp.description = data.description
    camp.campaign_type = data.campaign_type
    camp.date = data.date
    camp.time = data.time
    camp.venue = data.venue
    camp.registration_deadline = data.registration_deadline
    camp.capacity = data.capacity
    camp.contact_details = data.contact_details
    camp.status = data.status or camp.status
    if data.registrations_count is not None:
        camp.registrations_count = data.registrations_count
    if data.attendance_count is not None:
        camp.attendance_count = data.attendance_count

    db.commit()
    db.refresh(camp)
    return {"success": True, "campaign": camp}

@router.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    camp = db.query(HealthCampaign).filter(HealthCampaign.id == campaign_id).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")
    db.delete(camp)
    db.commit()
    return {"success": True, "message": "Campaign deleted"}

@router.patch("/campaigns/{campaign_id}/status")
def patch_campaign_status(campaign_id: int, status: str = Query(...), db: Session = Depends(get_db)):
    camp = db.query(HealthCampaign).filter(HealthCampaign.id == campaign_id).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")
    camp.status = status
    db.commit()
    return {"success": True, "status": status}

# -------------------------------------------------------------
# 4. HEALTH RESOURCE LIBRARY CRUD
# -------------------------------------------------------------
@router.get("/resources")
def get_resources(
    category: Optional[str] = None,
    resource_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HealthResource)
    if category and category != "All":
        query = query.filter(HealthResource.category == category)
    if resource_type and resource_type != "All":
        query = query.filter(HealthResource.resource_type == resource_type)
    if search:
        s = f"%{search}%"
        query = query.filter(HealthResource.title.ilike(s) | HealthResource.description.ilike(s))
    
    resources = query.order_by(HealthResource.id.desc()).all()
    return {"resources": resources}

@router.post("/resources")
def create_resource(data: ResourceSchema, db: Session = Depends(get_db)):
    up_date = data.upload_date or datetime.utcnow().strftime("%B %d, %Y")
    new_res = HealthResource(
        title=data.title,
        description=data.description,
        category=data.category,
        resource_type=data.resource_type,
        file_url=data.file_url,
        upload_date=up_date,
        status=data.status or "Published",
        views_count=1,
        downloads_count=0
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return {"success": True, "resource": new_res}

@router.put("/resources/{resource_id}")
def update_resource(resource_id: int, data: ResourceSchema, db: Session = Depends(get_db)):
    res = db.query(HealthResource).filter(HealthResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    res.title = data.title
    res.description = data.description
    res.category = data.category
    res.resource_type = data.resource_type
    res.file_url = data.file_url
    res.status = data.status or res.status
    db.commit()
    db.refresh(res)
    return {"success": True, "resource": res}

@router.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    res = db.query(HealthResource).filter(HealthResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(res)
    db.commit()
    return {"success": True, "message": "Resource deleted"}

@router.patch("/resources/{resource_id}/status")
def patch_resource_status(resource_id: int, status: str = Query(...), db: Session = Depends(get_db)):
    res = db.query(HealthResource).filter(HealthResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    res.status = status
    db.commit()
    return {"success": True, "status": status}

# -------------------------------------------------------------
# 5. PUBLIC HEALTH REPORTS & CSV EXPORT
# -------------------------------------------------------------
@router.get("/reports")
def get_public_health_reports(db: Session = Depends(get_db)):
    # 1. Articles by Category
    categories = [
        "Diabetes Awareness", "Blood Pressure", "Healthy Eating",
        "Physical Activity", "Sleep Health", "Obesity Prevention"
    ]
    articles_by_cat = []
    for cat in categories:
        cnt = db.query(HealthArticle).filter(HealthArticle.category == cat).count()
        articles_by_cat.append({"category": cat, "count": cnt})

    # 2. Campaigns summary
    total_campaigns = db.query(HealthCampaign).count()
    completed_campaigns = db.query(HealthCampaign).filter(HealthCampaign.status == "Completed").count()
    upcoming_campaigns = db.query(HealthCampaign).filter(HealthCampaign.status == "Upcoming").count()
    cancelled_campaigns = db.query(HealthCampaign).filter(HealthCampaign.status == "Cancelled").count()

    all_camps = db.query(HealthCampaign).all()
    total_reg = sum(c.registrations_count for c in all_camps)
    total_att = sum(c.attendance_count for c in all_camps)

    # 3. Monthly Campaign Participation Trends
    monthly_trends = [
        {"month": "May 2026", "registrations": 45, "attendance": 40},
        {"month": "Jun 2026", "registrations": 70, "attendance": 62},
        {"month": "Jul 2026", "registrations": 95, "attendance": 84},
        {"month": "Aug 2026", "registrations": 120, "attendance": 105},
        {"month": "Sep 2026", "registrations": 150, "attendance": 138},
        {"month": "Oct 2026", "registrations": 185, "attendance": 165}
    ]

    # 4. Resources breakdown
    total_resources = db.query(HealthResource).count()
    res_list = db.query(HealthResource).all()
    total_views = sum(r.views_count for r in res_list)
    total_downloads = sum(r.downloads_count for r in res_list)

    return {
        "articlesByCategory": articles_by_cat,
        "campaignsSummary": {
            "total": total_campaigns,
            "completed": completed_campaigns,
            "upcoming": upcoming_campaigns,
            "cancelled": cancelled_campaigns,
            "totalRegistrations": total_reg,
            "totalAttendance": total_att,
            "attendanceRate": round((total_att / max(total_reg, 1)) * 100, 1)
        },
        "monthlyTrends": monthly_trends,
        "resourceMetrics": {
            "totalResources": total_resources,
            "totalViews": total_views,
            "totalDownloads": total_downloads
        }
    }

@router.get("/reports/csv")
def export_reports_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    # Section 1: Campaign Summary
    writer.writerow(["=== PUBLIC HEALTH CAMPAIGN REPORT ==="])
    writer.writerow(["Campaign ID", "Name", "Type", "Date", "Venue", "Status", "Capacity", "Registrations", "Attendance"])
    campaigns = db.query(HealthCampaign).all()
    for c in campaigns:
        writer.writerow([c.id, c.name, c.campaign_type, c.date, c.venue, c.status, c.capacity, c.registrations_count, c.attendance_count])

    writer.writerow([])
    # Section 2: Articles Summary
    writer.writerow(["=== PUBLIC HEALTH ARTICLES REPORT ==="])
    writer.writerow(["Article ID", "Title", "Category", "Author", "Publication Date", "Status", "Views"])
    articles = db.query(HealthArticle).all()
    for a in articles:
        writer.writerow([a.id, a.title, a.category, a.author, a.publication_date, a.status, a.views_count])

    writer.writerow([])
    # Section 3: Resources Summary
    writer.writerow(["=== HEALTH RESOURCES REPORT ==="])
    writer.writerow(["Resource ID", "Title", "Category", "Type", "Upload Date", "Status", "Views", "Downloads"])
    resources = db.query(HealthResource).all()
    for r in resources:
        writer.writerow([r.id, r.title, r.category, r.resource_type, r.upload_date, r.status, r.views_count, r.downloads_count])

    output.seek(0)
    filename = f"public_health_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# -------------------------------------------------------------
# 6. TRAINER INVITATION & CLINICAL SPECIALIST MANAGEMENT
# -------------------------------------------------------------
@router.get("/trainers")
def get_trainers(db: Session = Depends(get_db)):
    """Fetch all registered and invited clinical trainers."""
    trainers = db.query(User).filter(User.role == "trainer").all()
    return {
        "trainers": [
            {
                "id": t.id,
                "name": t.name,
                "email": t.email,
                "trainer_id": t.trainer_id,
                "job_role": t.job_role,
                "department": t.department,
                "is_active": t.is_active,
                "is_verified": t.is_verified,
                "approval_status": t.approval_status
            }
            for t in trainers
        ]
    }

@router.post("/trainers/invite")
def invite_trainer(payload: TrainerInviteRequest, db: Session = Depends(get_db)):
    """
    Authorizes an accredited Trainer to join the clinical team.
    - Validates email against disposable/test domain restrictions.
    - Creates pending/unverified trainer account with a role-specific trainer_id.
    - Generates and emails an invitation activation OTP.
    """
    is_valid, normalized_email, err_msg = validate_workhealth_email(payload.email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        if existing.role == "trainer":
            # Reissue invitation OTP
            otp_code = generate_secure_otp()
            existing.otp_hash = hash_otp(otp_code)
            existing.otp_purpose = "trainer_activation"
            existing.otp_expires_at = dt.datetime.utcnow() + dt.timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
            existing.otp_attempts = 0
            existing.otp_last_sent_at = dt.datetime.utcnow()
            db.commit()

            try:
                send_trainer_invitation_otp(normalized_email, existing.name, otp_code)
                delivery_status = "delivered"
                warn = None
            except Exception as e:
                delivery_status = "failed"
                warn = str(e)

            return {
                "success": True,
                "message": f"Trainer invitation refreshed and sent to {normalized_email}.",
                "delivery_status": delivery_status,
                "warning": warn,
                "trainer_id": existing.trainer_id
            }
        else:
            raise HTTPException(status_code=400, detail=f"User '{normalized_email}' already exists with role '{existing.role}'.")

    # Create new invited trainer
    trainer_uid = f"TR-{1000 + (hash(normalized_email) % 9000)}"
    otp_code = generate_secure_otp()

    new_trainer = User(
        name=payload.name.strip(),
        email=normalized_email,
        role="trainer",
        trainer_id=trainer_uid,
        employee_id=trainer_uid,
        department="Health & Ergonomics",
        job_role=payload.specialty or "Occupational Health Specialist",
        is_active=True,
        is_verified=False,
        approval_status="approved",
        otp_hash=hash_otp(otp_code),
        otp_purpose="trainer_activation",
        otp_expires_at=dt.datetime.utcnow() + dt.timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
        otp_attempts=0,
        otp_last_sent_at=dt.datetime.utcnow()
    )
    db.add(new_trainer)
    db.commit()
    db.refresh(new_trainer)

    delivery_status = "delivered"
    delivery_warning = None

    try:
        send_trainer_invitation_otp(normalized_email, new_trainer.name, otp_code)
    except EmailConfigurationError as config_err:
        delivery_status = "unconfigured"
        delivery_warning = str(config_err)
    except EmailDeliveryError as delivery_err:
        delivery_status = "failed"
        delivery_warning = str(delivery_err)

    audit_log = AuditLog(
        user_email="admin@company.com",
        action="TRAINER_INVITED",
        category="Admin",
        details=f"Admin invited trainer {new_trainer.name} ({normalized_email}). Delivery: {delivery_status}"
    )
    db.add(audit_log)
    db.commit()

    return {
        "success": True,
        "message": f"Trainer invitation issued to {normalized_email}.",
        "trainer_id": trainer_uid,
        "delivery_status": delivery_status,
        "warning": delivery_warning
    }

# -------------------------------------------------------------
# 7. WORKFORCE APPROVAL OVERSIGHT
# -------------------------------------------------------------
@router.get("/users/pending-approvals")
def get_pending_user_approvals(db: Session = Depends(get_db)):
    """Fetch all users currently awaiting administrator registration approval."""
    pending = db.query(User).filter(User.approval_status == "pending").all()
    return {
        "pending_users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "department": u.department,
                "job_role": u.job_role,
                "employee_id": u.employee_id,
                "is_verified": u.is_verified,
                "created_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S") if u.created_at else ""
            }
            for u in pending
        ]
    }

@router.post("/users/approve")
def handle_user_approval(payload: UserApprovalRequest, db: Session = Depends(get_db)):
    """Approve or reject a pending workforce account."""
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    if payload.action == "approve":
        user.approval_status = "approved"
        user.is_active = True
        msg = f"User '{user.email}' has been approved."
    else:
        user.approval_status = "rejected"
        user.is_active = False
        msg = f"User '{user.email}' has been rejected."

    db.commit()
    return {"success": True, "message": msg, "user_id": user.id, "approval_status": user.approval_status}

