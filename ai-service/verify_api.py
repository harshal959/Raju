import requests
import json

try:
    print("Testing /scrape with 'Samsung S24'...")
    response = requests.get("http://127.0.0.1:5000/scrape?query=Samsung+S24")
    data = response.json()
    
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        print("Name:", data.get('name'))
        print("Image:", data.get('image'))
        print("Price Comparison Count:", len(data.get('price_comparison', [])))
        
        # Check if it matches our demo data
        if "Titanium Gray" in data.get('name', '') and data.get('price_comparison'):
            print("SUCCESS: Returned Demo Data!")
        else:
            print("WARNING: Did not return expected Demo Data.")
    else:
        print("Error:", data)

except Exception as e:
    print(f"Request failed: {e}")
