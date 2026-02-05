import requests
import json

# Test the backend API
BASE_URL = "http://localhost:8000"

# Test registration
def test_registration():
    print("Testing user registration...")

    registration_data = {
        "name": "Test User",
        "email": "test@register.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_data)
        print(f"Registration response status: {response.status_code}")
        print(f"Registration response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("[SUCCESS] Registration successful!")
            return response.json()
        else:
            print(f"[ERROR] Registration failed: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Error during registration: {str(e)}")
        return None

# Test login
def test_login():
    print("\nTesting user login...")

    login_data = {
        "email": "test@register.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login response status: {response.status_code}")

        if response.status_code == 200:
            print("[SUCCESS] Login successful!")
            return response.json()
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Error during login: {str(e)}")
        return None

if __name__ == "__main__":
    print("Testing backend API endpoints...")
    print(f"Connecting to: {BASE_URL}")

    # Test registration
    reg_result = test_registration()

    # Test login
    login_result = test_login()