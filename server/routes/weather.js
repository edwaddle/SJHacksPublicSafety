const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @route   GET /api/weather
 * @desc    Fetch current weather data for San José, California
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // OpenWeatherMap API requires an API key
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!openWeatherApiKey) {
      return res.status(500).json({ error: 'OpenWeather API key is missing in environment variables' });
    }

    // San José, California coordinates
    const lat = 37.3382;
    const lon = -121.8863;

    // OpenWeatherMap API for current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    
    const response = await axios.get(weatherUrl);
    
    // Extract relevant weather data
    const weatherData = {
      location: 'San José, California',
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      timestamp: new Date()
    };
    
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch weather data from OpenWeatherMap API',
      message: error.message 
    });
  }
});

module.exports = router; 