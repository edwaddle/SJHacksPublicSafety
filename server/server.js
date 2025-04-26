require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');


// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
