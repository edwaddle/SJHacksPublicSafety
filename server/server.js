require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
