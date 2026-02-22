const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Sarvam AI Chatbot Proxy
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const systemMessage = {
            role: 'system',
            content: `You are SmartPick AI Assistant — a helpful, friendly shopping assistant for the SmartPick price comparison platform. You help users find the best deals on smartphones, laptops, audio, watches, gaming consoles, and footwear. You can discuss product features, compare prices, and give shopping advice. Be concise, helpful, and enthusiastic. If asked about prices, mention that SmartPick compares across Amazon, Flipkart, Croma & Meesho. Keep responses short (2-3 sentences max) unless the user asks for detail.`
        };

        const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': 'sk_lon2hugh_lqNoItxsImOMkLwZC2ohF9A7'
            },
            body: JSON.stringify({
                model: 'sarvam-m',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
                max_completion_tokens: 300
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.json({ reply: "I'm sorry, I couldn't process that. Could you try again?" });
        }
    } catch (error) {
        console.error('Sarvam AI Error:', error);
        res.status(500).json({ reply: "Something went wrong. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
