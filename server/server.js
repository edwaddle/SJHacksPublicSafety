require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const OpenAI = require("openai");
const weatherRoutes = require('./routes/weather');
const wildfireRoutes = require('./routes/wildfire');

// Check for environment variables
const hasEnvFile = fs.existsSync(path.join(__dirname, '.env'));
console.log(`Environment: .env file ${hasEnvFile ? 'found' : 'not found'}`);
console.log('Environment variables loaded:');
console.log('- OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'Not set');
console.log('- NASA_API_KEY:', process.env.NASA_API_KEY ? 'Set' : 'Not set');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');

// Create Express app
const app = express();

// CORS configuration - Allow all origins for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Also keep the regular cors middleware as a backup
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3001;

// Add a test endpoint to check if the server is running
app.get('/api/status', (req, res) => {
  console.log('Status endpoint accessed');
  res.json({ status: 'Server is running' });
});

// Set up API routes
app.use("/api/weather", weatherRoutes);
app.use("/api/wildfires", wildfireRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`- http://localhost:${PORT}/api/status`);
  console.log(`- http://localhost:${PORT}/api/weather`);
  console.log(`- http://localhost:${PORT}/api/wildfires`);
});
