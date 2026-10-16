import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    PROJECT_NAME: str = "WorkHealth AI — Intelligent Occupational Health Platform"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./occupational_health.db"
    SECRET_KEY: str = "workhealth-ai-jwt-super-secret-key-production-2026-xyz987"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # SMTP Email Configuration
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_FROM_NAME: str = "WorkHealth AI"
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False

    # Security & Policies
    FRONTEND_URL: str = "http://localhost:5173"
    OTP_EXPIRY_MINUTES: int = 5
    OTP_MAX_ATTEMPTS: int = 5
    OTP_RESEND_COOLDOWN_SECONDS: int = 60

    # Admin Account Bootstrap
    ADMIN_BOOTSTRAP_EMAIL: str = "admin@company.com"
    ADMIN_BOOTSTRAP_PASSWORD: str = "Corporate2026!"
    ADMIN_BOOTSTRAP_NAME: str = "Health Directorate Administrator"

    # Approval Policy ("automatic" or "manual")
    EMPLOYEE_APPROVAL_POLICY: str = "automatic"

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
