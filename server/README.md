# Wildfire and Weather API Server

A Node.js + Express.js backend server providing API endpoints for wildfire data from NASA FIRMS and weather data from OpenWeatherMap for a Vite + React frontend project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following content:
```
PORT=3001
NASA_API_KEY=your_nasa_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Wildfires

- **GET /api/wildfires**: Fetch active wildfire data in GeoJSON format from NASA FIRMS API.

### Weather

- **GET /api/weather**: Fetch current weather data for San José, California (temperature, humidity, wind speed).

### Image Analysis

- **POST /api/analyze-image**: Analyze an uploaded image for potential wildfire detection using OpenAI Vision API.

## Technologies Used

- Node.js
- Express.js
- Axios for API requests
- CORS for cross-origin resource sharing
- dotenv for environment variables
- Multer for handling file uploads
- OpenAI API for image analysis

## Note

You need valid API keys for:
1. NASA FIRMS API: [https://firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/)
2. OpenWeatherMap API: [https://openweathermap.org/api](https://openweathermap.org/api)
3. OpenAI API: [https://platform.openai.com/](https://platform.openai.com/) 