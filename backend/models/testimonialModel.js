// File: backend/models/testimonialModel.js

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  avatar: {
    type: String,
    required: false, // Avatar can be optional
    default: '/assets/avatar-default.jpg',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;