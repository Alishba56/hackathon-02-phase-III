from sqlmodel import Session, select
from models import User
from db import get_session, engine
import uuid

def test_user_storage():
    """Test if users can be stored in the database"""

    # Get a session
    with Session(engine) as session:
        # Create a test user
        test_user = User(
            name="Test User",
            email="test@example.com",
            hashed_password="test_hashed_password"
        )

        # Add the user to the database
        session.add(test_user)
        session.commit()
        session.refresh(test_user)

        print(f"Created user: {test_user.name} with ID: {test_user.id}")

        # Query the user back from the database
        retrieved_user = session.get(User, test_user.id)

        if retrieved_user:
            print(f"Successfully retrieved user: {retrieved_user.name}")
            print(f"User ID: {retrieved_user.id}")
            print(f"User email: {retrieved_user.email}")
        else:
            print("Failed to retrieve the user from the database")

        # Clean up - delete the test user
        session.delete(test_user)
        session.commit()
        print("Test user deleted")

if __name__ == "__main__":
    test_user_storage()