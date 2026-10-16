import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import jwt, JWTError
from app.core.config import settings

# Password hashing context using standard bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Safely verify a plain-text password against its stored bcrypt hash."""
    if not plain_password or not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Generate a secure bcrypt hash for the provided password."""
    return pwd_context.hash(password)

def generate_secure_otp() -> str:
    """
    Generate a cryptographically secure 6-digit numeric OTP.
    Uses secrets.randbelow to prevent PRNG predictability.
    Range: 100000 to 999999 (inclusive).
    """
    code = secrets.randbelow(900000) + 100000
    return str(code)

def hash_otp(otp: str) -> str:
    """
    Create a constant-time HMAC-SHA256 digest of the 6-digit OTP.
    The database never stores the raw plaintext OTP.
    """
    key = settings.SECRET_KEY.encode("utf-8")
    message = str(otp).strip().encode("utf-8")
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def verify_otp_hash(plain_otp: str, stored_hash: str) -> bool:
    """
    Verify an entered OTP against the stored HMAC hash using constant-time comparison
    to prevent side-channel timing attacks.
    """
    if not plain_otp or not stored_hash:
        return False
    computed_hash = hash_otp(plain_otp)
    return hmac.compare_digest(computed_hash, stored_hash)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JSON Web Token (JWT) containing user claims and expiration timestamp.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT access token. Returns payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
