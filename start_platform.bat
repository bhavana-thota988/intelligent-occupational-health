@echo off
echo ===============================================================================
echo WorkHealth AI - Intelligent Occupational Health Platform
echo Real Email Authentication & OTP Verification Enabled
echo ===============================================================================

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "WorkHealth AI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "WorkHealth AI Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ===============================================================================
echo Platform successfully launched!
echo - Frontend: http://localhost:5173
echo - Backend API Docs: http://127.0.0.1:8000/docs
echo - SMTP Configuration: backend/.env
echo.
echo Authenticated Accounts (Password: Corporate2026!):
echo - Employee: employee@company.com
echo - Trainer:  trainer@company.com
echo - Admin:    admin@company.com
echo ===============================================================================
pause
