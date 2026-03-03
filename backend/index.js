const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http for socket.io
const { Server } = require('socket.io'); // Import Server from socket.io

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all origins (for development)

// --- Socket.IO Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- MongoDB Connection String (from .env) ---
const mongoURI = process.env.MONGO_URI;

// --- Connect to MongoDB ---
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Atlas connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));


// --- Define Routes ---
const authRoutes = require('./routes/auth'); 
const hotelRoutes = require('./routes/HotelRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes);
// Note: Inquiries route was already used in the original file, ensuring it's here
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/packages', require('./routes/packages'));


// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// --- Start the server ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});