const serverless = require('serverless-http');
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Normalize the IP address
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.split(':').pop();
    }

    // Replace with your own IP info API key
    const apiKey = '87b3d2964da756';
    const ipInfoUrl = `https://ipinfo.io/${clientIp}?token=${apiKey}`;

    try {
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const { city, region } = ipInfoResponse.data;
        const location = city || region;

        const tempUrl = `http://api.weatherapi.com/v1/current.json?key=69760244eb9a4b67b8e222314243006&q=${location}&aqi=no`;
        
        const temperatureResponse = await axios.get(tempUrl);
        const temperature = temperatureResponse.data.current.temp_c;

        const response = {
            client_ip: clientIp,
            location: location,
            greeting: `Hello ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

module.exports.handler = serverless(app);