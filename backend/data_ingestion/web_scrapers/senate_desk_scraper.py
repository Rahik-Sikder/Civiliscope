"""
Specialized scraper for extracting senator desk assignments from the Senate chamber map.
"""

from selenium.webdriver.common.by import By
from typing import Dict, Optional
import time
from .selenium_web_scraper import SeleniumWebScraper


class SenateDeskScraper(SeleniumWebScraper):
    """
    Specialized scraper for extracting senator desk assignments from the Senate chamber map.
    """

    SENATE_DESK_MAP_URL = "https://www.senate.gov/art-artifacts/decorative-art/furniture/senate-chamber-desks/chambermap.htm"

    def __init__(self, headless: bool = True, delay: float = 2.0, timeout: int = 30):
        """Initialize the Senate desk scraper with appropriate settings."""
        super().__init__(headless=headless, delay=delay, timeout=timeout)

    def scrape_senators_list(self) -> Dict[str, Dict[str, str]]:
        """
        Scrape the complete senators list from the Senate chamber desk map.

        Returns:
            Dictionary mapping desk values to senator information
        """
        senators_data = {}

        if not self.navigate_to_page(self.SENATE_DESK_MAP_URL):
            return senators_data

        try:
            # Wait for the senators list container to load
            if not self.wait_for_element_by_id("senators_list_container", timeout=15):
                self.logger.error("senators_list_container not found")
                return senators_data

            # Find all senator items within the senators_list div
            senator_elements = self.driver.find_elements(
                By.CSS_SELECTOR, "#senators_list p.senators_item"
            )

            if not senator_elements:
                self.logger.warning("No senator items found in the list")
                return senators_data

            # Extract senator information from each item
            for element in senator_elements:
                senator_info = self._extract_senator_from_item(element)
                if (
                    senator_info
                    and senator_info.get("desk_value")
                    and senator_info.get("full_name")
                ):
                    full_name = senator_info.pop("full_name")
                    senators_data[full_name] = senator_info

            self.logger.info(f"Successfully scraped {len(senators_data)} senators")

        except Exception as e:
            self.logger.error(f"Error scraping senators list: {e}")

        return senators_data

    def _extract_senator_from_item(self, item_element) -> Optional[Dict[str, str]]:
        """
        Extract senator information from a senator list item element.

        Args:
            item_element: WebDriver element representing a senator item

        Returns:
            Dictionary with senator information or None if extraction fails
        """
        try:
            # Get the value attribute (desk number)
            desk_value = item_element.get_attribute("value")
            if not desk_value:
                self.logger.debug("No value attribute found for senator item")
                return None

            # Get the text content
            senator_text = item_element.text.strip()
            if not senator_text:
                self.logger.debug("No text content found for senator item")
                return None

            # Parse the senator information
            senator_info = self._parse_senator_item_text(senator_text)
            senator_info["desk_value"] = desk_value

            # Get additional attributes
            item_id = item_element.get_attribute("id")
            if item_id:
                senator_info["item_id"] = item_id

            # Check if this senator is currently selected
            class_attr = item_element.get_attribute("class")
            if class_attr and "senators_item_selected" in class_attr:
                senator_info["is_selected"] = True
            else:
                senator_info["is_selected"] = False

            return senator_info

        except Exception as e:
            self.logger.debug(f"Error extracting senator from item element: {e}")
            return None

    def _parse_senator_item_text(self, text: str) -> Dict[str, str]:
        """
        Parse senator information from list item text content.

        Expected format: "Last, First Middle (Party) State"
        Example: "Alsobrooks, Angela D. (D) MD"

        Args:
            text: Raw text containing senator information

        Returns:
            Dictionary with parsed senator information
        """
        info = {}

        try:
            # Expected format: "Last, First Middle (Party) State"
            if "(" in text and ")" in text:
                # Split into name part and party/state part
                name_part = text.split("(")[0].strip()
                party_state_part = text.split("(")[1].split(")")[0].strip()
                remaining_part = text.split(")", 1)[1].strip() if ")" in text else ""

                # Parse name (format: "Last, First Middle" or "Last, First Middle, Jr.")
                if "," in name_part:
                    parts = [part.strip() for part in name_part.split(",")]
                    last_name = parts[0]
                    first_middle = parts[1]

                    # Check for valid suffix (Jr., Sr., III, etc. - not titles like M.D.)
                    if len(parts) > 2:
                        suffix = parts[2]
                        valid_suffixes = [
                            "Jr.",
                            "Jr",
                            "Sr.",
                            "Sr",
                            "II",
                            "III",
                            "IV",
                            "V",
                        ]
                        if suffix in valid_suffixes:
                            info["full_name"] = f"{first_middle} {last_name}, {suffix}"
                            info["last_name"] = f"{last_name}, {suffix}"
                        else:
                            # Treat as part of first/middle name if not a valid suffix
                            info["full_name"] = f"{first_middle} {last_name}"
                            info["last_name"] = last_name
                    else:
                        info["full_name"] = f"{first_middle} {last_name}"
                        info["last_name"] = last_name

                    info["first_name"] = first_middle
                else:
                    info["full_name"] = name_part.strip()

                # Parse party (single letter inside parentheses)
                info["party"] = party_state_part.strip()

                # Parse state (after the closing parenthesis)
                info["state"] = remaining_part.strip()

            else:
                # Fallback: just store as full name
                info["full_name"] = text.strip()

        except Exception as e:
            self.logger.debug(f"Error parsing senator text '{text}': {e}")
            info["full_name"] = text.strip()  # Fallback

        return info

    def _parse_senator_text(self, text: str) -> Dict[str, str]:
        """
        Legacy parsing method for backward compatibility.
        Redirects to the new parsing method.
        """
        return self._parse_senator_item_text(text)

    def _extract_desk_number(self, href: str) -> Optional[str]:
        """
        Extract desk number from href attribute.

        Args:
            href: The href attribute value

        Returns:
            Desk number if found, None otherwise
        """
        import re

        # Look for patterns like "desk123" or "desk_123"
        match = re.search(r"desk[_-]?(\d+)", href.lower())
        if match:
            return match.group(1)

        return None

    def _check_for_tooltip_info(self) -> Optional[Dict[str, str]]:
        """
        Check for tooltip or popup information that might appear after clicking.

        Returns:
            Senator information from tooltip or None if not found
        """
        # Wait briefly for any tooltip to appear
        time.sleep(0.5)

        # Common selectors for tooltips or popup content
        tooltip_selectors = [
            ".tooltip",
            ".popup",
            "#deskTitle",
            "[role='tooltip']",
            ".senator-info",
        ]

        for selector in tooltip_selectors:
            try:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    if element.is_displayed():
                        text = element.text.strip()
                        if text:
                            return self._parse_senator_text(text)
            except Exception:
                continue

        return None

    def scrape_with_dropdown_interaction(self) -> Dict[str, Dict[str, Dict[str, str]]]:
        """
        Scrape senator information by interacting with dropdown menus for different years.

        Returns:
            Dictionary mapping congress years to senator data dictionaries
        """
        all_senators_by_year = {}

        if not self.navigate_to_page(self.SENATE_DESK_MAP_URL):
            return all_senators_by_year

        try:
            # Look for dropdown elements
            dropdowns = self.driver.find_elements(By.TAG_NAME, "select")

            for dropdown in dropdowns:
                options = dropdown.find_elements(By.TAG_NAME, "option")

                for option in options:
                    option_value = option.get_attribute("value")
                    if option_value:
                        # Select the option
                        option.click()
                        time.sleep(self.delay)

                        # Scrape senators for this selection
                        senators_data = self.scrape_senators_list()

                        if senators_data:
                            # Add year information
                            year = option.text.strip()
                            all_senators_by_year[year] = senators_data
                            self.logger.info(
                                f"Scraped {len(senators_data)} senators for {year}"
                            )

        except Exception as e:
            self.logger.error(f"Error in dropdown interaction: {e}")

        return all_senators_by_year
