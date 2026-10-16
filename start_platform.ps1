# WorkHealth AI - Intelligent Occupational Health Platform
# Launcher Script for PowerShell

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "Starting WorkHealth AI Platform (Real Email Auth & OTP Security Enabled)" -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev"

Write-Host "`nPlatform successfully launched!" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:5173"
Write-Host "- Backend API Swagger: http://127.0.0.1:8000/docs"
Write-Host "- SMTP Configuration: backend/.env"
Write-Host "`nAuthenticated Accounts (Password: Corporate2026!):" -ForegroundColor Yellow
Write-Host "  Employee : employee@company.com"
Write-Host "  Trainer  : trainer@company.com"
Write-Host "  Admin    : admin@company.com"
Write-Host "`nEnjoy the demonstration!`n" -ForegroundColor Cyan
