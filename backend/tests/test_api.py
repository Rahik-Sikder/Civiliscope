"""
Live API tests for Civiliscope backend.
Tests the running application to ensure endpoints work correctly.
Run these tests against your running Docker container.
"""

import requests
import pytest
import json
import os

# Configuration
BASE_URL = os.getenv("BASE_URL")
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
                assert "congress.gov" in photo_url, (
                    f"Photo URL should be from congress.gov: {photo_url}"
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
                assert "congress.gov" in photo_url, (
                    f"Photo URL should be from congress.gov: {photo_url}"
                )


class TestMemberAPI:
    """Test member-related endpoints (Congress.gov API integration)."""

    def test_get_member_by_bioguide_existing(self):
        """Test GET /api/members/<bioguide_id> for existing member."""
        # First get a senator to find a valid bioguide_id
        response = requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
        senators = response.json()

        if senators and any(s.get("bioguide_id") for s in senators):
            # Find first senator with bioguide_id
            senator_with_bioguide = next(s for s in senators if s.get("bioguide_id"))
            bioguide_id = senator_with_bioguide["bioguide_id"]

            response = requests.get(
                f"{BASE_URL}/api/members/{bioguide_id}", timeout=TIMEOUT
            )

            assert response.status_code == 200
            data = response.json()

            # Should follow Congress.gov API response structure
            assert "member" in data
            assert "request" in data

            member = data["member"]
            request = data["request"]

            # Validate request structure
            assert "bioguideId" in request
            assert "contentType" in request
            assert "format" in request
            assert request["bioguideId"].lower() == bioguide_id.lower()

            # Validate core member fields
            required_fields = [
                "bioguideId",
                "directOrderName",
                "invertedOrderName",
                "firstName",
                "lastName",
                "honorificName",
                "state",
                "birthYear",
                "updateDate",
            ]
            for field in required_fields:
                assert field in member, f"Missing required field: {field}"

            # Validate bioguide ID matches
            assert member["bioguideId"] == bioguide_id

            # Validate arrays exist
            assert "terms" in member and isinstance(member["terms"], list)
            assert "partyHistory" in member and isinstance(member["partyHistory"], list)

            # Validate legislation objects
            assert "sponsoredLegislation" in member
            assert "cosponsoredLegislation" in member
            for leg_field in ["sponsoredLegislation", "cosponsoredLegislation"]:
                leg_obj = member[leg_field]
                assert "count" in leg_obj
                assert "url" in leg_obj
                assert isinstance(leg_obj["count"], int)

    def test_get_member_by_bioguide_nonexistent(self):
        """Test GET /api/members/<bioguide_id> for non-existent member."""
        fake_bioguide = "X999999"
        response = requests.get(
            f"{BASE_URL}/api/members/{fake_bioguide}", timeout=TIMEOUT
        )

        assert response.status_code == 404
        error_data = response.json()
        assert "error" in error_data

    def test_member_api_terms_structure(self):
        """Test that member API returns properly structured terms data."""
        # Get a valid bioguide_id from representatives if senators don't have any
        for endpoint in ["/api/senators/", "/api/representatives/"]:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=TIMEOUT)
            legislators = response.json()

            bioguide_member = next(
                (l for l in legislators if l.get("bioguide_id")), None
            )
            if bioguide_member:
                bioguide_id = bioguide_member["bioguide_id"]

                response = requests.get(
                    f"{BASE_URL}/api/members/{bioguide_id}", timeout=TIMEOUT
                )

                if response.status_code == 200:
                    data = response.json()
                    member = data["member"]

                    # Validate terms structure
                    if member["terms"]:
                        term = member["terms"][0]
                        term_required_fields = [
                            "chamber",
                            "congress",
                            "startYear",
                            "memberType",
                            "stateCode",
                            "stateName",
                        ]
                        # endYear is optional for current terms
                        for field in term_required_fields:
                            assert field in term, f"Missing term field: {field}"

                        # Validate term data types
                        assert isinstance(term["congress"], int)
                        assert isinstance(term["startYear"], int)
                        if "endYear" in term:
                            assert isinstance(term["endYear"], int)
                        assert term["chamber"] in ["House of Representatives", "Senate"]

                        # House members should have district
                        if term["chamber"] == "House of Representatives":
                            assert "district" in term

                    # Validate party history structure
                    if member["partyHistory"]:
                        party = member["partyHistory"][0]
                        party_required_fields = [
                            "partyAbbreviation",
                            "partyName",
                            "startYear",
                        ]
                        for field in party_required_fields:
                            assert field in party, f"Missing party field: {field}"

                        assert isinstance(party["startYear"], int)

                    break

    def test_member_api_data_consistency(self):
        """Test data consistency between local DB and Congress.gov API."""
        # Test with both senators and representatives
        for endpoint, chamber_name in [
            ("/api/senators/", "Senate"),
            ("/api/representatives/", "House of Representatives"),
        ]:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=TIMEOUT)
            legislators = response.json()

            legislators_with_bioguide = [l for l in legislators if l.get("bioguide_id")]

            if legislators_with_bioguide:
                legislator = legislators_with_bioguide[0]
                bioguide_id = legislator["bioguide_id"]

                # Get data from member API
                response = requests.get(
                    f"{BASE_URL}/api/members/{bioguide_id}", timeout=TIMEOUT
                )

                if response.status_code == 200:
                    member_data = response.json()["member"]

                    # Bioguide ID should match
                    assert member_data["bioguideId"] == bioguide_id

                    # State format differs - API returns full name, DB has abbreviation
                    # Just validate state field exists for now
                    assert "state" in member_data
                    assert member_data["state"]  # Not empty

                    # Check current term matches chamber
                    if member_data["terms"]:
                        # Find most recent term
                        recent_term = max(
                            member_data["terms"], key=lambda t: t["congress"]
                        )
                        assert recent_term["chamber"] == chamber_name
                        assert recent_term["stateCode"] == legislator["state"]

                    # For representatives, check district consistency
                    if endpoint == "/api/representatives/" and "district" in legislator:
                        current_term = max(
                            member_data["terms"], key=lambda t: t["congress"]
                        )
                        if "district" in current_term:
                            assert current_term["district"] == legislator["district"]

                break  # Test one from each chamber


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

        # Test member endpoint with a placeholder bioguide_id (should return valid JSON even for 404)
        response = requests.get(f"{BASE_URL}/api/members/X999999", timeout=TIMEOUT)
        try:
            json.loads(response.text)
        except json.JSONDecodeError:
            pytest.fail("Invalid JSON response from /api/members/ endpoint")


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
