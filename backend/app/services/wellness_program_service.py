import json
import secrets
import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.entities import (
    User, Program, ProgramModule, ProgramQuiz, EmployeeProgram, QuizAttempt, CertificateRecord, AssessmentResult
)
from app.core.wellness_programs_data import WELLNESS_PROGRAMS_DATA

def seed_all_programs(db: Session):
    """
    Synchronizes the 6 official learning programs, modules, and quizzes into the database.
    """
    for prog_data in WELLNESS_PROGRAMS_DATA:
        existing = db.query(Program).filter(
            or_(Program.slug == prog_data["slug"], Program.title == prog_data["title"])
        ).first()

        if not existing:
            new_prog = Program(
                slug=prog_data["slug"],
                title=prog_data["title"],
                category=prog_data["category"],
                tag=prog_data["tag"],
                description=prog_data["description"],
                overview=prog_data["overview"],
                learning_objectives_json=json.dumps(prog_data["learning_objectives"]),
                trainer_name=prog_data["trainer_name"],
                trainer_id=prog_data["trainer_id"],
                trainer_role=prog_data["trainer_role"],
                duration=prog_data["duration"],
                total_modules=len(prog_data["modules"]),
                target_risk_area=prog_data["target_risk_area"],
                passing_threshold=prog_data["passing_threshold"],
                requires_trainer_verification=prog_data["requires_trainer_verification"]
            )
            db.add(new_prog)
            db.commit()
            db.refresh(new_prog)
            existing = new_prog
        else:
            # Update attributes to ensure synchronization
            existing.slug = prog_data["slug"]
            existing.title = prog_data["title"]
            existing.category = prog_data["category"]
            existing.tag = prog_data["tag"]
            existing.description = prog_data["description"]
            existing.overview = prog_data["overview"]
            existing.learning_objectives_json = json.dumps(prog_data["learning_objectives"])
            existing.trainer_name = prog_data["trainer_name"]
            existing.trainer_id = prog_data["trainer_id"]
            existing.trainer_role = prog_data["trainer_role"]
            existing.duration = prog_data["duration"]
            existing.total_modules = len(prog_data["modules"])
            existing.target_risk_area = prog_data["target_risk_area"]
            existing.passing_threshold = prog_data["passing_threshold"]
            existing.requires_trainer_verification = prog_data["requires_trainer_verification"]
            db.commit()

        # Seed or sync modules
        for mod in prog_data["modules"]:
            existing_mod = db.query(ProgramModule).filter(
                ProgramModule.program_id == existing.id,
                ProgramModule.module_order == mod["module_order"]
            ).first()

            if not existing_mod:
                new_mod = ProgramModule(
                    program_id=existing.id,
                    module_order=mod["module_order"],
                    title=mod["title"],
                    estimated_duration=mod["estimated_duration"],
                    summary=mod["summary"],
                    content_markdown=mod["content_markdown"],
                    key_takeaways_json=json.dumps(mod["key_takeaways"]),
                    practical_activity=mod["practical_activity"],
                    activity_instructions=mod["activity_instructions"]
                )
                db.add(new_mod)
            else:
                existing_mod.title = mod["title"]
                existing_mod.estimated_duration = mod["estimated_duration"]
                existing_mod.summary = mod["summary"]
                existing_mod.content_markdown = mod["content_markdown"]
                existing_mod.key_takeaways_json = json.dumps(mod["key_takeaways"])
                existing_mod.practical_activity = mod["practical_activity"]
                existing_mod.activity_instructions = mod["activity_instructions"]

        db.commit()

        # Seed or sync quiz
        quiz_data = prog_data["quiz"]
        existing_quiz = db.query(ProgramQuiz).filter(ProgramQuiz.program_id == existing.id).first()
        if not existing_quiz:
            new_quiz = ProgramQuiz(
                program_id=existing.id,
                title=quiz_data["title"],
                description=quiz_data["description"],
                passing_threshold=quiz_data["passing_threshold"],
                questions_json=json.dumps(quiz_data["questions"])
            )
            db.add(new_quiz)
        else:
            existing_quiz.title = quiz_data["title"]
            existing_quiz.description = quiz_data["description"]
            existing_quiz.passing_threshold = quiz_data["passing_threshold"]
            existing_quiz.questions_json = json.dumps(quiz_data["questions"])
        db.commit()

