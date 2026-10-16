# STEP-BY-STEP PROCEDURE FOR EXECUTING THE PROJECT / CODE

**Project Title**: Intelligent Occupational Health and Workplace Risk Management Platform  
**Target Environment**: Windows 10/11, macOS, Linux  
**Repository Structure**: Monorepo (`frontend/` + `backend/`)  

---

## 1. Prerequisites Checklist
Before executing the application, ensure the host machine has the following tools installed:
1. **Node.js**: Version 18.x or higher (`node -v`)
2. **npm**: Version 9.x or higher (`npm -v`)
3. **Python**: Version 3.10, 3.11, or 3.12 (`python --version`)
4. **Git**: Version 2.30+ (`git --version`)
5. **Modern Web Browser**: Google Chrome, Microsoft Edge, or Mozilla Firefox

---

## 2. One-Click Automated Execution (Recommended for Windows)

In the root directory of the project, a pre-configured automation script is provided:

1. Open the project root folder:
   ```text
   C:\Users\Bhavana Thota\intelligent-occupational-health\
   ```
2. Double-click the file: **`start_platform.bat`**
3. The script will automatically:
   - Launch the Python FastAPI backend on `http://127.0.0.1:8000`
   - Launch the React Vite frontend on `http://localhost:5175`
   - Automatically open your default web browser to the application landing page.

---

## 3. Manual Step-by-Step Execution Procedure

If you prefer to start each service individually via terminal:

### Step A: Starting the Python FastAPI Backend Service
1. Open a terminal (PowerShell or Command Prompt).
2. Navigate to the backend directory:
   ```powershell
   cd "C:\Users\Bhavana Thota\intelligent-occupational-health\backend"
   ```
3. Activate the Python virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
4. Start the Uvicorn ASGI server:
   ```powershell
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
5. Confirm server output indicates:
   ```text
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   INFO:     Application startup complete.
   ```
6. Swagger interactive API documentation is available at: `http://127.0.0.1:8000/docs`

---

### Step B: Starting the React Vite Frontend Service
1. Open a second terminal window.
2. Navigate to the frontend directory:
   ```powershell
   cd "C:\Users\Bhavana Thota\intelligent-occupational-health\frontend"
   ```
3. Ensure all dependencies are installed:
   ```powershell
   npm install
   ```
4. Launch the Vite development server:
   ```powershell
   npm run dev
   ```
5. The terminal will output:
   ```text
     VITE v8.3.0  ready in 223 ms

     ➜  Local:   http://localhost:5175/
   ```
6. Open your browser and navigate to: **`http://localhost:5175/`**

---

## 4. End-to-End Operational Workflow Walkthrough

To demonstrate the full project lifecycle to faculty or evaluators:

### Step 1: Landing Page & Public Access
- Open `http://localhost:5175/`.
- Review the 4 platform pillars: *Workplace Risk Screening*, *Clinical Radar Insights*, *Tailored Interventions*, and *Digital Certification*.
- Click **"Sign In"** in the top navigation.

### Step 2: Employee Experience (Bhavana Thota)
1. On `/login`, toggle **Employee Portal**.
2. Click **"Demo: Bhavana Thota"** (or enter any valid email) and click **Sign In**.
3. You arrive at `/employee/dashboard`:
   - Notice the prominent **"Your Next Step"** card directing you to take the screening.
4. Click **"Start Health Assessment"** (`/employee/assessment`):
   - Answer the 16 questions across Morning, Work, Breaks, and Evening phases.
   - Click **"Complete Workplace Health Assessment"**.
5. View your **Workplace Risk Profile** (`/employee/risk-profile`):
   - Inspect the 5 dimension scores (Posture, Activity, Stress, Recovery, Workload) and the multi-axial Recharts Radar.
6. Click **"View Personalized Recommendations"** (`/employee/recommendations`):
   - Inspect the recommended curriculum (e.g., *Workplace Ergonomics & Posture*).
   - Click **"Start Program"**.
7. In the interactive curriculum tracker (`/employee/program/:programId`):
   - Check off all sessions as you complete workplace drills.
   - Once all sessions are marked complete (100%), click **"Submit for Trainer Review"**.
8. Notice the status updates to: **Awaiting Trainer Review**.

### Step 3: Trainer Experience (Dr. Sarah Jenkins)
1. Sign out of the employee account and return to `/login`.
2. Toggle **Trainer Console**.
3. Click **"Demo: Dr. Sarah Jenkins"** and click **Sign In**.
4. You arrive at `/trainer/dashboard`:
   - An amber **"Action Required • Submission Queue"** alert is visible immediately.
5. Click **"Open Review Queue"** (`/trainer/reviews`):
   - Click **"Review & Verify"** on Bhavana Thota's submission.
6. On the review detail page (`/trainer/reviews/:reviewId`):
   - Verify the 4-point review checklist:
     - [x] Completion Verification (All sessions logged)
     - [x] Participation Consistency (Cadence observed)
     - [x] Reflection & Fatigue (Strain reduction noted)
     - [x] Ergonomic Alignment (Workstation guidelines met)
   - Add specialist observations and official feedback.
   - Click **"Approve & Issue Certificate"**.
   - A unique certificate credential (`IOH-2026-XXXXXX`) is generated instantly!

### Step 4: Verification & Certificate Presentation
1. Sign back in as Employee (`Bhavana Thota`).
2. Go to **My Certificates** (`/employee/certificates`).
3. Click **"View Certificate"**:
   - The formal corporate certificate displays the employee name, program, trainer verification seal, signature, and unique certificate ID.
   - Click **"Print / Save PDF"** to generate hard-copy evidence.
4. Test Public Verification:
   - Visit `http://localhost:5175/verify` and enter the certificate ID to confirm authenticity.
