"""
Database initialization script
Creates all tables defined in models
"""
from sqlmodel import SQLModel
from db import engine

def create_tables():
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()