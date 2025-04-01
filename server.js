const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;
const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests (if needed in the future)
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Google Places API route
app.get('/places', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'No restaurants found' });
        }
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Error fetching places' });
    }
});

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('/var/www/mealmatch/my_private.key'),
    cert: fs.readFileSync('/var/www/mealmatch/my_certificate.crt')
};

// Create an HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
});
