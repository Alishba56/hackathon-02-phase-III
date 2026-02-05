import os
# Set environment variables before importing any modules
os.environ['NEON_DB_URL'] = 'sqlite:///test.db'
os.environ['BETTER_AUTH_SECRET'] = 'test_secret'

from fastapi.testclient import TestClient
from main import app
from models import Task, TaskCreate
from sqlmodel import Session, select
from datetime import datetime
import uuid
from unittest.mock import patch

client = TestClient(app)

def test_read_root():
    """Test the root endpoint returns correct message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo App Backend API"}
    print("[SUCCESS] test_read_root passed")

def test_get_tasks_unauthorized():
    """Test that getting tasks without auth token returns 401."""
    response = client.get("/api/tasks")
    assert response.status_code == 401
    print("[SUCCESS] test_get_tasks_unauthorized passed")

def test_docs_endpoints_available():
    """Test that API documentation endpoints are available."""
    response = client.get("/docs")
    assert response.status_code == 200
    print("[SUCCESS] test_docs_endpoints_available passed")

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
    print("[SUCCESS] test_create_task_success passed")

@patch('routes.auth_middleware.get_current_user')
def test_get_tasks_success(mock_get_current_user):
    """Test successful retrieval of tasks with mocked authentication."""
    mock_get_current_user.return_value = "test_user_id"

    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert "tasks" in data
    print("[SUCCESS] test_get_tasks_success passed")

if __name__ == "__main__":
    print("Running basic tests...")

    # Run tests
    test_read_root()
    test_get_tasks_unauthorized()
    test_docs_endpoints_available()

    # For tests that require mocking, we'll run them separately
    print("[SKIPPED] Mock-dependent tests (require more complex setup)")

    print("\n[SUCCESS] Basic tests completed successfully!")