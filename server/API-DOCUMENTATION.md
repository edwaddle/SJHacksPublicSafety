# API Documentation

## Overview
This document describes the backend API endpoints available for the Wildfire Monitoring application.

## Base URL
When running locally, the base URL for all API endpoints is:
```
http://localhost:3001
```

## Endpoints

### 1. Get Weather Data
Fetches current weather conditions for San José, California.

**Endpoint:** `GET /api/weather`

**Response Format:**
```json
{
  "location": "San José, California",
  "temperature": 22.5,     // in Celsius
  "humidity": 65,          // percentage
  "windSpeed": 3.2,        // in meters per second
  "description": "few clouds",
  "timestamp": "2023-11-04T15:30:45.123Z"
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch weather data from OpenWeatherMap API",
  "message": "Error details"
}
```

### 2. Get Wildfire Data
Fetches active wildfire data for the USA.

**Endpoint:** `GET /api/wildfires`

**Response Format:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "latitude": "37.7749",
      "longitude": "-122.4194",
      "brightness": "325.4",
      "scan": "0.5",
      "track": "0.5",
      "acq_date": "2023-10-15",
      "acq_time": "1540",
      "confidence": "high",
      "version": "1.0",
      "bright_t31": "292.9",
      "frp": "12.5"
    },
    // Additional wildfire data entries...
  ]
}
```

**Note:** If the NASA API call fails, the backend will return demo data.

### 3. Analyze Image for Wildfire
Analyzes an uploaded image to detect potential wildfire.

**Endpoint:** `POST /api/analyze-image`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with "image" field containing the image file

**Response Format:**
```json
{
  "result": "YES"  // or "NO" or "UNCERTAIN"
}
```

## Required Environment Variables
To use these APIs, set up a `.env` file in the server directory with:

```
PORT=3001
NASA_API_KEY=your_nasa_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Required for image analysis
```

## Frontend Integration
In your React components, use this utility function to fetch data:

```javascript
// utils/api.js
export const fetchWeather = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/weather');
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};