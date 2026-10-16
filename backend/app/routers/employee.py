import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import User, AssessmentResult, Program, EmployeeProgram
from app.schemas.schemas import AssessmentInput

router = APIRouter(prefix="/employee", tags=["Employee"])

@router.post("/assessment")
def submit_assessment(payload: AssessmentInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.user_email).first()
    if not user:
        user = User(name=payload.user_email.split("@")[0].title(), email=payload.user_email, role="employee")
        db.add(user)
        db.commit()
        db.refresh(user)

    scores = payload.category_scores
    result = AssessmentResult(
        user_id=user.id,
        overall_score=payload.overall_score,
        posture_score=scores.get("Posture", 0.0),
        activity_score=scores.get("Activity", 0.0),
        stress_score=scores.get("Stress", 0.0),
        recovery_score=scores.get("Recovery", 0.0),
        workload_score=scores.get("Workload", round(((scores.get("Stress", 0) + scores.get("Recovery", 0)) / 2), 1)),
        answers_json=json.dumps(payload.answers),
        completed_at=datetime.utcnow()
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return {
        "success": True,
        "message": "Assessment saved successfully",
        "assessment_id": result.id,
        "overall_score": result.overall_score,
        "category_scores": {
            "Posture": result.posture_score,
            "Activity": result.activity_score,
            "Stress": result.stress_score,
            "Recovery": result.recovery_score,
            "Workload": result.workload_score
        }
    }

@router.get("/assessment/latest")
def get_latest_assessment(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    latest = db.query(AssessmentResult).filter(AssessmentResult.user_id == user.id).order_by(AssessmentResult.id.desc()).first()
    if not latest:
        # Return sensible default benchmark so user never sees a blank screen
        return {
            "has_assessment": False,
            "overall_score": 42.0,
            "category_scores": {
                "Posture": 50.0,
                "Activity": 45.0,
                "Stress": 38.0,
                "Recovery": 35.0,
                "Workload": 40.0
            },
            "completed_at": None
        }

    return {
        "has_assessment": True,
        "id": latest.id,
        "overall_score": latest.overall_score,
        "category_scores": {
            "Posture": latest.posture_score,
            "Activity": latest.activity_score,
            "Stress": latest.stress_score,
            "Recovery": latest.recovery_score,
            "Workload": latest.workload_score
        },
        "completed_at": latest.completed_at.strftime("%Y-%m-%d %H:%M")
    }

@router.get("/recommendations")
def get_recommendations(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    latest = None
    if user:
        latest = db.query(AssessmentResult).filter(AssessmentResult.user_id == user.id).order_by(AssessmentResult.id.desc()).first()

    posture = latest.posture_score if latest else 48.0
    activity = latest.activity_score if latest else 52.0
    stress = latest.stress_score if latest else 45.0
    recovery = latest.recovery_score if latest else 40.0

    recs = []

    # Dynamic rules based on category risk
    if posture >= 30:
        recs.append({
            "id": "rec-posture-1",
            "riskArea": "Posture",
            "title": "Ergonomic Workstation Review & Monitor Alignment",
            "whyItMatters": "Prolonged static posture and suboptimal screen elevation increase cervical spine fatigue and upper trapezius strain.",
            "recommendedAction": "Adjust primary monitor eye level so the top third is aligned with your horizontal gaze; reposition keyboard 10cm from desk edge.",
            "priority": "High" if posture >= 60 else "Moderate",
            "estimatedEffort": "15 mins setup",
            "programId": 1,
            "programName": "Ergonomic Workstation Improvement"
        })
        recs.append({
            "id": "rec-posture-2",
            "riskArea": "Posture",
            "title": "Active Micro-Adjustment & Lumbar Support",
            "whyItMatters": "Remaining rigid in one sitting position collapses spinal discs; dynamic shifting reduces localized load.",
            "recommendedAction": "Configure lumbar cushion to fill the small of your lower back and alter hip tilt angle twice per work block.",
            "priority": "Moderate",
            "estimatedEffort": "5 mins/day",
            "programId": 1,
            "programName": "Ergonomic Workstation Improvement"
        })

    if stress >= 30:
        recs.append({
            "id": "rec-stress-1",
            "riskArea": "Stress",
            "title": "Workday Cognitive Reset & Focus Blocks",
            "whyItMatters": "High mental demand and continual context switching trigger sustained sympathetic nervous activation.",
            "recommendedAction": "Institute 50-minute focused task intervals separated by 5-minute zero-input breath resets (box breathing 4-4-4).",
            "priority": "High" if stress >= 60 else "Moderate",
            "estimatedEffort": "10 mins/day",
            "programId": 3,
            "programName": "Stress Recovery & Resilience"
        })
        recs.append({
            "id": "rec-stress-2",
            "riskArea": "Stress",
            "title": "End-of-Day Mental Transition Protocol",
            "whyItMatters": "Lack of separation between work and evening rest impairs autonomic down-regulation.",
            "recommendedAction": "Execute a 10-minute workday shutdown checklist: log open loops, close work browser tabs, and transition physically.",
            "priority": "Moderate",
            "estimatedEffort": "10 mins/day",
            "programId": 3,
            "programName": "Stress Recovery & Resilience"
        })

    if activity >= 30:
        recs.append({
            "id": "rec-activity-1",
            "riskArea": "Activity",
            "title": "Workday Movement & 5,000-Step Protocol",
            "whyItMatters": "Extended sedentary durations impair peripheral blood circulation and cellular metabolic efficiency.",
            "recommendedAction": "Integrate standing phone calls, walking meetings, and a 15-minute lunchtime brisk walk to achieve workday step goals.",
            "priority": "High" if activity >= 60 else "Moderate",
            "estimatedEffort": "20 mins/day",
            "programId": 2,
            "programName": "Workday Movement & Mobility"
        })
        recs.append({
            "id": "rec-activity-2",
            "riskArea": "Activity",
            "title": "Desk Mobility & Thoracic Extension Routine",
            "whyItMatters": "Kyphotic desk slumping constricts chest expansion and limits breathing volume.",
            "recommendedAction": "Perform 3 cycles of seated thoracic openers and wrist flexor mobilizations every 90 minutes.",
            "priority": "Low",
            "estimatedEffort": "3 mins/session",
            "programId": 2,
            "programName": "Workday Movement & Mobility"
        })

    if recovery >= 30 or len(recs) < 4:
        recs.append({
            "id": "rec-recovery-1",
            "riskArea": "Recovery",
            "title": "Circadian Recovery & Sleep Hygiene Protocol",
            "whyItMatters": "Restorative non-REM sleep is the primary biological driver of tissue repair and cognitive consolidation.",
            "recommendedAction": "Establish a consistent 7+ hour sleep schedule; discontinue blue-lit screens 45 minutes prior to sleep onset.",
            "priority": "High" if recovery >= 60 else "Moderate",
            "estimatedEffort": "Nightly habit",
            "programId": 4,
            "programName": "Healthy Sleep & Recovery"
        })

    return {
        "overall_risk_score": latest.overall_score if latest else 42.0,
        "recommendations": recs
    }

@router.get("/programs")
def get_employee_programs(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    default_programs = [
        {
            "id": 1,
            "name": "Ergonomic Workstation Improvement",
            "category": "Posture",
            "description": "Evidence-based workstation layout optimization, monitor positioning, and dynamic seating adjustments to relieve musculoskeletal strain.",
            "trainer": "Dr. Sarah Jenkins, Occupational Ergonomist",
            "progress": 65,
            "status": "In Progress",
            "duration": "4 Weeks",
            "modules": 6,
            "completedModules": 4
        },
        {
            "id": 2,
            "name": "Workday Movement & Mobility Program",
            "category": "Activity",
            "description": "Structured micro-breaks, desk-friendly mobility routines, and step volume targets designed to counteract sedentary desk hours.",
            "trainer": "Marcus Vance, Physical Therapist",
            "progress": 30,
            "status": "In Progress",
            "duration": "3 Weeks",
            "modules": 5,
            "completedModules": 2
        },
        {
            "id": 3,
            "name": "Stress Recovery & Resilience Program",
            "category": "Stress",
            "description": "Cognitive reset techniques, autonomic nervous system down-regulation, and boundary management to mitigate workplace burnout.",
            "trainer": "Elena Rostova, Wellbeing Coach",
            "progress": 15,
            "status": "In Progress",
            "duration": "4 Weeks",
            "modules": 6,
            "completedModules": 1
        },
        {
            "id": 4,
            "name": "Healthy Sleep & Recovery Protocol",
            "category": "Recovery",
            "description": "Circadian alignment strategies, sleep hygiene checklists, and recovery tracking for sustainable energy throughout the workday.",
            "trainer": "Dr. Sarah Jenkins, Occupational Ergonomist",
            "progress": 0,
            "status": "Not Started",
            "duration": "2 Weeks",
            "modules": 4,
            "completedModules": 0
        },
        {
            "id": 5,
            "name": "Workplace Wellness & Vitality",
            "category": "General",
            "description": "Comprehensive organizational wellbeing program focusing on hydration, visual ergonomics, and sustained cognitive stamina.",
            "trainer": "Marcus Vance, Physical Therapist",
            "progress": 85,
            "status": "In Progress",
            "duration": "6 Weeks",
            "modules": 8,
            "completedModules": 7
        }
    ]

    return {"programs": default_programs}

@router.get("/progress")
def get_employee_progress(email: str = Query(...), db: Session = Depends(get_db)):
    return {
        "assessmentHistory": [
            {"date": "2026-09-01", "overallScore": 58, "posture": 65, "stress": 55, "activity": 60, "recovery": 52},
            {"date": "2026-09-10", "overallScore": 50, "posture": 56, "stress": 48, "activity": 52, "recovery": 44},
            {"date": "2026-09-18", "overallScore": 44, "posture": 48, "stress": 42, "activity": 45, "recovery": 41},
            {"date": "2026-09-26", "overallScore": 38, "posture": 40, "stress": 36, "activity": 39, "recovery": 37}
        ],
        "weeklyStats": [
            {"day": "Mon", "movementMins": 35, "ergonomicBreaks": 4, "stressLevel": 3},
            {"day": "Tue", "movementMins": 42, "ergonomicBreaks": 5, "stressLevel": 2},
            {"day": "Wed", "movementMins": 28, "ergonomicBreaks": 3, "stressLevel": 4},
            {"day": "Thu", "movementMins": 50, "ergonomicBreaks": 6, "stressLevel": 2},
            {"day": "Fri", "movementMins": 45, "ergonomicBreaks": 5, "stressLevel": 2}
        ],
        "completedActionsCount": 24,
        "activeStreakDays": 12,
        "riskReductionPercent": -20.0
    }
