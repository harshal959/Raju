from scraper import scrape_all
import sys

try:
    print("Testing scrape_all with 'Samsung Galaxy S10 Plus'...")
    result = scrape_all("Samsung Galaxy S10 Plus")
    print("Success!")
    print(result)
except Exception as e:
    print("CRASHED:")
    import traceback
    traceback.print_exc()
