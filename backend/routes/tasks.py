from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from models import Task, TaskCreate, TaskUpdate, TaskResponse
from db import get_session
from auth_middleware import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/api", tags=["tasks"])

@router.get("/tasks")
async def get_tasks(
    current_user_id: str = Depends(get_current_user),
    status_filter: str = Query("all", alias="status"),
    sort: str = Query("created"),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the current user with optional filtering and sorting
    """
    query = select(Task).where(Task.user_id == current_user_id)

    # Apply status filter
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)
    # If "all", no additional filter needed

    # Apply sorting
    if sort == "title":
        query = query.order_by(Task.title)
    elif sort == "due_date":
        query = query.order_by(Task.due_date.desc())
    else:  # Default or "created"
        query = query.order_by(Task.created_at.desc())

    tasks = session.exec(query).all()

    # Format response to match API spec
    return {"tasks": tasks}


@router.post("/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the current user
    """
    task = Task(
        **task_create.dict(),
        user_id=current_user_id
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    # Format response to match API spec
    return {"task": task}


@router.get("/tasks/{task_id}")
async def get_task(
    task_id: uuid.UUID,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the current user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Format response to match API spec
    return {"task": task}


@router.put("/tasks/{task_id}")
async def update_task(
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID for the current user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update task fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update the timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    # Format response to match API spec
    return {"task": task}


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID for the current user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()
    return


@router.patch("/tasks/{task_id}/complete")
async def complete_task(
    task_id: uuid.UUID,
    completed: bool = Query(..., description="Set task completion status"),
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update the completion status of a specific task
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task.completed = completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    # Format response to match API spec
    return {"task": task}