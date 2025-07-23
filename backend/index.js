const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// dotenv is loaded via the nodemon script: "nodemon -r dotenv/config index.js"
// so no need for `require('dotenv').config()` here.

const app = express();
const PORT = process.env.PORT || 5000; // Get PORT from .env or default to 5000

// Import Auth Routes
const authRoutes = require('./routes/auth'); // Correct relative path
// Import Hotel Routes
const hotelRoutes = require('./routes/HotelRoutes'); // ADD THIS LINE

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all origins (for development)

// MongoDB Connection String (from .env)
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('Local MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Auth Routes
// All routes in auth.js will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// Define Hotel Routes // ADD THIS BLOCK
// All routes in hotelRoutes.js will be prefixed with /api/hotels
app.use('/api/hotels', hotelRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});