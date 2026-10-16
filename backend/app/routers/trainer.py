from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import SessionCreate

router = APIRouter(prefix="/trainer", tags=["Trainer Coaching"])

@router.get("/dashboard")
def get_trainer_dashboard(db: Session = Depends(get_db)):
    return {
        "assignedEmployeesCount": 38,
        "activeProgramsCount": 4,
        "upcomingSessionsCount": 6,
        "completedSessionsThisMonth": 24,
        "averageImprovementScore": "+18.4%"
    }

@router.get("/assigned-employees")
def get_assigned_employees(db: Session = Depends(get_db)):
    return {
        "employees": [
            {
                "id": "EMP-1042",
                "name": "Bhavana Thota",
                "email": "employee@company.com",
                "department": "Engineering",
                "primaryRisk": "Posture",
                "overallRiskScore": 38,
                "riskLevel": "Moderate",
                "enrolledProgram": "Ergonomic Workstation Improvement",
                "programProgress": 65,
                "lastSession": "2026-09-18",
                "nextSession": "2026-09-28"
            },
            {
                "id": "EMP-2104",
                "name": "Alex Mercer",
                "email": "alex.mercer@company.com",
                "department": "Engineering",
                "primaryRisk": "Stress",
                "overallRiskScore": 54,
                "riskLevel": "Moderate",
                "enrolledProgram": "Stress Recovery & Resilience",
                "programProgress": 30,
                "lastSession": "2026-09-14",
                "nextSession": "2026-09-29"
            },
            {
                "id": "EMP-3891",
                "name": "Priya Sharma",
                "email": "priya.sharma@company.com",
                "department": "Operations",
                "primaryRisk": "Activity",
                "overallRiskScore": 62,
                "riskLevel": "High",
                "enrolledProgram": "Workday Movement & Mobility",
                "programProgress": 45,
                "lastSession": "2026-09-21",
                "nextSession": "2026-09-30"
            },
            {
                "id": "EMP-4109",
                "name": "Liam Connor",
                "email": "liam.connor@company.com",
                "department": "Sales & Marketing",
                "primaryRisk": "Recovery",
                "overallRiskScore": 28,
                "riskLevel": "Low",
                "enrolledProgram": "Healthy Sleep & Recovery",
                "programProgress": 80,
                "lastSession": "2026-09-12",
                "nextSession": "2026-10-02"
            }
        ]
    }

@router.get("/sessions")
def get_coaching_sessions(db: Session = Depends(get_db)):
    return {
        "sessions": [
            {
                "id": "SES-101",
                "employeeName": "Bhavana Thota",
                "topic": "Workstation Ergonomics & Monitor Calibration",
                "date": "2026-09-28",
                "time": "10:30 AM",
                "status": "Confirmed",
                "type": "1-on-1 Virtual Check-in",
                "notes": "Verify dual monitor elevation and lumbar cushion position."
            },
            {
                "id": "SES-102",
                "employeeName": "Alex Mercer",
                "topic": "Cognitive Reset & Micro-break Cadence",
                "date": "2026-09-29",
                "time": "02:00 PM",
                "status": "Confirmed",
                "type": "1-on-1 Resilience Coaching",
                "notes": "Review 50/10 time blocks and evening wind-down log."
            },
            {
                "id": "SES-103",
                "employeeName": "Priya Sharma",
                "topic": "Dynamic Standing Desk Adaptation",
                "date": "2026-09-30",
                "time": "11:00 AM",
                "status": "Pending Confirmation",
                "type": "Mobility Check-in",
                "notes": "Address foot fatigue during sit-stand transitions."
            },
            {
                "id": "SES-104",
                "employeeName": "Liam Connor",
                "topic": "Circadian Rhythm & Evening Routine Review",
                "date": "2026-10-02",
                "time": "04:30 PM",
                "status": "Scheduled",
                "type": "Follow-up Review",
                "notes": "Review blue-light blocker trial results."
            }
        ]
    }

@router.post("/sessions")
def create_session(payload: SessionCreate, db: Session = Depends(get_db)):
    return {
        "success": True,
        "message": f"Coaching session with {payload.employee_name} scheduled successfully.",
        "session": payload.dict()
    }
