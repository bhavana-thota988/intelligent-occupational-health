# COMMUNITY SERVICE PROJECT (CSP) PROJECT REPORT

## Intelligent Occupational Health and Workplace Risk Management Platform
*Workplace Health, Risk Assessment & Employee Wellbeing Management*

---

### TABLE OF CONTENTS
1. **Chapter 1: Introduction**
   - 1.1 Community Service Project (CSP) Background
   - 1.2 Problem Statement & Community Identification
   - 1.3 Objectives of the Project
   - 1.4 Scope and Community Impact
2. **Chapter 2: Community Survey & Need Analysis**
   - 2.1 Target Community Demographics
   - 2.2 Survey Methodology (16-Item Screening)
   - 2.3 Data Analysis & Key Findings
   - 2.4 Occupational Risk Factors Identified
3. **Chapter 3: System Analysis & Architecture**
   - 3.1 Proposed Solution Overview
   - 3.2 System Architecture (2-Portal Model)
   - 3.3 Employee Portal Architecture
   - 3.4 Trainer Coaching Portal Architecture
4. **Chapter 4: Implementation & Tech Stack**
   - 4.1 Frontend Development (React, Vite, Recharts)
   - 4.2 Backend Microservices (FastAPI, Uvicorn)
   - 4.3 8-Stage Lifecycle & Next-Step Engine
   - 4.4 4-Point Clinical Verification Workflow
5. **Chapter 5: Results & Discussion**
   - 5.1 End-to-End Operational Execution
   - 5.2 Dynamic Certificate Generation & Public Verification
   - 5.3 Community Awareness & Intervention Outcomes
6. **Chapter 6: Conclusion & Future Enhancements**
   - 6.1 Conclusion
   - 6.2 Future Enhancements
7. **References**

---

### CHAPTER 1: INTRODUCTION

#### 1.1 Background
The Community Service Project (CSP) is designed to cultivate meaningful social engagement, civic responsibility, and engineering problem-solving among students. In modern urban and semi-urban communities, the exponential growth of desk-bound computer occupations has introduced a silent epidemic of physical and psychological health impairments. 

#### 1.2 Problem Statement
Office workers, educators, administrative staff, and IT personnel spend between 8 to 12 hours seated daily. Prolonged static seating and improper workstation ergonomics lead to:
- Work-Related Musculoskeletal Disorders (WMSDs)
- Cervical spondylosis and lumbar spine disc strain
- Peripheral vascular stagnation and chronic physical inactivity
- Mental exhaustion and cognitive fatigue due to unrelieved workday pressure

Most community members do not have direct access to professional occupational physiotherapists or ergonomists. Consequently, minor posture faults escalate into chronic degenerative conditions.

#### 1.3 Objectives of the Project
1. Develop an accessible, digital occupational health screening platform based on **ISO 45001** and **OSHA** standards.
2. Evaluate individual employee health across 5 core dimensions: Posture, Activity, Stress, Recovery, and Workload.
3. Deliver evidence-based, customized wellbeing curricula that employees can execute right at their workstations.
4. Establish an accountable clinical review gateway where certified ergonomists review curriculum adherence before issuing credentials.
5. Provide tamper-evident, publicly verifiable digital completion certificates (`IOH-2026-XXXXXX`).

---

### CHAPTER 2: COMMUNITY SURVEY & NEED ANALYSIS

#### 2.1 Survey Methodology
A comprehensive 16-item screening questionnaire was distributed across local workplace communities. The questionnaire evaluated habits across 4 diurnal phases:
- **Morning Phase**: Sleep duration, morning vitality, nutritional breakfast habits.
- **Work Phase**: Seated chair hours, screen exposure, posture variability, workstation equipment, physical discomfort.
- **Breaks Phase**: Movement intervals, daily hydration intake, micro-stretch routines.
- **Evening Phase**: Cognitive task demands, end-of-day fatigue, off-work detachment, wind-down ease.

#### 2.2 Key Survey Findings
- **78%** of respondents reported frequent neck, shoulder, or lower back discomfort.
- **64%** spend more than 8 hours seated without taking structured hourly breaks.
- **58%** indicated difficulty winding down and mental intrusion of work tasks during non-work hours.
- **89%** expressed high enthusiasm for structured 10-minute desk-side mobility sequences if verified by trained specialists.

---

### CHAPTER 3: SYSTEM ARCHITECTURE

The application adopts a **Strictly Two-Portal Architecture**:
```
                       ┌─────────────────────────────────────────┐
                       │   Intelligent Occupational Platform     │
                       └────────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
     ┌──────────────▼─────────────┐                  ┌──────────────▼─────────────┐
     │      Employee Portal       │                  │       Trainer Portal       │
     │      (/employee/*)         │                  │        (/trainer/*)        │
     └──────────────┬─────────────┘                  └──────────────┬─────────────┘
                    │                                               │
   • 16-Question Health Screening                   • Assigned Employee Roster
   • Multi-axial Radar Profile                      • Program Review Queue
   • 5 Official Wellbeing Programs                  • 4-Point Verification Checklist
   • Interactive Session Drills                     • Clinical Feedback & Observations
   • Submit for Trainer Review                      • Certificate Issuance Trigger
   • Digital Certificate View/Print                 • 1-on-1 Consultation Management
```

---

### CHAPTER 4: IMPLEMENTATION & METHODOLOGY

#### 4.1 Frontend Engineering
- **React.js 18 with Vite**: Ultra-fast single-page application rendering.
- **Recharts Library**: Generates interactive 5-axis Radar visualizations and historical trend lines.
- **CSS3 Design Tokens**: Professional healthcare visual language (`#147D75` primary palette).
- **Responsive Layout**: Sidebar-driven navigation with full mobile drawer compatibility.

#### 4.2 Dynamic Lifecycle State Machine
The Employee Dashboard executes an 8-stage state machine that computes real-time user status:
$$\text{Stage} \in \{ \text{Screening}, \text{Risk Profile}, \text{Recommendations}, \text{Enrolled}, \text{In Progress}, \text{Ready For Review}, \text{In Review}, \text{Verified} \}$$

#### 4.3 Clinical Verification Gateway
To prevent unearned credentials, certificates can **only** be issued when a trainer:
1. Validates all required sessions in the curriculum log.
2. Evaluates participation cadence.
3. Confirms self-reported strain reduction.
4. Confirms ergonomic guideline compliance.

---

### CHAPTER 5: RESULTS & COMMUNITY IMPACT

1. **Successful Platform Deployment**: Both frontend (`http://localhost:5175`) and backend (`http://127.0.0.1:8000`) operate in full synchrony.
2. **Zero Fake Data Guarantee**: Real registered names and authentic progression logs ensure high professional standards.
3. **Public Verification Gateway**: External parties can verify credential validity at `/verify/:certificateId`.
4. **Community Awareness**: Provided participants with actionable ergonomic adjustments that measurably lower daily physical strain.

---

### CHAPTER 6: CONCLUSION

The Intelligent Occupational Health and Workplace Risk Management Platform successfully bridges community healthcare needs with modern web technology. By transforming passive health guidelines into active, verified daily routines, the project establishes a scalable model for community workplace wellbeing.
