const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @route   GET /api/weather
 * @desc    Fetch current weather data for San José, California
 * @access  Public
 */
router.get('/', async (req, res) => {
  console.log('Weather endpoint accessed');
  
  // Set CORS headers again as a fallback
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  try {
    // OpenWeatherMap API requires an API key
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!openWeatherApiKey) {
      console.warn('OpenWeather API key is missing. Using fallback data for development.');
      
      // Return fallback data for development purposes
      return res.json({
        location: 'San José, California',
        temperature: 23.5,
        humidity: 65,
        windSpeed: 3.2,
        description: 'clear sky',
        timestamp: new Date(),
        note: 'Using fallback data - API key missing'
      });
    }

    console.log('Fetching weather data from OpenWeatherMap...');
    
    // San José, California coordinates
    const lat = 37.3382;
    const lon = -121.8863;

    // OpenWeatherMap API for current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    
    try {
      const response = await axios.get(weatherUrl);
      console.log('OpenWeatherMap response status:', response.status);
      
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
    } catch (apiError) {
      console.error('OpenWeatherMap API error:', apiError.message);
      
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
      
      // Return fallback data when the API fails
      return res.json({
        location: 'San José, California',
        temperature: 23.5,
        humidity: 65,
        windSpeed: 3.2,
        description: 'clear sky',
        timestamp: new Date(),
        note: 'Using fallback data - API call failed'
      });
    }
  } catch (error) {
    console.error('Error in weather route:', error.message);
    
    // Return fallback data even in case of general errors
    return res.json({
      location: 'San José, California',
      temperature: 23.5,
      humidity: 65,
      windSpeed: 3.2,
      description: 'partly cloudy',
      timestamp: new Date(),
      note: 'Using fallback data - Server error'
    });
  }
});

module.exports = router; 