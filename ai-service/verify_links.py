import requests
import json

try:
    # Query something random
    query = "Gaming Mouse"
    print(f"Testing /scrape with '{query}'...")
    response = requests.get(f"http://127.0.0.1:5000/scrape?query={query.replace(' ', '+')}")
    data = response.json()
    
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        prices = data.get('price_comparison', [])
        for p in prices:
            store = p.get('store')
            link = p.get('link')
            print(f"Store: {store}, Link: {link}")
            
            if "http" in link and "search" in link: # Basic check for search url
                 print(f"SUCCESS: Valid Search Link for {store}")
            else:
                 print(f"WARNING: Invalid Link for {store}")

    else:
        print("Error:", data)

except Exception as e:
    print(f"Request failed: {e}")
