from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import uuid
from datetime import datetime, timedelta
import jwt
import os
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from models import User, UserCreate, UserPublic
from db import get_session
import hashlib
import secrets

router = APIRouter(tags=["auth"])

def get_password_hash(password: str) -> str:
    """Hash a password using SHA256 with salt"""
    # Generate a random salt
    salt = secrets.token_hex(16)
    # Combine password and salt
    salted_password = password + salt
    # Hash the salted password
    hashed = hashlib.sha256(salted_password.encode()).hexdigest()
    # Return combined salt + hash for storage
    return f"{salt}${hashed}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    # Split the stored hash to get salt and hash
    parts = hashed_password.split('$')
    if len(parts) != 2:
        return False

    salt, stored_hash = parts
    # Hash the provided password with the same salt
    salted_password = plain_password + salt
    hashed_input = hashlib.sha256(salted_password.encode()).hexdigest()

    # Compare the hashes
    return hashed_input == stored_hash

# JWT Configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "AzfU4Hp45yY1ltETniVuMTVjnMNrwgnt")  # Use the same fallback as in .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models for auth
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str = Field(max_length=100)
    email: str = Field(pattern=r'^[^@]+@[^@]+\.[^@]+$')  # Basic email validation
    password: str = Field(min_length=6)  # At least 6 characters

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """Get a user by email from the database"""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user

@router.post("/api/auth/login")
async def login(user_login: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token
    Verify the password against stored hash in the database
    """
    # Find user by email
    user = get_user_by_email(session, user_login.email)

    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create token with actual user data
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name
    }

    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    }

@router.post("/api/auth/register")
async def register(user_register: UserRegister, session: Session = Depends(get_session)):
    """
    Register a new user and return JWT token
    Store user in database with hashed password
    """
    # Check if user already exists
    existing_user = get_user_by_email(session, user_register.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user_register.password)

    # Create new user
    user = User(
        name=user_register.name,
        email=user_register.email,
        hashed_password=hashed_password
    )

    # Add user to database
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create token with actual user data
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name
    }

    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    }

@router.post("/api/auth/logout")
async def logout():
    """
    Logout user (client-side token removal is typically sufficient)
    This endpoint can be used for additional server-side operations if needed
    """
    return {"message": "Logged out successfully"}

@router.get("/api/auth/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()), session: Session = Depends(get_session)):
    """
    Get current user information by validating the JWT token
    """
    token = credentials.credentials
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database using the ID from the token
        user = session.get(User, uuid.UUID(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )