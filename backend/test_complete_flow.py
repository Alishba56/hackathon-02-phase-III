import requests
import json

# Test the backend API
BASE_URL = "http://localhost:8000"

# Test registration
def test_registration():
    print("Testing user registration...")

    registration_data = {
        "name": "Fresh Test User",
        "email": "fresh@test.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_data)
        print(f"Registration response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(f"[SUCCESS] Registration successful!")
            print(f"User ID: {result['user']['id']}")
            print(f"User Email: {result['user']['email']}")
            return result
        else:
            print(f"[ERROR] Registration failed: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Error during registration: {str(e)}")
        return None

# Test login with the fresh user
def test_login():
    print("\nTesting user login...")

    login_data = {
        "email": "fresh@test.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("[SUCCESS] Login successful!")
            print(f"User ID: {result['user']['id']}")
            print(f"User Email: {result['user']['email']}")
            return result
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Error during login: {str(e)}")
        return None

# Test getting current user info
def test_get_current_user():
    print("\nTesting get current user...")

    # First, register or login to get a token
    login_data = {
        "email": "fresh@test.com",
        "password": "testpassword123"
    }

    try:
        # Login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if login_response.status_code != 200:
            print("[ERROR] Could not login to test current user endpoint")
            return None

        token = login_response.json()["access_token"]

        # Use token to get user info
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)

        print(f"Get current user response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("[SUCCESS] Current user info retrieved!")
            print(f"User ID: {result['id']}")
            print(f"User Email: {result['email']}")
            print(f"User Name: {result['name']}")
            return result
        else:
            print(f"[ERROR] Failed to get current user: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Error during get current user: {str(e)}")
        return None

if __name__ == "__main__":
    print("Testing backend API endpoints...")
    print(f"Connecting to: {BASE_URL}")

    # Test registration
    reg_result = test_registration()

    # Test login
    login_result = test_login()

    # Test get current user
    user_info = test_get_current_user()