"""
Live API tests for Civiliscope backend.
Tests the running application to ensure endpoints work correctly.
Run these tests against your running Docker container.
"""

import requests
import pytest
import json

# Configuration
BASE_URL = "http://localhost:5000"
TIMEOUT = 10


class TestSenatorAPI:
    """Test senator-related endpoints."""

    def test_get_all_senators(self):
        """Test GET /api/senators/ returns a list of senators."""
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

        # If we have senators, validate structure
        if data:
            senator = data[0]
            required_fields = ["id", "name", "state", "party"]
            for field in required_fields:
                assert field in senator, f"Missing field: {field}"

    def test_get_senator_by_id_existing(self):
        """Test GET /api/senators/<id> for existing senator."""
        # First get all senators to find a valid ID
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
        senators = response.json()

        if senators:
            senator_id = senators[0]["id"]
            response = requests.get(
                f"{BASE_URL}/api/senators/{senator_id}", timeout=TIMEOUT
            )

            assert response.status_code == 200
            senator = response.json()
            assert senator["id"] == senator_id

            # Validate detailed fields
            required_fields = ["id", "name", "state", "party"]
            for field in required_fields:
                assert field in senator

    def test_get_senator_by_id_nonexistent(self):
        """Test GET /api/senators/<id> for non-existent senator."""
        response = requests.get(f"{BASE_URL}/api/senators/99999", timeout=TIMEOUT)
        assert response.status_code == 404

    def test_senators_data_quality(self):
        """Test data quality of senator records."""
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
        senators = response.json()

        for senator in senators:
            # Name should not be empty
            assert senator["name"].strip(), f"Empty name for senator ID {senator['id']}"

            # State should be 2-letter code
            assert len(senator["state"]) == 2, f"Invalid state code: {senator['state']}"
            assert senator["state"].isupper(), (
                f"State should be uppercase: {senator['state']}"
            )

            # Party should not be empty
            assert senator["party"].strip(), (
                f"Empty party for senator ID {senator['id']}"
            )

            # Photo URL should be valid if present
            if "photo_url" in senator and senator["photo_url"]:
                photo_url = senator["photo_url"]
                assert photo_url.startswith("https://"), (
                    f"Photo URL should use HTTPS: {photo_url}"
                )
                assert "bioguide.congress.gov" in photo_url, (
                    f"Photo URL should be from bioguide.congress.gov: {photo_url}"
                )


class TestRepresentativeAPI:
    """Test representative-related endpoints."""

    def test_get_all_representatives(self):
        """Test GET /api/representatives/ returns a list of representatives."""
        response = requests.get(f"{BASE_URL}/api/representatives/", timeout=TIMEOUT)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

        # If we have representatives, validate structure
        if data:
            rep = data[0]
            required_fields = ["id", "name", "state", "district", "party"]
            for field in required_fields:
                assert field in rep, f"Missing field: {field}"

    def test_get_representative_by_id_existing(self):
        """Test GET /api/representatives/<id> for existing representative."""
        # First get all representatives to find a valid ID
        response = requests.get(f"{BASE_URL}/api/representatives/", timeout=TIMEOUT)
        reps = response.json()

        if reps:
            rep_id = reps[0]["id"]
            response = requests.get(
                f"{BASE_URL}/api/representatives/{rep_id}", timeout=TIMEOUT
            )

            assert response.status_code == 200
            rep = response.json()
            assert rep["id"] == rep_id

            # Validate detailed fields
            required_fields = ["id", "name", "state", "district", "party"]
            for field in required_fields:
                assert field in rep

    def test_get_representative_by_id_nonexistent(self):
        """Test GET /api/representatives/<id> for non-existent representative."""
        response = requests.get(
            f"{BASE_URL}/api/representatives/99999", timeout=TIMEOUT
        )
        assert response.status_code == 404

    def test_representatives_data_quality(self):
        """Test data quality of representative records."""
        response = requests.get(f"{BASE_URL}/api/representatives/", timeout=TIMEOUT)
        reps = response.json()

        for rep in reps:
            # Name should not be empty
            assert rep["name"].strip(), f"Empty name for rep ID {rep['id']}"

            # State should be 2-letter code
            assert len(rep["state"]) == 2, f"Invalid state code: {rep['state']}"
            assert rep["state"].isupper(), f"State should be uppercase: {rep['state']}"

            # District should be positive integer
            assert isinstance(rep["district"], int), (
                f"District should be integer: {rep['district']}"
            )
            assert rep["district"] >= 0, (
                f"District should be positive: {rep['district']}"
            )

            # Party should not be empty
            assert rep["party"].strip(), f"Empty party for rep ID {rep['id']}"

            # Photo URL should be valid if present
            if "photo_url" in rep and rep["photo_url"]:
                photo_url = rep["photo_url"]
                assert photo_url.startswith("https://"), (
                    f"Photo URL should use HTTPS: {photo_url}"
                )
                assert "bioguide.congress.gov" in photo_url, (
                    f"Photo URL should be from bioguide.congress.gov: {photo_url}"
                )


class TestAPIHealth:
    """General API health and connectivity tests."""

    def test_api_connectivity(self):
        """Test basic API connectivity."""
        try:
            response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
            assert response.status_code in [200, 404, 500], "API is unreachable"
        except requests.exceptions.ConnectionError:
            pytest.fail(f"Cannot connect to API at {BASE_URL}")

    def test_response_headers(self):
        """Test API response headers."""
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)

        # Should return JSON
        assert "application/json" in response.headers.get("content-type", "")

        # Should have CORS headers (if configured)
        if "access-control-allow-origin" in response.headers:
            assert response.headers["access-control-allow-origin"] is not None

    def test_api_response_time(self):
        """Test API response time is reasonable."""
        import time

        start_time = time.time()
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
        end_time = time.time()

        response_time = end_time - start_time
        assert response_time < 2.0, f"API response too slow: {response_time:.2f}s"

    def test_json_response_validity(self):
        """Test that all endpoints return valid JSON."""
        endpoints = ["/api/senators/", "/api/representatives/"]

        for endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=TIMEOUT)

            # Should return valid JSON
            try:
                json.loads(response.text)
            except json.JSONDecodeError:
                pytest.fail(f"Invalid JSON response from {endpoint}")


if __name__ == "__main__":
    # Quick smoke test
    print("Running quick API health check...")

    try:
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=5)
        print(f"✓ API reachable (status: {response.status_code})")

        senators = response.json()
        print(f"✓ Found {len(senators)} senators")

        response = requests.get(f"{BASE_URL}/api/representatives/", timeout=5)
        reps = response.json()
        print(f"✓ Found {len(reps)} representatives")

        print("\nRun 'pytest tests/test_api.py' for full test suite")

    except Exception as e:
        print(f"✗ API health check failed: {e}")
        print(f"Make sure your app is running at {BASE_URL}")
