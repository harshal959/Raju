import requests
import json

queries = [
    "Samsung Galaxy S10 Plus",
    "Nike Air Jordan",
    "Apple MacBook Air M2",
    "Sony WH-1000XM5 Headphones",
    "Generic Water Bottle"
]

print("Testing Smart Price Predictor...")
print("-" * 50)

for q in queries:
    try:
        url = f"http://127.0.0.1:5000/scrape?query={q.replace(' ', '+')}"
        response = requests.get(url)
        data = response.json()
        
        if response.status_code == 200:
             prices = [item['price'] for item in data['price_comparison']]
             avg_price = sum(prices) / len(prices) if prices else 0
             print(f"Query: {q:<30} | Avg Price: ₹{avg_price:,.0f} | Realism Check: {'PASS' if avg_price > 100 else 'FAIL'}")
        else:
             print(f"Query: {q:<30} | FAILED (Status {response.status_code})")
             
    except Exception as e:
        print(f"Query: {q:<30} | ERROR: {e}")

print("-" * 50)
