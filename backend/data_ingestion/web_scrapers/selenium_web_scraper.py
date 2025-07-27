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