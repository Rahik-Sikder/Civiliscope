"""
Selenium-based web scraping utility for extracting data from dynamic web pages.
Designed to be reusable across different scraping use cases, with support for
JavaScript-rendered content and interactive elements.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import os
import shutil
from bs4 import BeautifulSoup
from typing import List, Dict, Optional, Union, Callable
import time
import logging


class SeleniumWebScraper:
    """
    A Selenium-based web scraper for extracting data from dynamic web pages.
    Supports JavaScript rendering, interactive elements, and dynamic content loading.
    """
    
    def __init__(self, headless: bool = True, delay: float = 1.0, timeout: int = 30):
        """
        Initialize the Selenium web scraper.
        
        Args:
            headless: Run browser in headless mode (no GUI)
            delay: Delay between actions in seconds (for rate limiting)
            timeout: WebDriver wait timeout in seconds
        """
        self.headless = headless
        self.delay = delay
        self.timeout = timeout
        self.driver = None
        self.wait = None
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _setup_driver(self) -> webdriver.Chrome:
        """
        Setup Chrome WebDriver with appropriate options.
        
        Returns:
            Configured Chrome WebDriver instance
        """
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless")
        
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-software-rasterizer")
        chrome_options.add_argument("--disable-background-timer-throttling")
        chrome_options.add_argument("--disable-backgrounding-occluded-windows")
        chrome_options.add_argument("--disable-renderer-backgrounding")
        chrome_options.add_argument("--disable-features=TranslateUI")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        # Try to find Chrome binary
        chrome_paths = [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser", 
            "/usr/bin/chromium",
            "/snap/bin/chromium"
        ]
        
        for path in chrome_paths:
            if shutil.which(path):
                chrome_options.binary_location = path
                self.logger.info(f"Using Chrome binary at: {path}")
                break
        
        # Try to find ChromeDriver (system first, then WebDriver Manager)
        chromedriver_path = None
        system_chromedriver_paths = [
            "/usr/bin/chromedriver",
            "/usr/local/bin/chromedriver",
            os.environ.get("CHROMEDRIVER_PATH")
        ]
        
        for path in system_chromedriver_paths:
            if path and shutil.which(path):
                chromedriver_path = path
                self.logger.info(f"Using system ChromeDriver at: {path}")
                break
        
        if chromedriver_path:
            service = Service(chromedriver_path)
        else:
            # Fallback to WebDriver Manager
            try:
                from webdriver_manager.chrome import ChromeDriverManager
                service = Service(ChromeDriverManager().install())
                self.logger.info("Using WebDriver Manager ChromeDriver")
            except ImportError:
                raise RuntimeError("No ChromeDriver found and webdriver-manager not available")
        
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        return driver
    
    def __enter__(self):
        """Context manager entry - setup driver."""
        self.driver = self._setup_driver()
        self.wait = WebDriverWait(self.driver, self.timeout)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit - cleanup driver."""
        if self.driver:
            self.driver.quit()
    
    def close(self):
        """Manually close the WebDriver. Use this if not using context manager."""
        if self.driver:
            self.driver.quit()
            self.driver = None
            self.wait = None
    
    def navigate_to_page(self, url: str) -> bool:
        """
        Navigate to a web page and wait for it to load.
        
        Args:
            url: The URL to navigate to
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Initialize driver if not already done
            if self.driver is None:
                self.driver = self._setup_driver()
                self.wait = WebDriverWait(self.driver, self.timeout)
            
            self.logger.info(f"Navigating to URL: {url}")
            self.driver.get(url)
            
            # Wait for page to load by checking for body element
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(self.delay)  # Rate limiting
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error navigating to {url}: {e}")
            return False
    
    def get_page_source(self) -> Optional[BeautifulSoup]:
        """
        Get the current page source as a BeautifulSoup object.
        
        Returns:
            BeautifulSoup object or None if failed
        """
        try:
            page_source = self.driver.page_source
            return BeautifulSoup(page_source, 'lxml')
        except Exception as e:
            self.logger.error(f"Error getting page source: {e}")
            return None
    
    def wait_for_element_by_id(self, element_id: str, timeout: Optional[int] = None) -> bool:
        """
        Wait for an element with specific ID to be present and visible.
        
        Args:
            element_id: The ID of the element to wait for
            timeout: Custom timeout (uses instance timeout if None)
            
        Returns:
            True if element found, False otherwise
        """
        try:
            wait_time = timeout or self.timeout
            element = WebDriverWait(self.driver, wait_time).until(
                EC.presence_of_element_located((By.ID, element_id))
            )
            return True
        except TimeoutException:
            self.logger.warning(f"Element with ID '{element_id}' not found within {wait_time} seconds")
            return False
    
    def find_element_by_id(self, element_id: str) -> Optional[object]:
        """
        Find an element by its ID using Selenium WebDriver.
        
        Args:
            element_id: The ID of the element to find
            
        Returns:
            WebDriver element or None if not found
        """
        try:
            element = self.driver.find_element(By.ID, element_id)
            return element
        except NoSuchElementException:
            self.logger.warning(f"Element with ID '{element_id}' not found")
            return None
    
    def find_elements_by_class(self, class_name: str, tag: str = None) -> List[object]:
        """
        Find HTML elements by their class name using Selenium WebDriver.
        
        Args:
            class_name: The class name to search for
            tag: Optional tag name to filter by
            
        Returns:
            List of WebDriver elements
        """
        try:
            if tag:
                selector = f"{tag}.{class_name}"
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
            else:
                elements = self.driver.find_elements(By.CLASS_NAME, class_name)
                
            self.logger.info(f"Found {len(elements)} elements with class '{class_name}'")
            return elements
        except Exception as e:
            self.logger.error(f"Error finding elements by class '{class_name}': {e}")
            return []
    
    def find_elements_by_tag(self, tag: str) -> List[object]:
        """
        Find HTML elements by tag name using Selenium WebDriver.
        
        Args:
            tag: The HTML tag to search for
            
        Returns:
            List of WebDriver elements
        """
        try:
            elements = self.driver.find_elements(By.TAG_NAME, tag)
            self.logger.info(f"Found {len(elements)} '{tag}' elements")
            return elements
        except Exception as e:
            self.logger.error(f"Error finding elements by tag '{tag}': {e}")
            return []
    
    def extract_text_from_elements(self, elements: List[object], strip: bool = True) -> List[str]:
        """
        Extract text content from a list of WebDriver elements.
        
        Args:
            elements: List of WebDriver elements
            strip: Whether to strip whitespace from text
            
        Returns:
            List of text strings
        """
        texts = []
        for element in elements:
            if element:
                try:
                    text = element.text
                    if strip:
                        text = text.strip()
                    texts.append(text)
                except Exception as e:
                    self.logger.warning(f"Error extracting text from element: {e}")
        return texts
    
    def extract_links_from_elements(self, elements: List[object]) -> List[Dict[str, str]]:
        """
        Extract links (href attributes) from a list of WebDriver elements.
        
        Args:
            elements: List of WebDriver elements
            
        Returns:
            List of dictionaries with 'text' and 'href' keys
        """
        links = []
        for element in elements:
            if element:
                try:
                    # Find all anchor tags within the element
                    anchors = element.find_elements(By.TAG_NAME, "a")
                    for anchor in anchors:
                        href = anchor.get_attribute("href")
                        if href:
                            links.append({
                                'text': anchor.text.strip(),
                                'href': href
                            })
                except Exception as e:
                    self.logger.warning(f"Error extracting links from element: {e}")
        return links
    
    def click_element(self, element) -> bool:
        """
        Click on a WebDriver element.
        
        Args:
            element: WebDriver element to click
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.driver.execute_script("arguments[0].click();", element)
            time.sleep(self.delay)
            return True
        except Exception as e:
            self.logger.error(f"Error clicking element: {e}")
            return False
    
    def custom_extract(self, extractor_func: Callable) -> any:
        """
        Apply a custom extractor function to the current page.
        
        Args:
            extractor_func: A function that takes a WebDriver instance and returns data
            
        Returns:
            Result of the extractor function
        """
        try:
            return extractor_func(self.driver)
        except Exception as e:
            self.logger.error(f"Error in custom extraction: {e}")
            return None


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
            senator_elements = self.driver.find_elements(By.CSS_SELECTOR, "#senators_list p.senators_item")
            
            if not senator_elements:
                self.logger.warning("No senator items found in the list")
                return senators_data
            
            # Extract senator information from each item
            for element in senator_elements:
                senator_info = self._extract_senator_from_item(element)
                if senator_info and senator_info.get('desk_value') and senator_info.get('full_name'):
                    full_name = senator_info.pop('full_name')
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
                        valid_suffixes = ["Jr.", "Jr", "Sr.", "Sr", "II", "III", "IV", "V"]
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
            ".senator-info"
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
                            self.logger.info(f"Scraped {len(senators_data)} senators for {year}")
        
        except Exception as e:
            self.logger.error(f"Error in dropdown interaction: {e}")
        
        return all_senators_by_year