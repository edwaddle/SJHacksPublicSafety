require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const OpenAI = require("openai");

// Create Express app
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Get camera status endpoint
app.get("/api/camera/status", (req, res) => {
  res.json({
    status: "operational",
    cameras: [
      { id: 1, name: "Camera 1", status: "active" },
      { id: 2, name: "Camera 2", status: "active" }
    ]
  });
});

// Analyze image endpoint
app.post("/api/camera/analyze", upload.single("image"), async (req, res) => {
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
    
    // Format the response
    const formattedResult = {
      detection: result,
      timestamp: new Date().toISOString(),
      confidence: result === 'UNCERTAIN' ? 'low' : 'high',
      details: {
        imageSize: req.file.size,
        imageType: req.file.mimetype,
        fileName: req.file.originalname
      }
    };

    res.json(formattedResult);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ 
      error: "Error analyzing image",
      details: error.message
    });
  }
});

// Error handling middleware
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
  
  // Handle file type errors
  if (err.message.includes('Only JPG and PNG images are allowed')) {
    return res.status(400).json({
      error: "Invalid file type",
      details: "Only JPG and PNG images are allowed"
    });
  }
  
  // Ensure all errors return JSON
  res.status(500).json({
    error: "Internal server error",
    details: err.message
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found"
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
