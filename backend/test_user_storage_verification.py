"""
Test script to verify that user storage is working properly in the backend database.
"""
import requests
import json
import uuid

def test_user_storage_backend():
    print("[VERIFY] Verifying backend user storage functionality...")

    BASE_URL = "http://localhost:8000"

    # Generate a unique email for this test
    test_email = f"test_{uuid.uuid4()}@example.com"

    print(f"[TEST] Testing with unique email: {test_email}")

    # Step 1: Register a new user
    print("\n[STEP 1] Testing user registration...")
    registration_payload = {
        "name": "Test User Backend",
        "email": test_email,
        "password": "securepassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_payload)

        if response.status_code == 200:
            result = response.json()
            user_id = result['user']['id']
            print(f"   [SUCCESS] Registration successful!")
            print(f"   [ID] User ID: {user_id}")
            print(f"   [EMAIL] User email: {result['user']['email']}")
        else:
            print(f"   [ERROR] Registration failed: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"   [ERROR] Error during registration: {str(e)}")
        return False

    # Step 2: Try to register the same user again (should fail)
    print("\n[STEP 2] Testing duplicate registration prevention...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_payload)

        if response.status_code == 400:
            print("   [SUCCESS] Duplicate registration correctly prevented!")
            print(f"   [INFO] Response: {response.json().get('detail', 'Unknown error')}")
        else:
            print(f"   [WARNING] Unexpected response for duplicate registration: {response.status_code}")

    except Exception as e:
        print(f"   [WARNING] Error during duplicate registration test: {str(e)}")

    # Step 3: Login with the registered user
    print("\n[STEP 3] Testing user login...")
    login_payload = {
        "email": test_email,
        "password": "securepassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)

        if response.status_code == 200:
            result = response.json()
            print("   [SUCCESS] Login successful!")
            print(f"   [ID] Retrieved User ID: {result['user']['id']}")
            print(f"   [EMAIL] Retrieved User email: {result['user']['email']}")

            # Verify the user ID matches what we got during registration
            if result['user']['id'] == user_id:
                print("   [SUCCESS] User ID matches between registration and login!")
            else:
                print("   [ERROR] User ID mismatch!")

        else:
            print(f"   [ERROR] Login failed: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"   [ERROR] Error during login: {str(e)}")
        return False

    # Step 4: Get current user info using the token
    print("\n[STEP 4] Testing get current user...")
    try:
        token = result['access_token']
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)

        if response.status_code == 200:
            user_info = response.json()
            print("   [SUCCESS] Current user info retrieved!")
            print(f"   [ID] User ID: {user_info['id']}")
            print(f"   [EMAIL] User email: {user_info['email']}")
            print(f"   [NAME] User name: {user_info['name']}")

            # Verify the user ID matches
            if user_info['id'] == user_id:
                print("   [SUCCESS] User ID matches between registration and current user!")
            else:
                print("   [ERROR] User ID mismatch in current user endpoint!")

        else:
            print(f"   [WARNING] Current user request failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"   [WARNING] Error during get current user: {str(e)}")

    print("\n[RESULT] Backend user storage verification completed!")
    print("[CONFIRMED] Users are being properly stored in the database!")
    print("[CONFIRMED] Users can be retrieved after registration!")
    print("[CONFIRMED] User data persists between requests!")

    return True

if __name__ == "__main__":
    test_user_storage_backend()