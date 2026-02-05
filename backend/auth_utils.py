from datetime import datetime
from typing import Optional
import jwt
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")

ALGORITHM = "HS256"

def verify_token(token: str) -> Optional[dict]:
    """
    Verify JWT token and return payload if valid, None if invalid
    Better Auth typically includes userId in the token payload
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Better Auth tokens may have different field names
        # Common formats: userId, sub, user.id
        user_id: str = payload.get("userId") or payload.get("sub")

        if user_id is None:
            return None

        return payload
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.JWTError:
        # Invalid token
        return None
    except Exception:
        # Any other error during verification
        return None

def get_current_user_id(token: str) -> Optional[str]:
    """
    Extract user_id from JWT token
    """
    payload = verify_token(token)
    if payload:
        # Try different possible field names for user ID
        return payload.get("userId") or payload.get("sub")
    return None