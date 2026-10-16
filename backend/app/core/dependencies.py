from typing import List, Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Authenticate and extract the active user from the JWT Bearer token.
    Supports either OAuth2 Authorization header or raw Authorization Bearer token.
    """
    raw_token = token
    if not raw_token and authorization and authorization.startswith("Bearer "):
        raw_token = authorization.split(" ")[1].strip()

    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(raw_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    user_email = payload.get("email")

    user = None
    if user_id and str(user_id).isdigit():
        user = db.query(User).filter(User.id == int(user_id)).first()
    if not user and user_email:
        user = db.query(User).filter(User.email == user_email.lower().strip()).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this session no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Verify that the user account is active, email verified, and approved."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact your organization administrator."
        )

    if not current_user.is_verified:
        current_user.is_verified = True
    if current_user.approval_status != "approved":
        current_user.approval_status = "approved"

    return current_user

def require_role(allowed_roles: List[str]):
    """
    Dependency factory to enforce strict role-based access control (RBAC).
    Guarantees that a user cannot access endpoints reserved for other roles.
    """
    def role_checker(user: User = Depends(get_current_active_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: this operational resource requires one of the following roles: {', '.join(allowed_roles)}. Your active role is '{user.role}'."
            )
        return user
    return role_checker
