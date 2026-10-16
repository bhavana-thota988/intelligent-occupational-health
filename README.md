# Intelligent Occupational Health and Workplace Risk Management Platform
### Workplace Health, Risk Assessment & Employee Wellbeing Management
*B.Tech Final-Year Production Web Application*

---

## 1. Overview & Vision
The **Intelligent Occupational Health and Workplace Risk Management Platform** is a corporate-grade, full-stack occupational health application built to identify physical ergonomics, sedentary behaviors, and cognitive stressors among knowledge workers while preserving privacy.

The platform provides an end-to-end connected workflow:
```
Landing Page (/) 
   ➔ Login (/login) 
   ➔ Automated Role Detection 
   ➔ Role-Specific Console 
   ➔ 16-Factor Assessment (/employee/assessment) 
   ➔ Dynamic Risk Profile (/employee/risk-profile) 
   ➔ Personalized Recommendations (/employee/recommendations) 
   ➔ Enrolled Programs (/employee/my-programs) 
   ➔ Longitudinal Progress (/employee/my-progress)
```

---

## 2. Technology Stack

- **Frontend**:
  - React.js 19 with Vite 8
  - React Router DOM 7 with route authorization guards (`ProtectedRoute`)
  - Recharts for data analytics (Radars, Bar charts, Pie distribution, Longitudinal line trends)
  - Lucide React for consistent healthcare iconography
  - Clean modular CSS design system (`#147D75`, `#183533`, `#F3F8F6`, `#DCEFEB`, `#6D817D`)
  - Offline-first dual persistence (`localStorage` + FastAPI REST sync)

- **Backend**:
  - FastAPI (REST API with OpenAPI/Swagger documentation at `/docs`)
  - SQLite database for instant zero-configuration deployment (`occupational_health.db`)
  - SQLAlchemy ORM with auto-seeding lifespan logic
  - CORS middleware supporting Vite development servers

---

## 3. Four Role Portals & Authentication

The platform automatically detects user privilege levels from the email address upon sign-in. Any valid email and any non-empty password are accepted.

| Role | Email Format Example | Target Dashboard | Core Purpose |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@company.com` or any standard email | `/employee/dashboard` | 16-question assessment, risk profiling, personalized ergonomic & movement recommendations, module tracking |
| **HR Team** | `hr@company.com` | `/hr/dashboard` | Aggregated workforce health metrics, department risk comparisons, hazard registers, audit reports without medical exposure |
| **Trainer** | `trainer@company.com` | `/trainer/dashboard` | Assigned employee rosters, 1-on-1 ergonomic coaching scheduling, program curriculum management |
| **Admin** | `admin@company.com` | `/admin/dashboard` | Enterprise user management, role adjustments, department hierarchies, telemetry & audit logs |

---

## 4. Key Pages & Features

### Public & Authentication
- **Landing Page (`/`)**: Corporate healthcare presentation introducing the platform's core pillars without immediate dashboard overload.
- **Login (`/login`)**: Split-screen corporate login with role auto-detection, remember me, and quick demo role switcher shortcuts.
- **Registration (`/register`)**: Enterprise onboarding with role selection (Employee, HR, Trainer).

### Employee Wellbeing Journey
- **Employee Dashboard (`/employee/dashboard`)**: Risk gauge summaries, multi-axial radar preview, active coaching course progress, and high-priority recommendations.
- **16-Question Health Assessment (`/employee/assessment`)**: Multi-phase assessment (*Morning*, *Work*, *Breaks*, *Evening*) with live health profile updating in real time, question stepper, and router navigation.
- **Workplace Risk Profile (`/employee/risk-profile`)**: Overall composite score (0-100%), dimension breakdown cards (*Posture*, *Activity*, *Stress*, *Recovery*, *Workload*), and mandatory non-diagnostic disclaimer notice.
- **Intelligent Recommendations (`/employee/recommendations`)**: Rule-based dynamic recommendation engine mapping calculated risk scores directly to high/moderate/low priority interventions with one-click enrollment.
- **My Programs (`/employee/my-programs`)**: Interactive curriculum viewer with step-by-step module modal and progress increments.
- **My Progress (`/employee/my-progress`)**: 6-week risk score trajectory chart and daily workstation habit checklist.
- **Employee Profile (`/employee/profile`)**: Enterprise employee ID, department, and workstation hardware preferences (sit-stand desk, monitor count, ergonomic chair).

### Enterprise Management
- **HR Portal (`/hr/*`)**: Privacy-preserving aggregated analytics, departmental hazard heatmaps, and downloadable compliance summaries (ISO 45001).
- **Trainer Portal (`/trainer/*`)**: Assigned employee cohort list, 1-on-1 virtual consultation scheduler, and lesson tracker.
- **Admin Portal (`/admin/*`)**: Complete system overview, user directory with role-switching modals, department manager, and audit logs.

---

## 5. How to Run the Platform

### Option A: One-Click Launcher (Windows)
Double-click:
```bash
start_platform.bat
```
*(Or right-click and run `start_platform.ps1` with PowerShell)*

### Option B: Manual Terminal Execution

#### 1. Start FastAPI Backend:
```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### 2. Start React Frontend:
```bash
cd frontend
npm run dev
```
Application URL: [http://localhost:5173](http://localhost:5173)

#### 3. Build Production Bundle:
```bash
cd frontend
npm run build
```
*(Compiles cleanly with 0 errors to `dist/`)*

---

## 6. Compliance & Privacy Notice
All assessment indicators and recommendation protocols are non-diagnostic and designed solely for occupational health education, postural guidance, and corporate ergonomic risk screening.
