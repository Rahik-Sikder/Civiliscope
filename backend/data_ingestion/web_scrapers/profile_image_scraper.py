"""
ARCHIVED: This scraper has been replaced by the Congress.gov API integration.

Scraper for extracting profile image URLs from the Biographical Directory of Congress.
The Congress.gov API now provides direct access to member images via the /member endpoint,
making this web scraping approach unnecessary. See backend/external_api/congress_api.py instead.
"""

from selenium.webdriver.common.by import By
from typing import Optional
import time
from .selenium_web_scraper import SeleniumWebScraper


class ProfileImageScraper(SeleniumWebScraper):
    """
    Specialized scraper for extracting profile image URLs from bioguide.congress.gov
    """

    BASE_URL = "https://bioguide.congress.gov/search/bio/"

    def __init__(self, headless: bool = True, delay: float = 1.0, timeout: int = 30):
        """Initialize the profile image scraper with appropriate settings."""
        super().__init__(headless=headless, delay=delay, timeout=timeout)

    def get_profile_image_url(self, bioguide: str) -> Optional[str]:
        """
        Extract the profile image URL for a legislator given their bioguide ID.

        Args:
            bioguide: The bioguide ID (e.g., "J000299")

        Returns:
            Image URL if found, None otherwise
        """
        if not bioguide:
            self.logger.warning("Empty bioguide ID provided")
            return None

        url = f"{self.BASE_URL}{bioguide}"

        if not self.navigate_to_page(url):
            self.logger.error(f"Failed to navigate to bioguide page: {url}")
            return None

        try:
            # Wait for page to load
            time.sleep(self.delay)

            # TODO: Implement image URL extraction logic
            # This will be implemented after analyzing the page structure
            image_url = self._extract_image_url()

            if image_url:
                self.logger.info(f"Found profile image for {bioguide}: {image_url}")
                return image_url
            else:
                self.logger.warning(f"No profile image found for {bioguide}")
                return None

        except Exception as e:
            self.logger.error(f"Error extracting profile image for {bioguide}: {e}")
            return None

    def _extract_image_url(self) -> Optional[str]:
        """
        Extract the image URL from the current bioguide page.

        Returns:
            Image URL if found, None otherwise
        """
        try:
            # Wait for the page content to load dynamically
            # The bioguide site is a React app, so we need to wait for content
            time.sleep(2)

            # Look for images with alt attributes containing '/photo/'
            # This is the pattern we observed: alt="/photo/67ffcb2af22eaf56065817c4.jpg"
            elements = self.driver.find_elements(By.CSS_SELECTOR, "img[alt*='/photo/']")

            for element in elements:
                src = element.get_attribute("src")
                if src and self._is_valid_image_url(src):
                    return src

            # Fallback: look for any images with src containing 'photo'
            elements = self.driver.find_elements(By.CSS_SELECTOR, "img[src*='/photo/']")

            for element in elements:
                src = element.get_attribute("src")
                if src and self._is_valid_image_url(src):
                    return src

            # Additional fallback: look for images in the bioguide.congress.gov domain
            elements = self.driver.find_elements(By.CSS_SELECTOR, "img")

            for element in elements:
                src = element.get_attribute("src")
                if (
                    src
                    and "bioguide.congress.gov/photo/" in src
                    and self._is_valid_image_url(src)
                ):
                    return src

            return None

        except Exception as e:
            self.logger.error(f"Error in image extraction: {e}")
            return None

    def _is_valid_image_url(self, url: str) -> bool:
        """
        Check if a URL appears to be a valid profile image URL.

        Args:
            url: URL to validate

        Returns:
            True if URL appears valid, False otherwise
        """
        if not url:
            return False

        # Check for common image extensions
        image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
        url_lower = url.lower()

        # Must contain an image extension
        if not any(ext in url_lower for ext in image_extensions):
            return False

        # Should be from bioguide.congress.gov domain
        if "bioguide.congress.gov" not in url_lower:
            return False

        # Should not be a placeholder or default image
        placeholder_indicators = ["default", "placeholder", "missing", "nophoto"]
        if any(indicator in url_lower for indicator in placeholder_indicators):
            return False

        return True
