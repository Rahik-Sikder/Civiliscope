"""
Extract photo URLs from database and save to JSON for caching.
This script reads existing photo URLs from the database and creates a JSON cache file.
"""

import json
import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app, db
from app.models import Senator, Representative


def extract_photo_urls_to_json():
    """
    Extract photo URLs from database and save to JSON file.
    Creates a mapping of bioguide ID to photo URL.
    """
    app = create_app()

    with app.app_context():
        photo_cache = {}

        # Get all senators
        senators = Senator.query.all()
        for senator in senators:
            if senator.photo_url:
                photo_cache[senator.id] = senator.photo_url

        # Get all representatives
        representatives = Representative.query.all()
        for rep in representatives:
            if rep.photo_url:
                photo_cache[rep.id] = rep.photo_url

        # Save to JSON file in data_ingestion directory
        data_ingestion_dir = os.path.join(backend_dir, "data_ingestion")
        cache_file = os.path.join(data_ingestion_dir, "photo_url_cache.json")

        with open(cache_file, "w") as f:
            json.dump(photo_cache, f, indent=2)

        print(f"Extracted {len(photo_cache)} photo URLs to {cache_file}")
        return photo_cache


if __name__ == "__main__":
    extract_photo_urls_to_json()
