from duckduckgo_search import DDGS
import re

def get_real_price(query):
    search_query = f"{query} price in india"
    print(f"Searching for: {search_query}...")
    
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(search_query, max_results=5))
            print(f"DEBUG: Found {len(results)} results")
            print(f"DEBUG RAW: {results[:1]}") # Print first result structure

            for r in results:
                title = r.get('title', '')
                body = r.get('body', '')
                text = f"{title} {body}"
                print(f"Analyzing: {text[:100]}...")
                
                # Regex for Indian Price: ₹ 25,999 or Rs. 25,999 or 25,999
                # Matches: ₹? \s? ([0-9,]+)
                match = re.search(r'(?:Rs\.?|₹)\s?([\d,]+)', text)
                if match:
                    price_str = match.group(1).replace(',', '')
                    if price_str.isdigit():
                        price = int(price_str)
                        if price > 100: # Filter out garbage small numbers
                            print(f"FOUND PRICE: {price}")
                            return price
            
    except Exception as e:
        print(f"Error: {e}")
    
    print("Could not find price.")
    return None

# Test
print("Result:", get_real_price("Samsung S10 Plus"))
print("Result:", get_real_price("Nike Air Jordan"))
print("Result:", get_real_price("PlayStation 5"))
