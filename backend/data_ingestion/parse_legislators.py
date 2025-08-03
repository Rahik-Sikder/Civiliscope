import json
import os
from datetime import datetime

import yaml

from app import create_app, db
from app.models import Representative, Senator
from external_api.services import get_member_image_urls

from .web_scrapers import ProfileImageScraper, SenateDeskScraper

DATA_FILE = os.path.join(os.path.dirname(__file__), "congress/legislators-current.yaml")
PHOTO_CACHE_FILE = os.path.join(os.path.dirname(__file__), "photo_url_cache.json")

senate_scraper = SenateDeskScraper()
pfp_scraper = ProfileImageScraper()

# Global photo URL cache
_photo_cache = None


def load_yaml():
    with open(DATA_FILE) as f:
        return yaml.safe_load(f)


def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def load_photo_cache():
    """
    Load photo URL cache from JSON file.
    Returns empty dict if file doesn't exist.
    """
    global _photo_cache

    if _photo_cache is not None:
        return _photo_cache

    try:
        if os.path.exists(PHOTO_CACHE_FILE):
            with open(PHOTO_CACHE_FILE) as f:
                _photo_cache = json.load(f)
                print(f"Loaded {len(_photo_cache)} cached photo URLs")
        else:
            _photo_cache = {}
            print("No photo cache file found, starting with empty cache")
    except Exception as e:
        print(f"Error loading photo cache: {e}")
        _photo_cache = {}

    return _photo_cache


def save_photo_cache():
    """
    Save the current photo cache to JSON file.
    """
    global _photo_cache

    if _photo_cache is None:
        return

    try:
        with open(PHOTO_CACHE_FILE, "w") as f:
            json.dump(_photo_cache, f, indent=2)
        print(f"Saved {len(_photo_cache)} photo URLs to cache")
    except Exception as e:
        print(f"Error saving photo cache: {e}")


def ingest():
    app = create_app()
    with app.app_context():
        print("Clearing existing data...")
        Senator.query.delete()
        Representative.query.delete()
        db.session.commit()

        print("Loading YAML...")
        legislators = load_yaml()

        senator_seats = get_senate_seat_maps()
        print("Number of senator seats loaded: ", len(senator_seats))

        # Get dict of profile links
        profile_dict = get_member_image_urls()

        for leg in legislators:
            full_name = leg["name"]["official_full"]
            last_name = leg["name"]["last"]
            bioguide = leg["id"]["bioguide"]
            terms = leg["terms"]
            latest_term = terms[-1]

            # Get profile image URL using bioguide ID
            print(f"Getting profile image for {full_name} ({bioguide})")

            photo_url = None
            if bioguide in profile_dict:
                photo_url = profile_dict[bioguide]

            if latest_term["type"] == "sen":
                senator = Senator(
                    bioguide_id=bioguide,
                    full_name=full_name,
                    last_name=last_name,
                    state=latest_term["state"],
                    party=latest_term["party"],
                    photo_url=photo_url,
                    seat_number=senator_seats[full_name]["desk_value"],
                    term_start=parse_date(latest_term["start"]),
                    term_end=parse_date(latest_term["end"]),
                )
                db.session.add(senator)

            elif latest_term["type"] == "rep":
                rep = Representative(
                    bioguide_id=bioguide,
                    full_name=full_name,
                    last_name=last_name,
                    state=latest_term["state"],
                    district=int(latest_term["district"]),
                    party=latest_term["party"],
                    photo_url=photo_url,
                    term_start=parse_date(latest_term["start"]),
                    term_end=parse_date(latest_term["end"]),
                )
                db.session.add(rep)

        db.session.commit()

        # Save photo cache after ingestion
        save_photo_cache()

        # Clean up scrapers
        pfp_scraper.close()

        print("Ingestion complete.")


def get_senate_seat_maps():
    senators_data = {}
    try:
        senators_data = senate_scraper.scrape_senators_list()
        print(f"Successfully scraped {len(senators_data)} senators")

    except Exception as e:
        print(f"Scraping failed: {e}")
    finally:
        # Always clean up the driver
        senate_scraper.close()

    return senators_data


# Prior scraping code - will leave if needed later as fallback
def get_profile_image_url(bioguide):
    """
    Get profile image URL for a legislator using their bioguide ID.
    First checks cache, then falls back to scraping if not found.

    Args:
        bioguide: The bioguide ID

    Returns:
        Image URL if found, None otherwise
    """
    if not bioguide:
        return None

    # Load cache if not already loaded
    photo_cache = load_photo_cache()

    # Check cache first
    if bioguide in photo_cache:
        print(f"Found cached photo URL for {bioguide}")
        return photo_cache[bioguide]

    # Fall back to scraping
    print(f"No cached photo URL for {bioguide}, scraping...")
    try:
        image_url = pfp_scraper.get_profile_image_url(bioguide)

        # Cache the result for future use
        if image_url:
            photo_cache[bioguide] = image_url
            print(f"Cached new photo URL for {bioguide}")

        return image_url
    except Exception as e:
        print(f"Error getting profile image for {bioguide}: {e}")
        return None


if __name__ == "__main__":
    ingest()
