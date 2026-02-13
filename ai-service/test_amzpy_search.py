from amzpy import AmazonScraper
import json

try:
    print("Initializing AmazonScraper...")
    scraper = AmazonScraper()
    
    print("Searching for Samsung S24...")
    # It might return a dict or list.
    results = scraper.search_products(query="Samsung S24")
    
    print("Results type:", type(results))
    if isinstance(results, dict):
        print("Keys:", results.keys())
        # It might be paginated
        if 'products' in results:
            print("First product:", json.dumps(results['products'][0], indent=2))
        else:
            print("Dict content:", json.dumps(results, indent=2))
    elif isinstance(results, list):
        if results:
            print("First product:", json.dumps(results[0], indent=2))
        else:
            print("Empty list returned")
    else:
        print("Unknown result type:", results)

except Exception as e:
    print(f"Error: {e}")
