require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const OpenAI = require("openai");
const weatherRoutes = require('./routes/weather');
const wildfireRoutes = require('./routes/wildfire');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3001;

// Set up API routes
app.use("/api/weather", weatherRoutes);
app.use("/api/wildfires", wildfireRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
