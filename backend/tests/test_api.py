"""
Live API tests for Civiliscope backend.
Tests the running application to ensure endpoints work correctly.
Run these tests against your running Docker container.
"""

import json
import os

import pytest
import requests

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
                (
                    legislator
                    for legislator in legislators
                    if legislator.get("bioguide_id")
                ),
                None,
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

            legislators_with_bioguide = [
                legislator
                for legislator in legislators
                if legislator.get("bioguide_id")
            ]

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


class TestCongressAPI:
    """Test congress-related endpoints from Congress.gov API integration."""

    def test_get_current_congress(self):
        """Test GET /api/congress/current returns current congress information."""
        response = requests.get(f"{BASE_URL}/api/congress/current", timeout=TIMEOUT)

        assert response.status_code == 200
        data = response.json()

        # Should follow Congress.gov API response structure
        assert "congress" in data
        assert "request" in data

        congress = data["congress"]
        request = data["request"]

        # Validate request structure
        assert "contentType" in request
        assert "format" in request
        assert request["contentType"] == "application/json"
        assert request["format"] == "json"

        # Validate core congress fields
        required_fields = [
            "number",
            "name",
            "startYear",
            "endYear",
            "url",
            "updateDate",
        ]
        for field in required_fields:
            assert field in congress, f"Missing required field: {field}"

        # Validate data types
        assert isinstance(congress["number"], int)
        assert isinstance(congress["startYear"], int)
        assert isinstance(congress["endYear"], int)
        assert congress["number"] > 0, "Congress number should be positive"
        assert congress["startYear"] > 1700, "Start year should be realistic"
        assert congress["endYear"] > congress["startYear"], (
            "End year should be after start year"
        )

        # Validate URL format
        assert congress["url"].startswith("https://api.congress.gov/"), (
            "URL should be from Congress.gov API"
        )

        # Validate name format (should be like "118th Congress (2023-2025)")
        assert str(congress["number"]) in congress["name"], (
            "Congress name should contain number"
        )
        assert str(congress["startYear"]) in congress["name"], (
            "Congress name should contain start year"
        )
        assert str(congress["endYear"]) in congress["name"], (
            "Congress name should contain end year"
        )

    def test_current_congress_session_structure(self):
        """Test that current congress response includes sessions data."""
        response = requests.get(f"{BASE_URL}/api/congress/current", timeout=TIMEOUT)

        if response.status_code == 200:
            data = response.json()
            congress = data["congress"]

            # Sessions should be present
            assert "sessions" in congress
            sessions = congress["sessions"]

            # Should have count and url
            assert "count" in sessions
            assert "url" in sessions
            assert isinstance(sessions["count"], int)
            assert sessions["count"] >= 0
            assert sessions["url"].startswith("https://api.congress.gov/")

    def test_current_congress_data_consistency(self):
        """Test that current congress data is internally consistent."""
        response = requests.get(f"{BASE_URL}/api/congress/current", timeout=TIMEOUT)

        if response.status_code == 200:
            data = response.json()
            congress = data["congress"]

            # The congress number should match expected pattern for current time
            current_year = 2025  # Based on environment date
            expected_congress_min = (
                ((current_year - 1789) // 2) + 1 - 2
            )  # Allow some variance
            expected_congress_max = ((current_year - 1789) // 2) + 1 + 2

            assert (
                expected_congress_min <= congress["number"] <= expected_congress_max
            ), (
                f"Congress number {congress['number']} seems unrealistic for year {current_year}"
            )

            # Start and end years should make sense for the congress number
            expected_start_year = 1789 + (congress["number"] - 1) * 2
            assert abs(congress["startYear"] - expected_start_year) <= 1, (
                f"Start year {congress['startYear']} doesn't match congress number {congress['number']}"
            )

    def test_current_congress_error_handling(self):
        """Test error handling when Congress API is unavailable."""
        # This test assumes the API might return a 404 or 500 in some cases
        response = requests.get(f"{BASE_URL}/api/congress/current", timeout=TIMEOUT)

        if response.status_code == 404:
            error_data = response.json()
            assert "error" in error_data
            assert (
                "current congress information not available"
                in error_data["error"].lower()
            )
        elif response.status_code == 200:
            # If successful, validate the structure (redundant with other tests but ensures consistency)
            data = response.json()
            assert "congress" in data
        else:
            # Any other status code should still return valid JSON
            try:
                json.loads(response.text)
            except json.JSONDecodeError:
                pytest.fail(f"Invalid JSON response for status {response.status_code}")


class TestBillsAPI:
    """Test bills-related endpoints from Congress.gov API integration."""

    def test_get_bills_for_current_congress(self):
        """Test GET /api/congress/bills returns bills for current congress."""
        response = requests.get(f"{BASE_URL}/api/congress/bills", timeout=TIMEOUT)

        # Should return 200 if Congress API is working, or 404 if unavailable
        assert response.status_code in [200, 404], (
            f"Unexpected status code: {response.status_code}"
        )

        if response.status_code == 200:
            data = response.json()

            # Should follow Congress.gov API response structure
            assert "bills" in data
            assert "request" in data
            assert "pagination" in data

            bills = data["bills"]
            request = data["request"]
            pagination = data["pagination"]

            # Validate request structure
            assert "contentType" in request
            assert "format" in request
            assert request["contentType"] == "application/json"
            assert request["format"] == "json"

            # Validate pagination structure
            assert "count" in pagination
            assert isinstance(pagination["count"], int)
            assert pagination["count"] >= 0

            # If we have bills, validate structure
            if bills:
                bill = bills[0]
                required_fields = [
                    "congress",
                    "number",
                    "type",
                    "title",
                    "latestAction",
                    "url",
                    "updateDate",
                ]
                for field in required_fields:
                    assert field in bill, f"Missing required field: {field}"

                # Validate data types
                assert isinstance(bill["congress"], int)
                assert isinstance(bill["number"], int)
                assert bill["congress"] > 0
                assert bill["number"] > 0
                assert bill["type"] in [
                    "hr",
                    "s",
                    "hjres",
                    "sjres",
                    "hconres",
                    "sconres",
                    "hres",
                    "sres",
                ]

                # Validate latest action structure
                latest_action = bill["latestAction"]
                assert "actionDate" in latest_action
                assert "text" in latest_action

        elif response.status_code == 404:
            error_data = response.json()
            assert "error" in error_data
            assert "bills information not available" in error_data["error"].lower()

    def test_get_bill_actions_existing_bill(self):
        """Test GET /api/congress/bills/{congress}/{bill_type}/{bill_number}/actions for existing bill."""
        # Use a known bill - HR 1 from recent congress (these bills usually exist)
        congress = 118  # Current congress as of 2025
        bill_type = "hr"
        bill_number = 1

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/{congress}/{bill_type}/{bill_number}/actions",
            timeout=TIMEOUT,
        )

        # Should return 200 if bill exists and API is working, or 404 if not found/unavailable
        assert response.status_code in [200, 404], (
            f"Unexpected status code: {response.status_code}"
        )

        if response.status_code == 200:
            data = response.json()

            # Should follow Congress.gov API response structure
            assert "actions" in data
            assert "request" in data
            assert "pagination" in data

            actions = data["actions"]
            request = data["request"]
            pagination = data["pagination"]

            # Validate request structure
            assert "contentType" in request
            assert "format" in request
            assert "congress" in request
            assert "billType" in request
            assert "billNumber" in request
            assert request["congress"] == str(congress)
            assert request["billType"] == bill_type
            assert request["billNumber"] == str(bill_number)

            # Validate pagination structure
            assert "count" in pagination
            assert isinstance(pagination["count"], int)
            assert pagination["count"] >= 0

            # If we have actions, validate structure
            if actions:
                action = actions[0]
                required_fields = ["actionDate", "text", "type"]
                for field in required_fields:
                    assert field in action, f"Missing required field: {field}"

                # Validate action date format (should be YYYY-MM-DD)
                action_date = action["actionDate"]
                assert len(action_date) == 10, f"Invalid date format: {action_date}"
                assert action_date[4] == "-" and action_date[7] == "-", (
                    f"Invalid date format: {action_date}"
                )

        elif response.status_code == 404:
            error_data = response.json()
            assert "error" in error_data

    def test_get_bill_actions_invalid_bill_type(self):
        """Test GET /api/congress/bills/{congress}/{bill_type}/{bill_number}/actions with invalid bill type."""
        congress = 118
        invalid_bill_type = "invalid"
        bill_number = 1

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/{congress}/{invalid_bill_type}/{bill_number}/actions",
            timeout=TIMEOUT,
        )

        assert response.status_code == 400
        error_data = response.json()
        assert "error" in error_data
        assert "invalid bill type" in error_data["error"].lower()
        assert "valid types are" in error_data["error"].lower()

    def test_get_bill_actions_invalid_congress(self):
        """Test GET /api/congress/bills/{congress}/{bill_type}/{bill_number}/actions with invalid congress."""
        invalid_congress = 0  # Invalid congress number
        bill_type = "hr"
        bill_number = 1

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/{invalid_congress}/{bill_type}/{bill_number}/actions",
            timeout=TIMEOUT,
        )

        assert response.status_code == 400
        error_data = response.json()
        assert "error" in error_data
        assert "invalid congress number" in error_data["error"].lower()

    def test_get_bill_actions_invalid_bill_number(self):
        """Test GET /api/congress/bills/{congress}/{bill_type}/{bill_number}/actions with invalid bill number."""
        congress = 118
        bill_type = "hr"
        invalid_bill_number = 0  # Invalid bill number

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/{congress}/{bill_type}/{invalid_bill_number}/actions",
            timeout=TIMEOUT,
        )

        assert response.status_code == 400
        error_data = response.json()
        assert "error" in error_data
        assert "invalid bill number" in error_data["error"].lower()

    def test_get_bill_actions_nonexistent_bill(self):
        """Test GET /api/congress/bills/{congress}/{bill_type}/{bill_number}/actions for non-existent bill."""
        congress = 118
        bill_type = "hr"
        bill_number = 999999  # Unlikely to exist

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/{congress}/{bill_type}/{bill_number}/actions",
            timeout=TIMEOUT,
        )

        # Should return 404 for non-existent bill
        assert response.status_code == 404
        error_data = response.json()
        assert "error" in error_data
        assert "actions not available" in error_data["error"].lower()

    def test_bills_api_response_consistency(self):
        """Test that bills API responses are internally consistent."""
        response = requests.get(f"{BASE_URL}/api/congress/bills", timeout=TIMEOUT)

        if response.status_code == 200:
            data = response.json()
            bills = data.get("bills", [])
            pagination = data.get("pagination", {})

            # If we have bills, check consistency with pagination
            if bills:
                actual_count = len(bills)
                # Pagination count might be total count, not just current page
                # So we just check it's not negative and not unreasonably small
                assert pagination.get("count", 0) >= 0
                assert actual_count > 0, (
                    "Should have at least one bill if bills array is not empty"
                )

                # All bills should have the same congress number (current congress)
                congress_numbers = {bill["congress"] for bill in bills}
                assert len(congress_numbers) == 1, (
                    f"All bills should be from same congress, found: {congress_numbers}"
                )

    def test_bill_types_validation(self):
        """Test that all valid bill types are accepted."""
        congress = 118
        bill_number = 1
        valid_bill_types = [
            "hr",
            "s",
            "hjres",
            "sjres",
            "hconres",
            "sconres",
            "hres",
            "sres",
        ]

        for bill_type in valid_bill_types:
            response = requests.get(
                f"{BASE_URL}/api/congress/bills/{congress}/{bill_type}/{bill_number}/actions",
                timeout=TIMEOUT,
            )

            # Should not return 400 (bad request) for valid bill types
            # May return 404 if bill doesn't exist, but that's okay
            assert response.status_code != 400, (
                f"Valid bill type '{bill_type}' was rejected"
            )

            if response.status_code not in [200, 404]:
                pytest.fail(
                    f"Unexpected status {response.status_code} for bill type '{bill_type}'"
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
        requests.get(f"{BASE_URL}/api/senators/", timeout=TIMEOUT)
        end_time = time.time()

        response_time = end_time - start_time
        assert response_time < 2.0, f"API response too slow: {response_time:.2f}s"

    def test_json_response_validity(self):
        """Test that all endpoints return valid JSON."""
        endpoints = [
            "/api/senators/",
            "/api/representatives/",
            "/api/congress/current",
            "/api/congress/bills",
        ]

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

        # Test bill actions endpoint with placeholder values (should return valid JSON even for 404/400)
        response = requests.get(
            f"{BASE_URL}/api/congress/bills/118/hr/999999/actions", timeout=TIMEOUT
        )
        try:
            json.loads(response.text)
        except json.JSONDecodeError:
            pytest.fail(
                "Invalid JSON response from /api/congress/bills/actions endpoint"
            )


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

        response = requests.get(f"{BASE_URL}/api/congress/current", timeout=5)
        if response.status_code == 200:
            congress = response.json()
            congress_info = congress.get("congress", {})
            congress_number = congress_info.get("number", "unknown")
            print(f"✓ Current Congress: {congress_number}")
        else:
            print(f"⚠ Congress API status: {response.status_code}")

        response = requests.get(f"{BASE_URL}/api/congress/bills", timeout=5)
        if response.status_code == 200:
            bills = response.json()
            bills_count = bills.get("pagination", {}).get("count", "unknown")
            print(f"✓ Bills API working (count: {bills_count})")
        else:
            print(f"⚠ Bills API status: {response.status_code}")

        response = requests.get(
            f"{BASE_URL}/api/congress/bills/118/hr/1/actions", timeout=5
        )
        if response.status_code == 200:
            actions = response.json()
            actions_count = actions.get("pagination", {}).get("count", "unknown")
            print(f"✓ Bill Actions API working (HR1 actions: {actions_count})")
        elif response.status_code == 404:
            print("✓ Bill Actions API working (HR1 not found, but API responsive)")
        else:
            print(f"⚠ Bill Actions API status: {response.status_code}")

        print("\nRun 'pytest tests/test_api.py' for full test suite")

    except Exception as e:
        print(f"✗ API health check failed: {e}")
        print(f"Make sure your app is running at {BASE_URL}")
