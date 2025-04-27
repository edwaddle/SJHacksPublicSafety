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
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }

  // Check for specific image formats
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG and PNG images are allowed!'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: fileFilter
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 4000;

// Set up API routes
app.use("/api/weather", weatherRoutes);
app.use("/api/wildfires", wildfireRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// GET endpoint for upload configuration
app.get("/api/upload/config", (req, res) => {
  res.json({
    maxFileSize: 5 * 1024 * 1024,
    supportedFileTypes: ["image/jpeg", "image/png"],
    supportedExtensions: [".jpg", ".jpeg", ".png"],
    serverStatus: "ready"
  });
});

// Define constants for wildfire analysis
const RISK_LEVELS = {
  LOW: { min: 1, max: 3, label: "Low" },
  MODERATE: { min: 4, max: 6, label: "Moderate" },
  HIGH: { min: 7, max: 8, label: "High" },
  EXTREME: { min: 9, max: 10, label: "Extreme" }
};

const CONFIDENCE_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

// POST endpoint for image upload and analysis
app.post("/api/upload/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image file provided",
        details: "Please upload an image file"
      });
    }

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type",
        details: "Only JPG and PNG images are allowed"
      });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString("base64");

    // Create a structured prompt for wildfire detection
    const prompt = `
    Analyze this image for signs of wildfire. Focus on:
    - Visible smoke or fire
    - Unusual red/orange glow
    - Smoke plumes
    - Dry vegetation in fire-prone areas
    - Heat signatures or thermal anomalies

    IMPORTANT: Your response MUST follow this EXACT format:
    
    DETECTION: [YES/NO/UNCERTAIN]
    CONFIDENCE: [${CONFIDENCE_LEVELS.LOW}/${CONFIDENCE_LEVELS.MEDIUM}/${CONFIDENCE_LEVELS.HIGH}]
    RISK_SCORE: [a number between 1-10]
    RISK_LEVEL: [${RISK_LEVELS.LOW.label}/${RISK_LEVELS.MODERATE.label}/${RISK_LEVELS.HIGH.label}/${RISK_LEVELS.EXTREME.label}]
    ANALYSIS: [Your detailed analysis, findings, and reasoning]
    
    Guidelines for scoring:
    - DETECTION: Respond with "YES" if you clearly see wildfire, "NO" if you confidently see no wildfire, or "UNCERTAIN" if unclear.
    - CONFIDENCE: Rate your confidence in your detection (${CONFIDENCE_LEVELS.LOW}, ${CONFIDENCE_LEVELS.MEDIUM}, or ${CONFIDENCE_LEVELS.HIGH}).
    - RISK_SCORE: Rate the wildfire risk on a scale of 1-10 (where 1 is very low risk and 10 is extreme risk).
    - RISK_LEVEL: Categorize as "${RISK_LEVELS.LOW.label}" (1-3), "${RISK_LEVELS.MODERATE.label}" (4-6), "${RISK_LEVELS.HIGH.label}" (7-8), or "${RISK_LEVELS.EXTREME.label}" (9-10).
    - ANALYSIS: Provide detailed reasoning including visible evidence, potential concerns, and factors influencing your assessment.
    `;

    // Call OpenAI's Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 100
    });

    const aiResponse = response.choices[0].message.content;
    
    // Parse the structured response
    const detectionMatch = aiResponse.match(/DETECTION:\s*(YES|NO|UNCERTAIN)/i);
    const confidenceMatch = aiResponse.match(/CONFIDENCE:\s*(Low|Medium|High)/i);
    const riskScoreMatch = aiResponse.match(/RISK_SCORE:\s*(\d+)/i);
    const riskLevelMatch = aiResponse.match(/RISK_LEVEL:\s*(Low|Moderate|High|Extreme)/i);
    const analysisMatch = aiResponse.match(/ANALYSIS:\s*([\s\S]*?)(\n\n|$)/i);
    
    const detection = detectionMatch ? detectionMatch[1].toUpperCase() : "UNCERTAIN";
    const confidence = confidenceMatch ? confidenceMatch[1] : CONFIDENCE_LEVELS.MEDIUM;
    const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1]) : 5;
    const riskLevel = riskLevelMatch ? riskLevelMatch[1] : "Moderate";
    const analysis = analysisMatch ? analysisMatch[1].trim() : aiResponse;

    // Map risk score to risk level if not provided
    const calculatedRiskLevel = !riskLevelMatch ? 
      (riskScore <= 3 ? RISK_LEVELS.LOW.label : 
        riskScore <= 6 ? RISK_LEVELS.MODERATE.label : 
          riskScore <= 8 ? RISK_LEVELS.HIGH.label : 
            RISK_LEVELS.EXTREME.label) : 
      riskLevel;

    // Format the response
    const analysisResult = {
      detection,
      confidence,
      riskScore,
      riskLevel: calculatedRiskLevel,
      analysis,
      constants: {
        riskLevels: RISK_LEVELS,
        confidenceLevels: CONFIDENCE_LEVELS
      },
      rawResponse: aiResponse,
      timestamp: new Date().toISOString(),
      imageDetails: {
        size: req.file.size,
        type: req.file.mimetype,
        name: req.file.originalname
      }
    };

    res.json(analysisResult);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "Error analyzing image",
      details: error.message || "An unknown error occurred"
    });
  }
});

// Chat endpoint for wildfire information
app.post("/api/chat/message", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: "No message provided",
        details: "Please provide a message to continue the conversation"
      });
    }
    
    // Call OpenAI's API for chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", 
          content: `You are EmbrAlrt's AI assistant specializing in wildfire safety, prevention, and emergency response information.
          
Provide clear, concise information about:
- Wildfire prevention and safety measures
- Evacuation procedures and preparation
- Emergency response guidelines
- Current wildfire conditions and risks
- Environmental factors affecting wildfires
- Resources for wildfire victims

Keep responses focused on wildfire-related topics. Maintain a helpful, informative tone while emphasizing safety. Use bullet points for clarity when appropriate. If asked about topics outside wildfire safety, politely redirect to relevant information.`
        },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const reply = response.choices[0].message.content;
    
    res.json({
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Error processing chat message",
      details: error.message || "An unknown error occurred with the chat service"
    });
  }
});

// Handle errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: "File too large",
        details: "Maximum file size is 5MB"
      });
    }
    return res.status(400).json({
      error: "File upload error",
      details: err.message
    });
  }
  
  console.error(err);
  res.status(500).json({
    error: "Server error",
    details: err.message
  });
});

// Keep the old endpoint for backward compatibility
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
      model: "gpt-4o-mini",
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
