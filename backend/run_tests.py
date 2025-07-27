#!/usr/bin/env python3
"""
Simple test runner for API tests.
Runs tests against your running Civiliscope backend.
"""

import subprocess
import sys
import requests
import time

BASE_URL = "http://localhost:5000"


def check_api_health():
    """Check if the API is running before tests."""
    print("Checking API health...")
    try:
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=5)
        if response.status_code == 200:
            print("✓ API is running and responsive")
            return True
        else:
            print(f"⚠ API returned status {response.status_code}")
            return True  # Still try to run tests
    except requests.exceptions.ConnectionError:
        print(f"✗ Cannot connect to API at {BASE_URL}")
        print("Make sure your Flask app is running on localhost:5000")
        return False
    except Exception as e:
        print(f"✗ Error checking API: {e}")
        return False


def run_tests(test_type="all"):
    """Run the specified tests."""
    if not check_api_health():
        return False

    print(f"\nRunning {test_type} tests...")

    # Build pytest command
    cmd = ["python", "-m", "pytest", "tests/test_api.py", "-v"]

    if test_type == "quick":
        # Run only health checks
        cmd.extend(["-k", "test_api"])
    elif test_type == "senators":
        # Run only senator tests
        cmd.extend(["-k", "TestSenatorAPI"])
    elif test_type == "representatives":
        # Run only representative tests
        cmd.extend(["-k", "TestRepresentativeAPI"])
    elif test_type == "health":
        # Run only health tests
        cmd.extend(["-k", "TestAPIHealth"])

    try:
        result = subprocess.run(cmd, capture_output=False)
        return result.returncode == 0
    except FileNotFoundError:
        print("pytest not found. Install with: pip install pytest requests")
        return False


def main():
    """Main test runner."""
    if len(sys.argv) > 1:
        test_type = sys.argv[1]
    else:
        test_type = "all"

    valid_types = ["all", "quick", "senators", "representatives", "health"]
    if test_type not in valid_types:
        print(f"Usage: python run_tests.py [{'/'.join(valid_types)}]")
        sys.exit(1)

    print("=" * 50)
    print("Civiliscope API Tests")
    print("=" * 50)

    success = run_tests(test_type)

    if success:
        print("\n✓ All tests passed!")
        sys.exit(0)
    else:
        print("\n✗ Some tests failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
