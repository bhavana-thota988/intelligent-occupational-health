from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(prefix="/hr", tags=["HR Analytics"])

@router.get("/stats")
def get_hr_stats(db: Session = Depends(get_db)):
    return {
        "employeesAssessed": 248,
        "totalEmployees": 280,
        "completionRate": 88.6,
        "avgRiskScore": 34.2,
        "highRiskCount": 18,
        "moderateRiskCount": 76,
        "lowRiskCount": 154,
        "activeWellnessPrograms": 5,
        "totalInterventions": 42
    }

@router.get("/department-risks")
def get_department_risks(db: Session = Depends(get_db)):
    return {
        "departments": [
            {"name": "Engineering", "head": "David Chen", "employees": 95, "assessed": 89, "avgScore": 38.5, "postureRisk": 52, "stressRisk": 46, "activityRisk": 48},
            {"name": "Sales & Marketing", "head": "Sophia Martinez", "employees": 65, "assessed": 58, "avgScore": 32.1, "postureRisk": 35, "stressRisk": 42, "activityRisk": 30},
            {"name": "Operations", "head": "Michael Ross", "employees": 52, "assessed": 48, "avgScore": 36.4, "postureRisk": 44, "stressRisk": 38, "activityRisk": 40},
            {"name": "Finance & Legal", "head": "Rachel Green", "employees": 38, "assessed": 35, "avgScore": 29.8, "postureRisk": 38, "stressRisk": 34, "activityRisk": 32},
            {"name": "Human Resources", "head": "Amanda Taylor", "employees": 30, "assessed": 28, "avgScore": 24.5, "postureRisk": 28, "stressRisk": 26, "activityRisk": 25}
        ]
    }

@router.get("/risk-distribution")
def get_risk_distribution(db: Session = Depends(get_db)):
    return {
        "distribution": [
            {"tier": "Low Risk", "count": 154, "percentage": 62, "color": "#147D75"},
            {"tier": "Moderate Risk", "count": 76, "percentage": 31, "color": "#D9822B"},
            {"tier": "High Risk", "count": 18, "percentage": 7, "color": "#D33F49"}
        ]
    }

@router.get("/hazard-breakdown")
def get_hazard_breakdown(db: Session = Depends(get_db)):
    return {
        "dimensions": [
            {"dimension": "Posture & Ergonomics", "score": 46.2, "status": "Moderate", "trend": "-4%"},
            {"dimension": "Sedentary / Activity", "score": 44.8, "status": "Moderate", "trend": "-2%"},
            {"dimension": "Workload & Pacing", "score": 38.0, "status": "Moderate", "trend": "-5%"},
            {"dimension": "Stress & Autonomic", "score": 35.6, "status": "Moderate", "trend": "-8%"},
            {"dimension": "Circadian & Recovery", "score": 28.4, "status": "Low", "trend": "-6%"}
        ]
    }

@router.get("/programs")
def get_hr_programs(db: Session = Depends(get_db)):
    return {
        "programs": [
            {"id": 1, "title": "Ergonomic Workstation Improvement", "category": "Posture", "enrolled": 84, "completed": 52, "satisfaction": "94%", "targetDept": "Engineering & Operations"},
            {"id": 2, "title": "Workday Movement & Mobility", "category": "Activity", "enrolled": 68, "completed": 38, "satisfaction": "91%", "targetDept": "All Departments"},
            {"id": 3, "title": "Stress Recovery & Resilience", "category": "Stress", "enrolled": 45, "completed": 29, "satisfaction": "88%", "targetDept": "Sales & Engineering"},
            {"id": 4, "title": "Healthy Sleep & Recovery Protocol", "category": "Recovery", "enrolled": 32, "completed": 21, "satisfaction": "96%", "targetDept": "All Departments"}
        ]
    }

@router.get("/reports")
def get_hr_reports(db: Session = Depends(get_db)):
    return {
        "reports": [
            {"id": "REP-2026-Q3", "title": "Q3 2026 Enterprise Occupational Health Screening Audit", "date": "2026-09-20", "type": "Comprehensive Audit", "author": "HR Analytics System", "status": "Approved"},
            {"id": "REP-2026-ERG", "title": "Departmental Musculoskeletal & Ergonomics Hazard Assessment", "date": "2026-09-15", "type": "Ergonomic Review", "author": "Dr. Sarah Jenkins", "status": "Action Required"},
            {"id": "REP-2026-STR", "title": "Workplace Psychosocial Risk & Workload Factor Evaluation", "date": "2026-09-08", "type": "Stress & Wellbeing", "author": "Occupational Health Team", "status": "Reviewed"},
            {"id": "REP-2026-ANL", "title": "Annual Workplace Health Compliance & Policy Alignment", "date": "2026-08-30", "type": "Regulatory Compliance", "author": "Internal Compliance Office", "status": "Archived"}
        ]
    }
