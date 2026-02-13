import requests
import json

try:
    # Query something random that definitely isn't in DEMO_DATA
    query = "Red Nike Air Jordan"
    print(f"Testing /scrape with '{query}'...")
    response = requests.get(f"http://127.0.0.1:5000/scrape?query={query.replace(' ', '+')}")
    data = response.json()
    
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        print("Name:", data.get('name'))
        image_url = data.get('image')
        print("Image URL:", image_url)
        
        if "placehold.co" not in image_url and "http" in image_url:
             print("SUCCESS: Returned a real Dynamic Image URL!")
        else:
             print("WARNING: Returned placeholder image.")
    else:
        print("Error:", data)

except Exception as e:
    print(f"Request failed: {e}")
