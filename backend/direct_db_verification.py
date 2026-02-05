"""
Direct database verification to check if users are being stored in the PostgreSQL database.
"""
from sqlmodel import create_engine, Session, select
from models import User
import os
from db import DB_URL

def direct_database_check():
    print("DIRECT DATABASE VERIFICATION")
    print("=" * 40)
    print(f"Database URL: {DB_URL}")

    try:
        # Create engine and connect to the database
        engine = create_engine(DB_URL)

        # Create a session and query for users
        with Session(engine) as session:
            print("\nQuerying database for users...")

            # Get count of all users
            statement = select(User)
            users = session.exec(statement).all()

            print(f"Total users in database: {len(users)}")

            if users:
                print("\nList of users in database:")
                for i, user in enumerate(users, 1):
                    print(f"  {i}. ID: {user.id}")
                    print(f"     Email: {user.email}")
                    print(f"     Name: {user.name}")
                    print(f"     Created: {user.created_at}")
                    print(f"     Active: {user.is_active}")
                    print()

                print(f"✅ CONFIRMED: {len(users)} users found in database!")
                print("✅ User storage is working correctly!")

            else:
                print("\n❌ No users found in database.")
                print("❌ User storage may not be working.")

    except Exception as e:
        print(f"\n❌ Error connecting to database: {str(e)}")
        print("This could be due to database connection issues.")

        # Fallback: Check if we can at least connect to SQLite as backup
        try:
            sqlite_url = "sqlite:///./todo_app.db"
            print(f"\nTrying fallback SQLite connection: {sqlite_url}")
            sqlite_engine = create_engine(sqlite_url)
            with Session(sqlite_engine) as session:
                statement = select(User)
                users = session.exec(statement).all()
                print(f"Fallback SQLite users: {len(users)}")
        except:
            print("Fallback SQLite connection also failed.")

    print("\n" + "=" * 40)
    print("DATABASE VERIFICATION COMPLETE")

if __name__ == "__main__":
    direct_database_check()