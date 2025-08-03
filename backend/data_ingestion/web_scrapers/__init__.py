"""
Web scrapers for collecting data from various government websites.
"""

from .profile_image_scraper import ProfileImageScraper
from .selenium_web_scraper import SeleniumWebScraper
from .senate_desk_scraper import SenateDeskScraper

__all__ = ["SeleniumWebScraper", "SenateDeskScraper", "ProfileImageScraper"]
