"""
Congress.gov API client for fetching member data and creating bioguide-to-image-url mappings.
"""

import requests
import os
import json
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class CongressAPI:
    """Client for interacting with the Congress.gov API."""
    
    BASE_URL = "https://api.congress.gov/v3"
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Congress API client.
        
        Args:
            api_key: Congress.gov API key. If not provided, will look for CONGRESS_API_KEY env var.
        """
        self.api_key = api_key or os.getenv('CONGRESS_API_KEY')
        if not self.api_key:
            raise ValueError("Congress.gov API key is required. Set CONGRESS_API_KEY environment variable.")
        
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-Key': self.api_key,
            'Content-Type': 'application/json'
        })
    
    def get_current_members(self, chamber: Optional[str] = None) -> List[Dict]:
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
                'format': 'json',
                'limit': limit,
                'offset': offset,
                'currentMember': 'true'
            }
            
            if chamber:
                params['chamber'] = chamber
            
            try:
                response = self.session.get(f"{self.BASE_URL}/member", params=params)
                response.raise_for_status()
                
                data = response.json()
                batch_members = data.get('members', [])
                
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
    
    def create_bioguide_to_image_url_dict(self, save_to_file: bool = True, 
                                        filepath: Optional[str] = None) -> Dict[str, str]:
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
            bioguide_id = member.get('bioguideId')
            image_url = member.get('depiction', {}).get('imageUrl')
            
            if bioguide_id and image_url:
                bioguide_to_url[bioguide_id] = image_url
        
        logger.info(f"Created bioguide-to-image mapping for {len(bioguide_to_url)} members")
        
        if save_to_file:
            if not filepath:
                filepath = os.path.join(
                    os.path.dirname(__file__), 
                    '..', 
                    'data_ingestion', 
                    'congress_member_images.json'
                )
            
            try:
                with open(filepath, 'w') as f:
                    json.dump(bioguide_to_url, f, indent=2)
                logger.info(f"Saved bioguide-to-image mapping to {filepath}")
            except Exception as e:
                logger.error(f"Error saving mapping to file: {e}")
        
        return bioguide_to_url


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