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

// Endpoint for image analysis
app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString("base64");

    // Create the prompt for wildfire detection
    const prompt = "Analyze this image and determine if there is a wildfire present. Consider factors like smoke, flames, and unusual heat patterns. Respond with 'YES' if a wildfire is detected, 'NO' if no wildfire is detected, and 'UNCERTAIN' if the image is unclear.";

    // Call OpenAI's Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 100
    });

    const result = response.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Error analyzing image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
