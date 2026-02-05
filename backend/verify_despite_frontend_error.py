"""
Test to verify if users are being stored even when frontend shows "Registration failed"
"""
import requests
import json
from sqlmodel import create_engine, Session, select
from models import User
from db import DB_URL
import uuid

def verify_registration_even_if_frontend_fails():
    print("VERIFICATION: Checking if user was stored despite frontend error")
    print("=" * 60)

    # Generate a test email that might have been used when frontend showed error
    test_email = f"verification_test_{uuid.uuid4()}@check.com"
    test_password = "testpass123"
    test_name = "Verification Test"

    print(f"Testing with email: {test_email}")

    BASE_URL = "http://localhost:8000"

    # First, check database BEFORE registration attempt
    print("\n1. CHECKING DATABASE BEFORE REGISTRATION...")
    engine = create_engine(DB_URL)
    with Session(engine) as session:
        statement = select(User).where(User.email == test_email)
        existing_users_before = session.exec(statement).all()
        print(f"   Users with this email before: {len(existing_users_before)}")

    # Now try to register the user
    print("\n2. ATTEMPTING REGISTRATION...")
    registration_data = {
        "name": test_name,
        "email": test_email,
        "password": test_password
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_data)
        print(f"   API Response Status: {response.status_code}")

        if response.status_code == 200:
            print("   [SUCCESS] API Registration successful")
            try:
                result = response.json()
                print(f"   [INFO] Got user data: {result['user']['email']}")
            except:
                print("   [WARNING] Could not parse response JSON")
        else:
            print(f"   [WARNING] API Registration failed with status: {response.status_code}")
            print(f"   [WARNING] Response: {response.text}")

    except Exception as e:
        print(f"   [WARNING] API call failed: {str(e)}")

    # Check database AFTER registration attempt
    print("\n3. CHECKING DATABASE AFTER REGISTRATION ATTEMPT...")
    with Session(engine) as session:
        statement = select(User).where(User.email == test_email)
        users_after = session.exec(statement).all()
        print(f"   Users with this email after: {len(users_after)}")

        if users_after:
            user = users_after[0]
            print(f"   [SUCCESS] USER WAS STORED IN DATABASE!")
            print(f"   [INFO] Email: {user.email}")
            print(f"   [INFO] Name: {user.name}")
            print(f"   [INFO] ID: {user.id}")
            print(f"   [INFO] Created: {user.created_at}")
            print(f"   [SUCCESS] The user was stored despite any frontend error!")
        else:
            print(f"   [WARNING] No user found in database with this email")

    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print("If a user was found in the database, registration worked at the backend")
    print("even if the frontend showed an error.")

if __name__ == "__main__":
    verify_registration_even_if_frontend_fails()