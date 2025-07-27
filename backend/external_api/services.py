"""
Services related to CongressAPI
"""

from typing import Dict, Optional
from .congress_api import CongressAPI
import logging

logger = logging.getLogger(__name__)


def get_member_image_urls(save_json: bool = True) -> Dict[str, str]:
    """
    Convenience function to get bioguide-to-image-url mapping.

    Args:
        save_json: Whether to save the result to a JSON file.

    Returns:
        Dictionary mapping bioguide ID to image URL.
    """
    try:
        api = CongressAPI()
        return api.create_bioguide_to_image_url_dict(save_to_file=save_json)
    except Exception as e:
        logger.error(f"Error getting member image URLs: {e}")
        return {}


def get_member_details(bioguide_id: str) -> Optional[Dict]:
    """
    Get detailed information for a specific member by bioguide ID.

    Args:
        bioguide_id: The bioguide ID of the member to fetch.

    Returns:
        Full JSON response from Congress.gov API, or None if not found.
    """
    try:
        api = CongressAPI()
        return api.get_member(bioguide_id)
    except Exception as e:
        logger.error(f"Error getting member details for {bioguide_id}: {e}")
        return None
