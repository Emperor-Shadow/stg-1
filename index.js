const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Replace with your own IP info API key
    const apiKey = '87b3d2964da756';
    const ipInfoUrl = `https://ipinfo.io/?token=${apiKey}`;
      // Normalize the IP address
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.split(':').pop();
    }

    try {
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const { city, region } = ipInfoResponse.data;
        const location = city || region ;

        const tempUrl = `http://api.weatherapi.com/v1/current.json?key=69760244eb9a4b67b8e222314243006&q=${location}&aqi=no`
        
        const temperatureResponse = await axios.get(tempUrl)
        const temperature = temperatureResponse.data.current.temp_c;

        
        const response = {
            client_ip: clientIp,
            location: location,
            greeting: `Hello ${visitorName}! The temperature is ${ temperature } degrees Celsius in ${location}`
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
