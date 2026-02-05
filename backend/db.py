from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DB_URL = os.getenv("NEON_DB_URL")

if not DB_URL:
    # Default to SQLite for development if no database URL is provided
    DB_URL = "sqlite:///./todo_app.db"
    print("Using SQLite database for development")

# Create engine with appropriate settings based on database type
if DB_URL.startswith("sqlite"):
    # SQLite doesn't support connection pooling, so use basic settings
    engine = create_engine(DB_URL)
else:
    # Use connection pooling settings for PostgreSQL/Neon
    engine = create_engine(
        DB_URL,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300,    # Recycle connections every 5 minutes
    )

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session