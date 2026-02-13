from amzpy import AmazonScraper
import json

try:
    print("Initializing AmazonScraper...")
    scraper = AmazonScraper()
    print("Scraper attributes:", dir(scraper))
    
    # Try search if it exists
    if hasattr(scraper, 'search'):
        print("Searching for Samsung S24...")
        results = scraper.search("Samsung S24")
        print("Results type:", type(results))
        if results:
            print("First result:", results[0])
    else:
        print("No search method found in AmazonScraper")

except Exception as e:
    print(f"Error: {e}")