def calculate_recommended_program_ids(db: Session, user: User) -> List[int]:
    """
    Maps the user's latest 16-item assessment risk profile to recommended wellness programs.
    Ergonomic/Posture risk -> Ergonomic Wellness
    Stress risk -> Stress Management
    Recovery/Sleep risk -> Fatigue and Sleep Management
    Activity/Sedentary risk -> Healthy Lifestyle at Work
    High screen time -> Digital Eye Care
    General organizational safety -> Workplace Safety Essentials
    """
    latest_assessment = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == user.id
    ).order_by(AssessmentResult.id.desc()).first()

    posture = latest_assessment.posture_score if latest_assessment else 50.0
    stress = latest_assessment.stress_score if latest_assessment else 45.0
    recovery = latest_assessment.recovery_score if latest_assessment else 40.0
    activity = latest_assessment.activity_score if latest_assessment else 45.0

    recommended_slugs = []

    # Priority mapping
    if posture >= 30.0:
        recommended_slugs.append("ergonomic-wellness")
    if stress >= 30.0:
        recommended_slugs.append("stress-management")
    if recovery >= 30.0:
        recommended_slugs.append("fatigue-and-sleep-management")
    if activity >= 30.0:
        recommended_slugs.append("healthy-lifestyle-at-work")

    # Digital eye care recommended if posture or overall desk hours elevated
    recommended_slugs.append("digital-eye-care")

    # Always ensure at least 2-3 recommendations
    if "workplace-safety-essentials" not in recommended_slugs and len(recommended_slugs) < 3:
        recommended_slugs.append("workplace-safety-essentials")

    progs = db.query(Program).filter(Program.slug.in_(recommended_slugs)).all()
    return [p.id for p in progs]

def seed_sample_user_enrollments(db: Session, user: User):
    """
    Seeds initial realistic enrollments for a user if they have zero active enrollments.
    Assigns Ergonomic Wellness (with 2 of 4 modules done = 50% progress) as Assigned,
    and sets recommended programs.
    """
    count = db.query(EmployeeProgram).filter(EmployeeProgram.user_id == user.id).count()
    if count == 0:
        ergo_prog = db.query(Program).filter(Program.slug == "ergonomic-wellness").first()
        if ergo_prog:
            modules = db.query(ProgramModule).filter(ProgramModule.program_id == ergo_prog.id).order_by(ProgramModule.module_order).all()
            completed_ids = [m.id for m in modules[:2]] if len(modules) >= 2 else []
            progress_pct = int((len(completed_ids) / len(modules)) * 100) if modules else 50

            enr = EmployeeProgram(
                user_id=user.id,
                program_id=ergo_prog.id,
                enrollment_source="Assigned",
                progress=progress_pct,
                status="In Progress",
                completed_module_ids_json=json.dumps(completed_ids),
                enrolled_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
                quiz_passed=False,
                quiz_attempts_count=0
            )
            db.add(enr)
            db.commit()

class WellnessProgramService:

    @staticmethod
    def list_programs_for_user(
        db: Session,
        user: User,
        category: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fetches all catalog programs for the employee, annotated with their enrollment status,
        progress percentage, and categorized into:
        - recommended_programs
        - assigned_programs
        - in_progress_programs
        - completed_programs
        - all_programs
        """
        # Ensure database is seeded
        if db.query(Program).count() < 6:
            seed_all_programs(db)

        # Seed sample enrollment if user has none
        seed_sample_user_enrollments(db, user)

        # Fetch all programs
        query = db.query(Program)
        if category and category.lower() != "all":
            query = query.filter(
                or_(
                    Program.category.ilike(f"%{category}%"),
                    Program.tag.ilike(f"%{category}%")
                )
            )
        if search and search.strip():
            query = query.filter(
                or_(
                    Program.title.ilike(f"%{search.strip()}%"),
                    Program.description.ilike(f"%{search.strip()}%")
                )
            )

        all_db_programs = query.order_by(Program.id).all()

        # Fetch user's enrollments
        enrollments = db.query(EmployeeProgram).filter(EmployeeProgram.user_id == user.id).all()
        enrollments_by_prog_id = {e.program_id: e for e in enrollments}

        # Calculate recommendations
        recommended_ids = calculate_recommended_program_ids(db, user)

        program_cards = []
        for p in all_db_programs:
            enr = enrollments_by_prog_id.get(p.id)
            is_enrolled = enr is not None
            prog_status = enr.status if enr else "Not Enrolled"
            progress_pct = enr.progress if enr else 0
            assignment_source = enr.enrollment_source if enr else ("Recommended" if p.id in recommended_ids else "Available")

            completed_mod_count = 0
            if enr and enr.completed_module_ids_json:
                try:
                    completed_mod_count = len(json.loads(enr.completed_module_ids_json))
                except Exception:
                    completed_mod_count = 0

            program_cards.append({
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "category": p.category,
                "tag": p.tag or p.category,
                "description": p.description,
                "duration": p.duration,
                "totalModules": p.total_modules or 4,
                "completedModules": completed_mod_count,
                "trainerName": p.trainer_name,
                "trainerRole": p.trainer_role,
                "targetRiskArea": p.target_risk_area,
                "isEnrolled": is_enrolled,
                "status": prog_status,
                "progress": progress_pct,
                "assignmentSource": assignment_source,
                "isRecommended": p.id in recommended_ids,
                "quizPassed": enr.quiz_passed if enr else False,
                "certificateId": enr.certificate_id if enr else None
            })

        # Apply status filter if present
        filtered_cards = program_cards
        if status and status.lower() != "all":
            if status == "recommended":
                filtered_cards = [c for c in program_cards if c["isRecommended"]]
            elif status == "assigned":
                filtered_cards = [c for c in program_cards if c["assignmentSource"] == "Assigned"]
            elif status == "in_progress" or status == "active":
                filtered_cards = [c for c in program_cards if c["isEnrolled"] and c["status"] in ["In Progress", "Needs Correction"]]
            elif status == "awaiting_verification":
                filtered_cards = [c for c in program_cards if c["status"] == "Awaiting Verification"]
            elif status == "completed":
                filtered_cards = [c for c in program_cards if c["status"] == "Completed"]

        # Segregated lists for the dashboard sections
        assigned = [c for c in program_cards if c["assignmentSource"] == "Assigned"]
        recommended = [c for c in program_cards if c["isRecommended"] and c["status"] != "Completed"]
        in_progress = [c for c in program_cards if c["isEnrolled"] and c["status"] in ["In Progress", "Needs Correction", "Awaiting Verification"]]
        completed = [c for c in program_cards if c["status"] == "Completed"]

        return {
            "allPrograms": filtered_cards,
            "assignedPrograms": assigned,
            "recommendedPrograms": recommended,
            "inProgressPrograms": in_progress,
            "completedPrograms": completed,
            "counts": {
                "total": len(program_cards),
                "enrolled": len([c for c in program_cards if c["isEnrolled"]]),
                "inProgress": len(in_progress),
                "completed": len(completed),
                "recommended": len(recommended)
            }
        }

    @staticmethod
    def get_program_details(db: Session, program_id_or_slug: str, user: User) -> Dict[str, Any]:
        """
        Retrieves complete program details, modules, learning materials, quiz questions (without answers),
        and user's personal progress.
        """
        # Find program
        if str(program_id_or_slug).isdigit():
            prog = db.query(Program).filter(Program.id == int(program_id_or_slug)).first()
        else:
            prog = db.query(Program).filter(
                or_(Program.slug == program_id_or_slug, Program.title.ilike(f"%{program_id_or_slug}%"))
            ).first()

        if not prog:
            # Fallback to first program
            prog = db.query(Program).first()

        if not prog:
            seed_all_programs(db)
            prog = db.query(Program).first()

        # Modules
        modules = db.query(ProgramModule).filter(
            ProgramModule.program_id == prog.id
        ).order_by(ProgramModule.module_order).all()

        # Quiz
        quiz = db.query(ProgramQuiz).filter(ProgramQuiz.program_id == prog.id).first()
        quiz_questions = []
        if quiz and quiz.questions_json:
            raw_questions = json.loads(quiz.questions_json)
            # Remove correct_index from client payload so answers are not revealed before submission
            for q in raw_questions:
                quiz_questions.append({
                    "question": q["question"],
                    "options": q["options"]
                })

        # User enrollment record
        enr = db.query(EmployeeProgram).filter(
            EmployeeProgram.user_id == user.id,
            EmployeeProgram.program_id == prog.id
        ).first()

        completed_mod_ids = []
        if enr and enr.completed_module_ids_json:
            try:
                completed_mod_ids = json.loads(enr.completed_module_ids_json)
            except Exception:
                completed_mod_ids = []

        modules_data = []
        for m in modules:
            modules_data.append({
                "id": m.id,
                "order": m.module_order,
                "title": m.title,
                "duration": m.estimated_duration,
                "estimatedDuration": m.estimated_duration,
                "summary": m.summary,
                "content": m.content_markdown,
                "contentMarkdown": m.content_markdown,
                "keyTakeaways": json.loads(m.key_takeaways_json) if m.key_takeaways_json else [],
                "practicalActivity": m.practical_activity,
                "activityInstructions": m.activity_instructions,
                "isCompleted": m.id in completed_mod_ids
            })

        objectives = []
        if prog.learning_objectives_json:
            try:
                objectives = json.loads(prog.learning_objectives_json)
            except Exception:
                objectives = []

        certificate_data = None
        if enr and enr.certificate_id:
            cert = db.query(CertificateRecord).filter(
                CertificateRecord.certificate_id == enr.certificate_id
            ).first()
            if cert:
                certificate_data = {
                    "certificateId": cert.certificate_id,
                    "issuedAt": cert.issue_date_str,
                    "trainerName": cert.trainer_name,
                    "qrUrl": cert.qr_verification_url,
                    "status": cert.status
                }

        user_progress_dict = {
            "isEnrolled": enr is not None,
            "status": enr.status if enr else "Not Enrolled",
            "progress": enr.progress if enr else 0,
            "completedModuleIds": completed_mod_ids,
            "assignmentSource": enr.enrollment_source if enr else "Available",
            "enrolledAt": enr.enrolled_at.strftime("%b %d, %Y") if enr and enr.enrolled_at else None,
            "practicalNotes": enr.practical_notes if enr else "",
            "quizPassed": enr.quiz_passed if enr else False,
            "quizScore": enr.quiz_score if enr else None,
            "quizAttemptsCount": enr.quiz_attempts_count if enr else 0,
            "certificateId": enr.certificate_id if enr else None,
            "submittedForVerificationAt": enr.submitted_for_verification_at.strftime("%b %d, %Y") if enr and enr.submitted_for_verification_at else None,
            "verifiedAt": enr.verified_at.strftime("%b %d, %Y") if enr and enr.verified_at else None,
            "trainerFeedback": enr.trainer_feedback if enr else None
        }

        return {
            "id": prog.id,
            "slug": prog.slug,
            "title": prog.title,
            "category": prog.category,
            "tag": prog.tag or prog.category,
            "description": prog.description,
            "overview": prog.overview,
            "learningObjectives": objectives,
            "duration": prog.duration,
            "totalModules": len(modules_data),
            "trainerName": prog.trainer_name,
            "trainerRole": prog.trainer_role,
            "targetRiskArea": prog.target_risk_area,
            "passingThreshold": prog.passing_threshold,
            "requiresTrainerVerification": prog.requires_trainer_verification,
            "isEnrolled": enr is not None,
            "status": enr.status if enr else "Not Enrolled",
            "progress": enr.progress if enr else 0,
            "enrolledAt": enr.enrolled_at.strftime("%b %d, %Y") if enr and enr.enrolled_at else None,
            "practicalNotes": enr.practical_notes if enr else "",
            "quizPassed": enr.quiz_passed if enr else False,
            "quizScore": enr.quiz_score if enr else None,
            "quizAttemptsCount": enr.quiz_attempts_count if enr else 0,
            "submittedForVerificationAt": enr.submitted_for_verification_at.strftime("%b %d, %Y") if enr and enr.submitted_for_verification_at else None,
            "verifiedAt": enr.verified_at.strftime("%b %d, %Y") if enr and enr.verified_at else None,
            "trainerFeedback": enr.trainer_feedback if enr else None,
            "modules": modules_data,
            "userProgress": user_progress_dict,
            "quiz": {
                "title": quiz.title if quiz else "Knowledge Assessment",
                "description": quiz.description if quiz else "Demonstrate your understanding.",
                "passingThreshold": quiz.passing_threshold if quiz else 75,
                "questions": quiz_questions,
                "totalQuestions": len(quiz_questions)
            },
            "certificate": certificate_data
        }

    @staticmethod
    def enroll_program(db: Session, user: User, program_id: int) -> Dict[str, Any]:
        """
        Enrolls employee into a program. Prevents duplicate enrollments.
        """
        existing = db.query(EmployeeProgram).filter(
            EmployeeProgram.user_id == user.id,
            EmployeeProgram.program_id == program_id
        ).first()

        if existing:
            return {
                "success": True,
                "message": "Already enrolled in this program.",
                "enrollment_id": existing.id,
                "status": existing.status,
                "progress": existing.progress
            }

        prog = db.query(Program).filter(Program.id == program_id).first()
        if not prog:
            raise ValueError("Program not found.")

        enr = EmployeeProgram(
            user_id=user.id,
            program_id=prog.id,
            enrollment_source="Self-Enrolled",
            progress=0,
            status="In Progress",
            completed_module_ids_json="[]",
            enrolled_at=datetime.datetime.utcnow(),
            quiz_passed=False,
            quiz_attempts_count=0
        )
        db.add(enr)
        db.commit()
        db.refresh(enr)

        return {
            "success": True,
            "message": f"Successfully enrolled in {prog.title}!",
            "enrollment_id": enr.id,
            "status": enr.status,
            "progress": enr.progress
        }

    @staticmethod
    def complete_module(db: Session, user: User, program_id: int, module_id: int, practical_notes: Optional[str] = None) -> Dict[str, Any]:
        """
        Marks a specific module complete, recalculates progress percentage,
        and saves optional practical reflection notes.
        """
        enr = db.query(EmployeeProgram).filter(
            EmployeeProgram.user_id == user.id,
            EmployeeProgram.program_id == program_id
        ).first()

        if not enr:
            # Auto-enroll
            enr = EmployeeProgram(
                user_id=user.id,
                program_id=program_id,
                enrollment_source="Self-Enrolled",
                progress=0,
                status="In Progress",
                completed_module_ids_json="[]",
                enrolled_at=datetime.datetime.utcnow()
            )
            db.add(enr)
            db.commit()
            db.refresh(enr)

        completed_ids = []
        if enr.completed_module_ids_json:
            try:
                completed_ids = json.loads(enr.completed_module_ids_json)
            except Exception:
                completed_ids = []

        if module_id not in completed_ids:
            completed_ids.append(module_id)
            enr.completed_module_ids_json = json.dumps(completed_ids)

        if practical_notes and practical_notes.strip():
            enr.practical_notes = practical_notes.strip()

        # Calculate progress
        prog = db.query(Program).filter(Program.id == program_id).first()
        total_mods = prog.total_modules if prog and prog.total_modules > 0 else 4
        # Modules account for 80% of progress, quiz accounts for 20%
        mods_progress = (len(completed_ids) / total_mods) * 80.0
        quiz_progress = 20.0 if enr.quiz_passed else 0.0
        enr.progress = min(100, int(round(mods_progress + quiz_progress)))

        db.commit()
        db.refresh(enr)

        return {
            "success": True,
            "message": f"Module {module_id} completed successfully!",
            "completed_modules_count": len(completed_ids),
            "total_modules": total_mods,
            "progress": enr.progress,
            "status": enr.status
        }

    @staticmethod
    def submit_quiz(db: Session, user: User, program_id: int, submitted_answers: List[int]) -> Dict[str, Any]:
        """
        Validates submitted quiz answers on the backend against ProgramQuiz questions.
        Calculates score percentage. If passed, updates progress and checks verification eligibility.
        """
        quiz = db.query(ProgramQuiz).filter(ProgramQuiz.program_id == program_id).first()
        if not quiz or not quiz.questions_json:
            raise ValueError("Quiz not found for this program.")

        questions = json.loads(quiz.questions_json)
        total_questions = len(questions)
        correct_count = 0
        detailed_results = []

        for idx, q in enumerate(questions):
            submitted_idx = submitted_answers[idx] if idx < len(submitted_answers) else None
            is_correct = (submitted_idx == q["correct_index"])
            if is_correct:
                correct_count += 1

            detailed_results.append({
                "questionIndex": idx,
                "question": q["question"],
                "submittedIndex": submitted_idx,
                "correctIndex": q["correct_index"],
                "isCorrect": is_correct,
                "explanation": q["explanation"]
            })

        score_pct = round((correct_count / total_questions) * 100.0, 1)
        passed = score_pct >= quiz.passing_threshold

        enr = db.query(EmployeeProgram).filter(
            EmployeeProgram.user_id == user.id,
            EmployeeProgram.program_id == program_id
        ).first()

        if not enr:
            enr = EmployeeProgram(
                user_id=user.id,
                program_id=program_id,
                enrollment_source="Self-Enrolled",
                progress=0,
                status="In Progress",
                enrolled_at=datetime.datetime.utcnow()
            )
            db.add(enr)
            db.commit()
            db.refresh(enr)

        enr.quiz_attempts_count = (enr.quiz_attempts_count or 0) + 1
        if passed or (enr.quiz_score is None or score_pct > enr.quiz_score):
            enr.quiz_score = score_pct

        if passed:
            enr.quiz_passed = True

        # Record attempt
        attempt = QuizAttempt(
            user_id=user.id,
            program_id=program_id,
            enrollment_id=enr.id,
            score_pct=score_pct,
            passed=passed,
            total_questions=total_questions,
            correct_answers=correct_count,
            submitted_answers_json=json.dumps(submitted_answers),
            attempted_at=datetime.datetime.utcnow()
        )
        db.add(attempt)

        # Recalculate progress
        prog = db.query(Program).filter(Program.id == program_id).first()
        total_mods = prog.total_modules if prog and prog.total_modules > 0 else 4
        completed_ids = []
        if enr.completed_module_ids_json:
            try:
                completed_ids = json.loads(enr.completed_module_ids_json)
            except Exception:
                completed_ids = []

        mods_progress = (len(completed_ids) / total_mods) * 80.0
        quiz_progress = 20.0 if enr.quiz_passed else 0.0
        enr.progress = min(100, int(round(mods_progress + quiz_progress)))

        db.commit()
        db.refresh(enr)

        return {
            "success": True,
            "passed": passed,
            "score": score_pct,
            "passingThreshold": quiz.passing_threshold,
            "correctCount": correct_count,
            "totalQuestions": total_questions,
            "attemptsCount": enr.quiz_attempts_count,
            "progress": enr.progress,
            "status": enr.status,
            "detailedResults": detailed_results
        }

    @staticmethod
    def submit_for_trainer_verification(db: Session, user: User, program_id: int, reflection_notes: str) -> Dict[str, Any]:
        """
        Moves the program enrollment to 'Awaiting Verification' queue.
        Validates that all modules are complete and quiz is passed before submission.
        """
        enr = db.query(EmployeeProgram).filter(
            EmployeeProgram.user_id == user.id,
            EmployeeProgram.program_id == program_id
        ).first()

        if not enr:
            raise ValueError("Program enrollment not found.")

        prog = db.query(Program).filter(Program.id == program_id).first()
        total_mods = prog.total_modules if prog and prog.total_modules > 0 else 4

        completed_ids = []
        if enr.completed_module_ids_json:
            try:
                completed_ids = json.loads(enr.completed_module_ids_json)
            except Exception:
                completed_ids = []

        if len(completed_ids) < total_mods:
            raise ValueError(f"Please complete all {total_mods} learning modules before submitting for trainer verification.")

        if not enr.quiz_passed:
            raise ValueError("Please pass the program knowledge quiz before submitting for verification.")

        enr.status = "Awaiting Verification"
        enr.practical_notes = reflection_notes.strip() if reflection_notes else enr.practical_notes
        enr.submitted_for_verification_at = datetime.datetime.utcnow()
        enr.progress = 100

        db.commit()
        db.refresh(enr)

        return {
            "success": True,
            "message": f"Successfully submitted {prog.title} for clinical trainer review! Your specialist will evaluate your submission.",
            "status": enr.status,
            "submittedAt": enr.submitted_for_verification_at.strftime("%b %d, %Y")
        }

    @staticmethod
    def trainer_get_reviews_queue(db: Session, trainer_user: User) -> List[Dict[str, Any]]:
        """
        Fetches all submissions awaiting trainer review.
        """
        # Seed programs if needed
        if db.query(Program).count() < 6:
            seed_all_programs(db)

        enrollments = db.query(EmployeeProgram).filter(
            EmployeeProgram.status.in_(["Awaiting Verification", "Completed", "Needs Correction"])
        ).order_by(EmployeeProgram.submitted_for_verification_at.desc()).all()

        results = []
        for e in enrollments:
            prog = e.program
            emp = e.user
            results.append({
                "enrollmentId": e.id,
                "programId": e.program_id,
                "programTitle": prog.title if prog else "Wellbeing Program",
                "programCategory": prog.category if prog else "General",
                "employeeId": emp.id if emp else None,
                "employeeName": emp.name if emp else "Employee",
                "employeeEmail": emp.email if emp else "employee@company.com",
                "employeeCode": emp.employee_id or "EMP-1001",
                "department": emp.department or "Engineering",
                "status": e.status,
                "progress": e.progress,
                "quizScore": e.quiz_score,
                "submittedAt": e.submitted_for_verification_at.strftime("%b %d, %Y") if e.submitted_for_verification_at else "Recently",
                "practicalNotes": e.practical_notes or "Completed all required modules and workstation drills consistently.",
                "trainerFeedback": e.trainer_feedback,
                "verifiedAt": e.verified_at.strftime("%b %d, %Y") if e.verified_at else None,
                "certificateId": e.certificate_id
            })

        return results

    @staticmethod
    def trainer_verify(db: Session, enrollment_id: int, trainer_user: User, action: str, feedback: str, observations: str = "") -> Dict[str, Any]:
        """
        Action: 'approve' or 'reject' (request correction).
        If approved:
          - Marks status as 'Completed'
          - Generates unique verified CertificateRecord (IOH-2026-XXXXXX)
          - Attaches certificate_id to EmployeeProgram
        """
        enr = db.query(EmployeeProgram).filter(EmployeeProgram.id == enrollment_id).first()
        if not enr:
            raise ValueError("Enrollment record not found.")

        prog = enr.program
        emp = enr.user
        trainer_name = trainer_user.name if trainer_user else (prog.trainer_name or "Dr. Sarah Jenkins")
        trainer_id = trainer_user.trainer_id if trainer_user and trainer_user.trainer_id else (prog.trainer_id or "TR-3001")

        if action == "approve":
            enr.status = "Completed"
            enr.verified_at = datetime.datetime.utcnow()
            enr.verified_by_trainer_id = trainer_id
            enr.verified_by_trainer_name = trainer_name
            combined_feedback = feedback.strip() if feedback else "Exemplary workstation engagement and routine adherence verified."
            if observations.strip():
                combined_feedback += f" [Specialist Observation: {observations.strip()}]"
            enr.trainer_feedback = combined_feedback
            enr.completed_at = datetime.datetime.utcnow()

            # Generate Unique Certificate
            cert_id = f"IOH-2026-{secrets.token_hex(3).upper()}"
            issue_date = datetime.datetime.utcnow().strftime("%B %d, %Y")
            qr_url = f"http://localhost:5173/verify/{cert_id}"

            # Check if certificate already exists for this user and program
            existing_cert = db.query(CertificateRecord).filter(
                CertificateRecord.user_id == emp.id,
                CertificateRecord.program_id == prog.id
            ).first()

            if not existing_cert:
                cert = CertificateRecord(
                    certificate_id=cert_id,
                    user_id=emp.id,
                    program_id=prog.id,
                    employee_name=emp.name,
                    employee_email=emp.email,
                    employee_id_number=emp.employee_id or "EMP-1001",
                    program_title=prog.title,
                    program_category=prog.category,
                    trainer_name=trainer_name,
                    trainer_id=trainer_id,
                    issued_at=datetime.datetime.utcnow(),
                    issue_date_str=issue_date,
                    status="Valid",
                    qr_verification_url=qr_url
                )
                db.add(cert)
                enr.certificate_id = cert_id
            else:
                existing_cert.status = "Valid"
                existing_cert.trainer_name = trainer_name
                existing_cert.issue_date_str = issue_date
                enr.certificate_id = existing_cert.certificate_id

            db.commit()
            db.refresh(enr)

            return {
                "success": True,
                "message": f"Successfully approved {emp.name}'s completion of {prog.title}! Certificate issued.",
                "status": enr.status,
                "certificateId": enr.certificate_id,
                "issuedAt": issue_date
            }

        elif action == "reject":
            enr.status = "Needs Correction"
            enr.trainer_feedback = feedback.strip() if feedback else "Please review module guidelines and resubmit with updated reflection notes."
            db.commit()
            db.refresh(enr)

            return {
                "success": True,
                "message": f"Returned submission to {emp.name} with actionable guidance.",
                "status": enr.status,
                "feedback": enr.trainer_feedback
            }
        else:
            raise ValueError("Invalid verification action. Use 'approve' or 'reject'.")

    @staticmethod
    def get_public_certificate(db: Session, certificate_id: str) -> Optional[Dict[str, Any]]:
        """
        Public verification endpoint for QR code scans. Checks validity against backend database.
        """
        cert = db.query(CertificateRecord).filter(
            CertificateRecord.certificate_id == certificate_id.strip().upper()
        ).first()

        if not cert:
            return None

        return {
            "certificateId": cert.certificate_id,
            "employeeName": cert.employee_name,
            "employeeId": cert.employee_id_number,
            "programTitle": cert.program_title,
            "programCategory": cert.program_category,
            "trainerName": cert.trainer_name,
            "trainerId": cert.trainer_id,
            "issuedAt": cert.issue_date_str,
            "status": cert.status,
            "isAuthentic": cert.status == "Valid",
            "issuer": "WorkHealth AI — Occupational Safety Directorate (ISO 45001 Compliance)"
        }
