from amzpy import search

try:
    print("Testing amzpy search...")
    results = search("Samsung S24")
    print("Results found:")
    print(results[:2] if results else "No results")
except Exception as e:
    print(f"Error: {e}")
    # Inspect module if search fails
    import amzpy
    print("Module dir:", dir(amzpy))
