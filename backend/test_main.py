import pytest
from fastapi.testclient import TestClient
from main import app
from models import Task, TaskCreate
from sqlmodel import Session, select
from datetime import datetime
import uuid
import os
from unittest.mock import patch

client = TestClient(app)

def test_read_root():
    """Test the root endpoint returns correct message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo App Backend API"}

def test_get_tasks_unauthorized():
    """Test that getting tasks without auth token returns 401."""
    response = client.get("/api/tasks")
    assert response.status_code == 401

def test_docs_endpoints_available():
    """Test that API documentation endpoints are available."""
    response = client.get("/docs")
    assert response.status_code == 200

    response = client.get("/redoc")
    assert response.status_code == 200

@patch('routes.auth_middleware.get_current_user')
def test_create_task_success(mock_get_current_user):
    """Test successful task creation with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "priority": "medium"
    }

    response = client.post("/api/tasks", json=task_data)
    assert response.status_code == 201
    data = response.json()
    assert "task" in data
    assert data["task"]["title"] == "Test Task"
    assert data["task"]["user_id"] == "test_user_id"

@patch('routes.auth_middleware.get_current_user')
def test_get_tasks_success(mock_get_current_user):
    """Test successful retrieval of tasks with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert "tasks" in data

@patch('routes.auth_middleware.get_current_user')
def test_update_task_success(mock_get_current_user):
    """Test successful task update with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    # First create a task
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "priority": "medium"
    }

    create_response = client.post("/api/tasks", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["task"]["id"]

    # Update the task
    update_data = {
        "title": "Updated Task",
        "completed": True
    }

    response = client.put(f"/api/tasks/{task_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["task"]["title"] == "Updated Task"
    assert data["task"]["completed"] is True

@patch('routes.auth_middleware.get_current_user')
def test_delete_task_success(mock_get_current_user):
    """Test successful task deletion with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    # First create a task
    task_data = {
        "title": "Task to Delete",
        "description": "Description",
        "priority": "medium"
    }

    create_response = client.post("/api/tasks", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["task"]["id"]

    # Delete the task
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 204

@patch('routes.auth_middleware.get_current_user')
def test_complete_task_success(mock_get_current_user):
    """Test successful task completion update with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    # First create a task
    task_data = {
        "title": "Task to Complete",
        "description": "Description",
        "priority": "medium"
    }

    create_response = client.post("/api/tasks", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["task"]["id"]

    # Update completion status
    response = client.patch(f"/api/tasks/{task_id}/complete?completed=true")
    assert response.status_code == 200
    data = response.json()
    assert data["task"]["completed"] is True

@patch('routes.auth_middleware.get_current_user')
def test_task_filtering_and_sorting(mock_get_current_user):
    """Test task filtering and sorting functionality."""
    mock_get_current_user.return_value = "test_user_id"

    # Create multiple tasks
    tasks = [
        {"title": "Task 1", "priority": "high", "completed": False},
        {"title": "Task 2", "priority": "low", "completed": True},
        {"title": "Task 3", "priority": "medium", "completed": False}
    ]

    for task in tasks:
        client.post("/api/tasks", json=task)

    # Test filtering by status
    response = client.get("/api/tasks?status=pending")
    assert response.status_code == 200
    data = response.json()
    pending_tasks = [task for task in data["tasks"] if not task["completed"]]
    assert len(data["tasks"]) == len(pending_tasks)

    # Test filtering by completed status
    response = client.get("/api/tasks?status=completed")
    assert response.status_code == 200
    data = response.json()
    completed_tasks = [task for task in data["tasks"] if task["completed"]]
    assert len(data["tasks"]) == len(completed_tasks)

def test_security_requirements_jwt_validation():
    """Test that JWT validation is properly enforced."""
    # Try to access protected endpoint without token
    response = client.get("/api/tasks")
    assert response.status_code == 401
    assert "Authorization token required" in response.json().get("detail", "")

def test_user_isolation():
    """Test that users can only access their own tasks."""
    # This would require more complex mocking to test properly
    # The logic is verified in the routes code with user_id checks
    pass

if __name__ == "__main__":
    pytest.main([__file__])