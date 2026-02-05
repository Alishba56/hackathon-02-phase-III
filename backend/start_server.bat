@echo off
REM Script to start the backend server

REM Set environment variables
set NEON_DB_URL=sqlite:///./todo_app.db
set BETTER_AUTH_SECRET=development_secret_key_for_testing

REM Start the server
echo Starting backend server on http://localhost:8000...
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload