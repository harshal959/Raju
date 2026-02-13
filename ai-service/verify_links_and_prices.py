import requests
import json
import time

queries = [
    "Samsung Galaxy S10 Plus",
    "Nike Air Jordan",
    "Generic Water Bottle",
    "Apple MacBook Air M2",
    "Sony Headphones"
]

print("Final Verification: Smart Mock Engine")
print("=" * 60)

for q in queries:
    try:
        start_time = time.time()
        url = f"http://127.0.0.1:5000/scrape?query={q.replace(' ', '+')}"
        response = requests.get(url, timeout=10) # 10s timeout
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
             data = response.json()
             prices = [item['price'] for item in data['price_comparison']]
             avg_price = sum(prices) / len(prices) if prices else 0
             links = [item['link'] for item in data['price_comparison']]
             valid_links = all("http" in l for l in links)
             
             print(f"Query: {q:<25} | Time: {elapsed:.1f}s | Price: ₹{avg_price:,.0f} | Links Valid: {valid_links}")
        else:
             print(f"Query: {q:<25} | FAILED (Status {response.status_code})")
             
    except Exception as e:
        print(f"Query: {q:<25} | ERROR: {e}")

print("=" * 60)
