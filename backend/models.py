from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
import hashlib

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium", max_length=20)  # Added priority field

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)  # Index for user-based filtering
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)  # Index for sorting
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)  # Index for audit trail

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    priority: Optional[str] = Field(default=None, max_length=20)  # Added priority field

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str = Field(max_length=100)
    hashed_password: str = Field(exclude=True)  # Exclude from responses for security
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class UserCreate(SQLModel):
    name: str = Field(max_length=100)
    email: str = Field(regex=r'^[^@]+@[^@]+\.[^@]+$')  # Basic email validation
    password: str = Field(min_length=6)  # At least 6 characters


class UserUpdate(SQLModel):
    name: Optional[str] = Field(default=None, max_length=100)
    email: Optional[str] = Field(default=None, regex=r'^[^@]+@[^@]+\.[^@]+$')
    is_active: Optional[bool] = Field(default=None)


class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TaskResponse(TaskBase):
    id: uuid.UUID
    user_id: str
    created_at: datetime
    updated_at: datetime