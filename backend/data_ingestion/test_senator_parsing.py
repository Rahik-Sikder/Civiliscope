"""
Quick test to verify the senator parsing works with the actual HTML structure.
"""

from web_scraper import SenateDeskScraper

def test_parsing():
    """Test the parsing function with real senator data."""
    scraper = SenateDeskScraper()
    
    # Test cases from the actual HTML
    test_cases = [
        "Alsobrooks, Angela D. (D) MD",
        "Baldwin, Tammy (D) WI", 
        "King, Angus S., Jr. (I) ME",
        "Marshall, Roger, M.D. (R) KS",
        "Sanders, Bernard (I) VT"
    ]
    
    print("Testing senator name parsing:")
    print("-" * 50)
    
    for test_text in test_cases:
        result = scraper._parse_senator_item_text(test_text)
        print(f"Input: {test_text}") 
        print(f"Output: {result}")
        print()
    
    # Test the expected output format
    expected_keys = ['last_name', 'first_name', 'full_name', 'party', 'state']
    sample_result = scraper._parse_senator_item_text(test_cases[0])
    
    print("Checking expected keys:")
    for key in expected_keys:
        if key in sample_result:
            print(f"✓ {key}: {sample_result[key]}")
        else:
            print(f"✗ {key}: Missing")
    
    # Test the actual scraping (now works without context manager)
    try:
        print("Testing actual scraping...")
        senators_data = scraper.scrape_senators_list()
        print(f"Successfully scraped {len(senators_data)} senators")
        print("List: ", senators_data)
            
    except Exception as e:
        print(f"Scraping failed: {e}")
    finally:
        # Always clean up the driver
        scraper.close()

if __name__ == "__main__":
    test_parsing()