from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
from db import engine
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app with documentation
app = FastAPI(
    title="Todo App Backend",
    version="1.0.0",
    description="RESTful API for task management with JWT authentication",
    docs_url="/docs",  # Enable Swagger UI at /docs
    redoc_url="/redoc"  # Enable ReDoc at /redoc
)

# Configure CORS for frontend integration
frontend_origin = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
# Allow both the configured origin and localhost:3002 (common when 3000 is in use)
allow_origins_list = [frontend_origin, "http://localhost:3002"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(tasks_router)
app.include_router(auth_router)

@app.on_event("startup")
def on_startup():
    """Create database tables on startup"""
    print("Initializing database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables initialized successfully!")

@app.get("/")
def read_root():
    return {"message": "Todo App Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)