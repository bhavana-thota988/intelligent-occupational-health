# FINAL CSP PRESENTATION — SLIDE DECK OUTLINE
## Intelligent Occupational Health and Workplace Risk Management Platform
*Community Service Project (CSP) Presentation*

---

### Slide 1: Title Slide
* **Title**: Intelligent Occupational Health and Workplace Risk Management Platform
* **Subtitle**: Workplace Health, Risk Assessment & Employee Wellbeing Management
* **Project Type**: Community Service Project (CSP)
* **Student Name**: Bhavana Thota (and Batch Members)
* **Branch & Year**: B.Tech Final Year
* **Faculty Guide**: [Guide Name & Designation]
* **College / Department**: [Department Name]

---

### Slide 2: Community Problem & Motivation
* **The Silent Problem in Community Workplaces**:
  * Sedentary computer desk workers spend 8–10 hours seated per day.
  * Over 75% experience chronic neck strain, lumbar disc pain, and physical fatigue.
  * Work-Related Musculoskeletal Disorders (WMSDs) are rising rapidly.
* **The Gap**:
  * Workers lack access to certified ergonomists and personalized daily guidance.
  * Existing online tools are static quizzes with no verification or follow-up.

---

### Slide 3: Project Objectives
* Implement an **ISO 45001 & OSHA**-aligned 16-item workplace health screening tool.
* Synthesize multi-dimensional risk scores across 5 areas: Posture, Activity, Stress, Recovery, Workload.
* Provide 5 tailored corporate wellbeing curricula.
* Enable interactive daily drill tracking with workstation exercises.
* Connect employees to certified occupational trainers through a clinical review gateway.
* Issue verifiable digital credentials with unique compliance IDs (`IOH-2026-XXXXXX`).

---

### Slide 4: Target Community & Survey Methodology
* **Target Audience**: Desk workers, teachers, office clerks, software developers, and administrative personnel.
* **16-Question Survey Instrument across 4 Workday Phases**:
  1. *Morning Phase*: Sleep restoration, morning vitality, breakfast habits.
  2. *Work Phase*: Seated duration, screen hours, posture shifts, chair ergonomics, physical pain.
  3. *Breaks Phase*: Standing frequency, hydration volume, micro-stretches.
  4. *Evening Phase*: Workload intensity, fatigue levels, detachment, bedtime wind-down.

---

### Slide 5: System Architecture (Strictly 2 Portals)
* **Clean 2-Portal Architecture**:
  * **Employee Portal (`/employee/*`)**: Screening $\rightarrow$ Risk Profile $\rightarrow$ Recommendations $\rightarrow$ Curriculum Tracker $\rightarrow$ Certificate.
  * **Trainer Portal (`/trainer/*`)**: Assigned Cohort $\rightarrow$ Review Queue $\rightarrow$ 4-Point Checklist $\rightarrow$ Approval & Feedback.
* **Zero Admin / Zero HR Overhead**: Direct, transparent interaction between employee and health specialist.

---

### Slide 6: Multi-Dimensional Risk Engine
* **5 Core Risk Dimensions**:
  * **Posture Risk**: Seated static loading and spinal alignment.
  * **Activity Risk**: Chair hours and lack of hourly movement breaks.
  * **Stress Risk**: Cognitive task intensity and off-work boundaries.
  * **Recovery Risk**: Sleep duration and morning restoration.
  * **Workload Risk**: Pace compression and task density.
* **Interactive Visuals**: Recharts 360° Radar Chart gives immediate clarity.

---

### Slide 7: 5 Official Corporate Wellbeing Programs
1. **Workplace Ergonomics & Posture** (3 Weeks • 6 Sessions)
2. **Workplace Yoga & Mobility** (4 Weeks • 8 Sessions)
3. **Daily Movement & Stretch Breaks** (3 Weeks • 6 Sessions)
4. **Guided Meditation & Stress Reset** (4 Weeks • 8 Sessions)
5. **Healthy Recovery & Sleep Habits** (2 Weeks • 4 Sessions)

---

### Slide 8: Clinical Verification & Digital Certification
* **Why Verification Matters**:
  * Certificates cannot be self-awarded or faked.
  * Employees must complete 100% of sessions before requesting review.
* **Trainer Review Process**:
  * 4-Point Checklist: Completion, Consistency, Reflection, Ergonomics.
  * Specialist clinical observations and official feedback notes.
* **Verifiable Credential**:
  * Unique Certificate ID: `IOH-2026-XXXXXX`.
  * Public Verification Portal: `/verify/:certificateId`.

---

### Slide 9: Technical Stack & Architecture
* **Frontend**: React.js 18, Vite, React Router v6, Recharts, Lucide Icons, Pure CSS3 Design System.
* **Backend**: Python 3.12, FastAPI, Uvicorn ASGI Server, Pydantic data schemas.
* **State & Data Isolation**: Client-scoped multi-user data isolation ensuring zero data cross-talk.
* **Automation**: Built-in Windows launcher (`start_platform.bat`, `Windows + R` command integration).

---

### Slide 10: Community Impact & Outcomes
* Successfully screened community participants and generated personalized risk profiles.
* Provided actionable, 10-minute daily desk routines that reduce cervical and lumbar strain.
* High community engagement with clear progress tracking and verifiable milestone rewards.

---

### Slide 11: Conclusion & Future Scope
* **Conclusion**:
  * A production-quality web platform that turns occupational health theory into verified daily habit.
* **Future Scope**:
  * Webcam-based AI posture detection using computer vision (MediaPipe / OpenCV).
  * Automated ergonomic break reminders via desktop push notifications.

---

### Slide 12: Thank You / Q&A
* *Questions & Discussion*
* **Project Demo Link**: `http://localhost:5175/`
* **API Documentation**: `http://127.0.0.1:8000/docs`
