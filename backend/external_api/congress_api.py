"""
Congress.gov API client
"""

import json
import logging
import os

import requests

logger = logging.getLogger(__name__)


class CongressAPI:
    """Client for interacting with the Congress.gov API."""

    BASE_URL = "https://api.congress.gov/v3"

    def __init__(self, api_key: str | None = None):
        """
        Initialize the Congress API client.

        Args:
            api_key: Congress.gov API key. If not provided, will look for CONGRESS_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("CONGRESS_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Congress.gov API key is required. Set CONGRESS_API_KEY environment variable."
            )

        self.session = requests.Session()
        self.session.headers.update(
            {"X-API-Key": self.api_key, "Content-Type": "application/json"}
        )

    def get_current_members(self, chamber: str | None = None) -> list[dict]:
        """
        Fetch all current congressional members.

        Args:
            chamber: Optional chamber filter ('house' or 'senate'). If None, gets both.

        Returns:
            List of member dictionaries with bioguide IDs and image URLs.
        """
        members = []
        offset = 0
        limit = 250  # Max allowed by API

        while True:
            params = {
                "format": "json",
                "limit": limit,
                "offset": offset,
                "currentMember": "true",
            }

            if chamber:
                params["chamber"] = chamber

            try:
                response = self.session.get(f"{self.BASE_URL}/member", params=params)
                response.raise_for_status()

                data = response.json()
                batch_members = data.get("members", [])

                if not batch_members:
                    break

                members.extend(batch_members)

                # Check if we've got all members
                if len(batch_members) < limit:
                    break

                offset += limit

            except requests.RequestException as e:
                logger.error(f"Error fetching members: {e}")
                break

        logger.info(f"Fetched {len(members)} current members from Congress.gov API")
        return members

    def create_bioguide_to_image_url_dict(
        self, save_to_file: bool = True, filepath: str | None = None
    ) -> dict[str, str]:
        """
        Create a dictionary mapping bioguide IDs to image URLs from Congress.gov API.

        Args:
            save_to_file: Whether to save the mapping to a JSON file.
            filepath: Optional custom filepath for saving. Defaults to 'congress_member_images.json'.

        Returns:
            Dictionary mapping bioguide ID to image URL.
        """
        members = self.get_current_members()
        bioguide_to_url = {}

        for member in members:
            bioguide_id = member.get("bioguideId")
            image_url = member.get("depiction", {}).get("imageUrl")

            if bioguide_id and image_url:
                bioguide_to_url[bioguide_id] = image_url

        logger.info(
            f"Created bioguide-to-image mapping for {len(bioguide_to_url)} members"
        )

        if save_to_file:
            if not filepath:
                filepath = os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "data_ingestion",
                    "congress_member_images.json",
                )

            try:
                with open(filepath, "w") as f:
                    json.dump(bioguide_to_url, f, indent=2)
                logger.info(f"Saved bioguide-to-image mapping to {filepath}")
            except Exception as e:
                logger.error(f"Error saving mapping to file: {e}")

        return bioguide_to_url

    def get_member(self, bioguide_id: str) -> dict | None:
        """
        Get specific member information by bioguide ID.

        Args:
            bioguide_id: The bioguide ID of the member to fetch.

        Returns:
            Full JSON response from API, or None if not found.
        """
        try:
            response = self.session.get(f"{self.BASE_URL}/member/{bioguide_id}")
            response.raise_for_status()

            data = response.json()

            if data.get("member"):
                logger.info(f"Fetched member details for bioguide ID: {bioguide_id}")
            else:
                logger.warning(f"No member found for bioguide ID: {bioguide_id}")

            return data

        except requests.RequestException as e:
            logger.error(f"Error fetching member {bioguide_id}: {e}")
            return None

    def get_current_congress(self) -> dict | None:
        """
        Get information about the current Congress.

        Returns:
            Full JSON response from API containing current congress information, or None if error.
        """
        try:
            response = self.session.get(f"{self.BASE_URL}/congress/current")
            response.raise_for_status()

            data = response.json()

            if data.get("congress"):
                logger.info(
                    f"Fetched current congress information: Congress {data['congress'].get('number', 'unknown')}"
                )
            else:
                logger.warning("No current congress information found in API response")

            return data

        except requests.RequestException as e:
            logger.error(f"Error fetching current congress information: {e}")
            return None

    def get_bills_for_congress(
        self, congress_number: int, limit: int | None = None, offset: int | None = None
    ) -> dict | None:
        """
        Get bills for a specific congress.

        Args:
            congress_number: The congress number to fetch bills for.
            limit: Optional maximum number of bills to return.
            offset: Optional offset for pagination.

        Returns:
            Full JSON response from API containing bills for the congress, or None if error.
        """
        try:
            params = {"format": "json"}

            if limit is not None:
                params["limit"] = limit
            if offset is not None:
                params["offset"] = offset

            response = self.session.get(
                f"{self.BASE_URL}/bill/{congress_number}", params=params
            )
            response.raise_for_status()

            data = response.json()

            if data.get("bills"):
                logger.info(
                    f"Fetched {len(data['bills'])} bills for Congress {congress_number}"
                )
            else:
                logger.warning(f"No bills found for Congress {congress_number}")

            return data

        except requests.RequestException as e:
            logger.error(f"Error fetching bills for Congress {congress_number}: {e}")
            return None

    def get_bill_actions(
        self, congress: int, bill_type: str, bill_number: int
    ) -> dict | None:
        """
        Get actions for a specific bill.

        Args:
            congress: The congress number.
            bill_type: The type of bill (e.g., 'hr', 's', 'hjres', 'sjres').
            bill_number: The bill number.

        Returns:
            Full JSON response from API containing bill actions, or None if error.
        """
        try:
            params = {"format": "json"}

            response = self.session.get(
                f"{self.BASE_URL}/bill/{congress}/{bill_type}/{bill_number}/actions",
                params=params,
            )
            response.raise_for_status()

            data = response.json()

            if data.get("actions"):
                logger.info(
                    f"Fetched {len(data['actions'])} actions for bill {bill_type.upper()}{bill_number} (Congress {congress})"
                )
            else:
                logger.warning(
                    f"No actions found for bill {bill_type.upper()}{bill_number} (Congress {congress})"
                )

            return data

        except requests.RequestException as e:
            logger.error(
                f"Error fetching actions for bill {bill_type.upper()}{bill_number} (Congress {congress}): {e}"
            )
            return None
