from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth import get_current_user_id

security = HTTPBearer(auto_error=False)

async def get_current_user(request: Request) -> str:
    """
    Get current user ID from JWT token in Authorization header
    """
    credentials: HTTPAuthorizationCredentials = await security.__call__(request)

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    user_id = get_current_user_id(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id