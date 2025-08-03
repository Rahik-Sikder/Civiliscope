"""
Services related to CongressAPI
"""

import logging

from .congress_api import CongressAPI

logger = logging.getLogger(__name__)
api = CongressAPI()


def get_member_image_urls(save_json: bool = True) -> dict[str, str]:
    """
    Convenience function to get bioguide-to-image-url mapping.

    Args:
        save_json: Whether to save the result to a JSON file.

    Returns:
        Dictionary mapping bioguide ID to image URL.
    """
    try:
        return api.create_bioguide_to_image_url_dict(save_to_file=save_json)
    except Exception as e:
        logger.error(f"Error getting member image URLs: {e}")
        return {}


def get_member_details(bioguide_id: str) -> dict | None:
    """
    Get detailed information for a specific member by bioguide ID.

    Args:
        bioguide_id: The bioguide ID of the member to fetch.

    Returns:
        Full JSON response from Congress.gov API, or None if not found.
    """
    try:
        return api.get_member(bioguide_id)
    except Exception as e:
        logger.error(f"Error getting member details for {bioguide_id}: {e}")
        return None


def get_current_congress() -> dict | None:
    """
    Get information about the current Congress.

    Returns:
        Full JSON response from Congress.gov API containing current congress information, or None if not found.
    """
    try:
        return api.get_current_congress()
    except Exception as e:
        logger.error(f"Error getting current congress information: {e}")
        return None


def get_bills_for_current_congress() -> dict | None:
    """
    Get bills for the current Congress.

    Returns:
        Full JSON response from Congress.gov API containing bills for the current congress, or None if not found.
    """
    try:
        # First get the current congress number
        current_congress_data = api.get_current_congress()
        if not current_congress_data or not current_congress_data.get("congress"):
            logger.error("Could not get current congress information")
            return None

        congress_number = current_congress_data["congress"]["number"]

        # Then get bills for that congress
        return api.get_bills_for_congress(congress_number)
    except Exception as e:
        logger.error(f"Error getting bills for current congress: {e}")
        return None


def get_bill_actions_service(
    congress: int, bill_type: str, bill_number: int
) -> dict | None:
    """
    Get actions for a specific bill.

    Args:
        congress: The congress number.
        bill_type: The type of bill (e.g., 'hr', 's', 'hjres', 'sjres').
        bill_number: The bill number.

    Returns:
        Full JSON response from Congress.gov API containing bill actions, or None if not found.
    """
    try:
        return api.get_bill_actions(congress, bill_type, bill_number)
    except Exception as e:
        logger.error(
            f"Error getting bill actions for {bill_type.upper()}{bill_number} (Congress {congress}): {e}"
        )
        return None
