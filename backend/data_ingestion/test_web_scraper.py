"""
Tests for the Selenium-based web scraping utility.
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from .web_scraper import SeleniumWebScraper, SenateDeskScraper


class TestSeleniumWebScraper(unittest.TestCase):
    """Test cases for SeleniumWebScraper class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.scraper = SeleniumWebScraper(headless=True, delay=0.1, timeout=10)
        
        # Mock WebDriver elements
        self.mock_driver = Mock()
        self.mock_wait = Mock()
        self.mock_element = Mock()
        self.mock_element.text = "Test Element Text"
        self.mock_element.get_attribute.return_value = "test-value"
    
    def test_navigate_to_page_success(self):
        """Test successful page navigation."""
        with patch.object(self.scraper, 'driver', self.mock_driver), \
             patch.object(self.scraper, 'wait', self.mock_wait):
            
            # Mock successful navigation
            self.mock_wait.until.return_value = True
            
            result = self.scraper.navigate_to_page('http://test.com')
            
            self.assertTrue(result)
            self.mock_driver.get.assert_called_once_with('http://test.com')
    
    def test_navigate_to_page_failure(self):
        """Test page navigation failure."""
        with patch.object(self.scraper, 'driver', self.mock_driver), \
             patch.object(self.scraper, 'wait', self.mock_wait):
            
            # Mock navigation failure
            self.mock_driver.get.side_effect = Exception("Navigation error")
            
            result = self.scraper.navigate_to_page('http://test.com')
            
            self.assertFalse(result)
    
    def test_find_element_by_id_found(self):
        """Test finding element by ID when element exists."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock successful element finding
            self.mock_driver.find_element.return_value = self.mock_element
            
            result = self.scraper.find_element_by_id('test-id')
            
            self.assertIsNotNone(result)
            self.mock_driver.find_element.assert_called_once_with(By.ID, 'test-id')
    
    def test_find_element_by_id_not_found(self):
        """Test finding element by ID when element doesn't exist."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock element not found
            self.mock_driver.find_element.side_effect = NoSuchElementException("Element not found")
            
            result = self.scraper.find_element_by_id('nonexistent-id')
            
            self.assertIsNone(result)
    
    def test_wait_for_element_by_id_timeout(self):
        """Test waiting for element by ID when timeout occurs."""
        with patch.object(self.scraper, 'driver', self.mock_driver), \
             patch('selenium.webdriver.support.ui.WebDriverWait') as mock_wait_class:
            
            mock_wait_instance = Mock()
            mock_wait_class.return_value = mock_wait_instance
            mock_wait_instance.until.side_effect = TimeoutException("Timeout")
            
            result = self.scraper.wait_for_element_by_id('test-id')
            
            self.assertFalse(result)
    
    def test_find_elements_by_class(self):
        """Test finding elements by class name."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock multiple elements found
            mock_elements = [Mock(), Mock()]
            self.mock_driver.find_elements.return_value = mock_elements
            
            result = self.scraper.find_elements_by_class('test-class')
            
            self.assertEqual(len(result), 2)
            self.mock_driver.find_elements.assert_called_once_with(By.CLASS_NAME, 'test-class')
    
    def test_find_elements_by_class_with_tag(self):
        """Test finding elements by class name and tag."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock elements found with CSS selector
            mock_elements = [Mock(), Mock()]
            self.mock_driver.find_elements.return_value = mock_elements
            
            result = self.scraper.find_elements_by_class('test-class', 'div')
            
            self.assertEqual(len(result), 2)
            self.mock_driver.find_elements.assert_called_once_with(By.CSS_SELECTOR, 'div.test-class')
    
    def test_find_elements_by_tag(self):
        """Test finding elements by tag name."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock elements found by tag
            mock_elements = [Mock(), Mock()]
            self.mock_driver.find_elements.return_value = mock_elements
            
            result = self.scraper.find_elements_by_tag('p')
            
            self.assertEqual(len(result), 2)
            self.mock_driver.find_elements.assert_called_once_with(By.TAG_NAME, 'p')
    
    def test_click_element_success(self):
        """Test clicking an element successfully."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            # Mock successful click
            self.mock_driver.execute_script.return_value = None
            
            result = self.scraper.click_element(self.mock_element)
            
            self.assertTrue(result)
            self.mock_driver.execute_script.assert_called_once()
    
    def test_extract_text_from_elements(self):
        """Test extracting text from WebDriver elements."""
        mock_elements = [Mock(), Mock()]
        mock_elements[0].text = 'Test paragraph 1'
        mock_elements[1].text = 'Test paragraph 2'
        
        result = self.scraper.extract_text_from_elements(mock_elements)
        
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0], 'Test paragraph 1')
        self.assertEqual(result[1], 'Test paragraph 2')
    
    def test_extract_text_from_elements_with_strip(self):
        """Test extracting text from elements with stripping."""
        mock_elements = [Mock()]
        mock_elements[0].text = '  Test text with spaces  '
        
        result = self.scraper.extract_text_from_elements(mock_elements, strip=True)
        
        self.assertEqual(result[0], 'Test text with spaces')
    
    def test_extract_links_from_elements(self):
        """Test extracting links from WebDriver elements."""
        mock_element = Mock()
        mock_anchor = Mock()
        mock_anchor.text = 'Test Link'
        mock_anchor.get_attribute.return_value = 'http://example.com'
        mock_element.find_elements.return_value = [mock_anchor]
        
        result = self.scraper.extract_links_from_elements([mock_element])
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['text'], 'Test Link')
        self.assertEqual(result[0]['href'], 'http://example.com')
    
    def test_custom_extract(self):
        """Test custom extraction with extractor function."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            def custom_extractor(driver):
                return "Custom extraction result"
            
            result = self.scraper.custom_extract(custom_extractor)
            
            self.assertEqual(result, "Custom extraction result")
    
    def test_custom_extract_exception(self):
        """Test custom extraction when extractor function fails."""
        with patch.object(self.scraper, 'driver', self.mock_driver):
            
            def failing_extractor(driver):
                raise Exception("Extraction failed")
            
            result = self.scraper.custom_extract(failing_extractor)
            
            self.assertIsNone(result)


class TestSenateDeskScraper(unittest.TestCase):
    """Test cases for SenateDeskScraper class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.scraper = SenateDeskScraper(headless=True, delay=0.1, timeout=10)
        
        # Mock WebDriver elements
        self.mock_driver = Mock()
        self.mock_wait = Mock()
    
    def test_parse_senator_item_text_standard_format(self):
        """Test parsing senator text in standard format."""
        text = "Alsobrooks, Angela D. (D) MD"
        
        result = self.scraper._parse_senator_item_text(text)
        
        self.assertEqual(result['last_name'], 'Alsobrooks')
        self.assertEqual(result['first_name'], 'Angela D.')
        self.assertEqual(result['full_name'], 'Angela D. Alsobrooks')
        self.assertEqual(result['party'], 'D')
        self.assertEqual(result['state'], 'MD')
    
    def test_parse_senator_item_text_independent(self):
        """Test parsing senator text for independent senator."""
        text = "King, Angus S., Jr. (I) ME"
        
        result = self.scraper._parse_senator_item_text(text)
        
        self.assertEqual(result['last_name'], 'King')
        self.assertEqual(result['first_name'], 'Angus S., Jr.')
        self.assertEqual(result['full_name'], 'Angus S., Jr. King')
        self.assertEqual(result['party'], 'I')
        self.assertEqual(result['state'], 'ME')
    
    def test_parse_senator_item_text_long_name(self):
        """Test parsing senator text with longer names."""
        text = "Marshall, Roger, M.D. (R) KS"
        
        result = self.scraper._parse_senator_item_text(text)
        
        self.assertEqual(result['last_name'], 'Marshall')
        self.assertEqual(result['first_name'], 'Roger, M.D.')
        self.assertEqual(result['full_name'], 'Roger, M.D. Marshall')
        self.assertEqual(result['party'], 'R')
        self.assertEqual(result['state'], 'KS')
    
    def test_parse_senator_item_text_fallback(self):
        """Test parsing senator text with fallback for malformed input."""
        text = "Malformed Senator Name"
        
        result = self.scraper._parse_senator_item_text(text)
        
        self.assertEqual(result['full_name'], 'Malformed Senator Name')
        self.assertNotIn('party', result)
        self.assertNotIn('state', result)
    
    def test_extract_desk_number_from_href(self):
        """Test extracting desk number from href attribute."""
        href1 = "javascript:showDesk(45)"
        href2 = "/chamber/desk_12.html"
        href3 = "desk-info?number=78"
        
        result1 = self.scraper._extract_desk_number(href1)
        result2 = self.scraper._extract_desk_number(href2)
        result3 = self.scraper._extract_desk_number(href3)
        
        self.assertEqual(result1, "45")
        self.assertEqual(result2, "12")
        self.assertEqual(result3, "78")
    
    def test_extract_desk_number_no_match(self):
        """Test extracting desk number when no pattern matches."""
        href = "javascript:showInfo()"
        
        result = self.scraper._extract_desk_number(href)
        
        self.assertIsNone(result)
    
    @patch.object(SenateDeskScraper, 'navigate_to_page')
    @patch.object(SenateDeskScraper, '_extract_senator_from_item')
    def test_scrape_senators_list_success(self, mock_extract, mock_navigate):
        """Test successful senators list scraping."""
        # Mock successful setup
        mock_navigate.return_value = True
        mock_senator_elements = [Mock(), Mock()]
        
        mock_extract.side_effect = [
            {'desk_value': '36', 'full_name': 'Angela D. Alsobrooks', 'party': 'D', 'state': 'MD'},
            {'desk_value': '16', 'full_name': 'Tammy Baldwin', 'party': 'D', 'state': 'WI'}
        ]
        
        with patch.object(self.scraper, 'wait_for_element_by_id', return_value=True), \
             patch.object(self.scraper.driver, 'find_elements', return_value=mock_senator_elements):
            
            result = self.scraper.scrape_senators_list()
        
        self.assertEqual(len(result), 2)
        self.assertIn('36', result)
        self.assertIn('16', result)
        self.assertEqual(result['36']['full_name'], 'Angela D. Alsobrooks')
        self.assertEqual(result['16']['full_name'], 'Tammy Baldwin')
    
    @patch.object(SenateDeskScraper, 'navigate_to_page')
    def test_scrape_senators_list_navigation_failure(self, mock_navigate):
        """Test senators list scraping when navigation fails."""
        mock_navigate.return_value = False
        
        result = self.scraper.scrape_senators_list()
        
        self.assertEqual(result, [])
    
    def test_extract_senator_from_item_complete(self):
        """Test extracting senator information from a complete item element."""
        mock_element = Mock()
        mock_element.get_attribute.side_effect = lambda attr: {
            'value': '36',
            'id': 'senators_list_item_36',
            'class': 'senators_item senators_item_selected'
        }.get(attr)
        mock_element.text = 'Alsobrooks, Angela D. (D) MD'
        
        result = self.scraper._extract_senator_from_item(mock_element)
        
        self.assertEqual(result['desk_value'], '36')
        self.assertEqual(result['item_id'], 'senators_list_item_36')
        self.assertEqual(result['full_name'], 'Angela D. Alsobrooks')
        self.assertEqual(result['party'], 'D')
        self.assertEqual(result['state'], 'MD')
        self.assertTrue(result['is_selected'])
    
    def test_extract_senator_from_item_not_selected(self):
        """Test extracting senator information from a non-selected item."""
        mock_element = Mock()
        mock_element.get_attribute.side_effect = lambda attr: {
            'value': '16',
            'id': 'senators_list_item_16',
            'class': 'senators_item'
        }.get(attr)
        mock_element.text = 'Baldwin, Tammy (D) WI'
        
        result = self.scraper._extract_senator_from_item(mock_element)
        
        self.assertEqual(result['desk_value'], '16')
        self.assertEqual(result['item_id'], 'senators_list_item_16')
        self.assertEqual(result['full_name'], 'Tammy Baldwin')
        self.assertEqual(result['party'], 'D')
        self.assertEqual(result['state'], 'WI')
        self.assertFalse(result['is_selected'])


if __name__ == '__main__':
    unittest.main()