from flask import Flask, request, jsonify
from flask_cors import CORS
import scraper
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ai-service"})

@app.route('/scrape', methods=['GET'])
def scrape_product():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    try:
        data = scraper.scrape_all(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    reviews = data.get('reviews', [])
    
    # Placeholder for actual AI sentiment analysis
    # In a real app, this would use NLTK, generic BERT, or OpenAI API
    
    return jsonify({
        "sentiment": "positive",
        "summary": "AI analysis placeholder summary.",
        "pros": ["Placeholder Pro 1", "Placeholder Pro 2"],
        "cons": ["Placeholder Con 1"]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
