// Node.js Server to proxy requests and handle API Key securely
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// API Key has been securely inserted here
const GEMINI_API_KEY = 'AIzaSyAWpfd4fZPRPBQr8K32x8vpP4N1rqCVEeY'; 
// CORRECTED URL: 'models/' was missing, and the URL structure was malformed.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

const app = express();
const PORT = 3000;

// Use CORS middleware to allow requests from your local Live Server (127.0.0.1:5500)
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Ensure this matches your Live Server address
}));
app.use(express.json()); // Middleware to parse JSON body

app.post('/api/generate', async (req, res) => {
    try {
        // The client (index.html) sends the chat history and system instruction
        const { contents, systemInstruction } = req.body;
        
        const payload = {
            contents: contents,
            systemInstruction: systemInstruction,
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data); // Send the Gemini response back to the browser

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with the Gemini API.' });
    }
});

app.listen(PORT, () => {
    console.log(`CORS Proxy server running at http://localhost:${PORT}`);
    console.log(`Ready to handle requests from Live Server on port 5500.`);
});
