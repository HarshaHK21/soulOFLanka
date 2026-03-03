// File: backend/routes/testimonialRoutes.js

const express = require('express');
const router = express.Router();

// This will be our database model
// const Testimonial = require('../models/testimonialModel');

// --- Temporary Data for Testing ---
// Use this until you connect your database.
const testimonials = [
    {
        id: 1,
        name: 'Emma Thompson',
        quote: 'Exploring Sri Lanka with this platform was a breeze! The Activity Map helped us discover Sigiriya, and the booking process was seamless.',
        rating: 5,
        avatar: 'http://localhost:3000/assets/avatar-1.jpg',
    },
    {
        id: 2,
        name: 'Ravi Patel',
        quote: 'The ChatBot was a lifesaver, suggesting a perfect itinerary for Kandy and Ella. Highly recommend for first-time visitors!',
        rating: 4,
        avatar: 'http://localhost:3000/assets/avatar-2.jpg',
    },
    {
        id: 3,
        name: 'Sophie Nguyen',
        quote: 'Booking our stay at Cinnamon Grand Colombo was so easy, and the Blog Section inspired our Galle Fort visit. Amazing experience!',
        rating: 5,
        avatar: 'http://localhost:3000/assets/avatar-3.jpg',
    },
];
// --- End of Temporary Data ---


// @desc    Fetch all testimonials
// @route   GET /api/testimonials
router.get('/', (req, res) => {
  // When you have a database connected, you will use this code instead:
  // const testimonials = await Testimonial.find({});
  // res.json(testimonials);

  // For now, we send back the temporary data
  res.json(testimonials);
});

// @desc    Create a new testimonial
// @route   POST /api/testimonials
router.post('/', (req, res) => {
    // This is where you'll handle adding a new review from the User Dashboard.
    // The data would come from the request body (req.body).
    const { name, quote, rating } = req.body;
    
    // When you have a database connected, you will use this code:
    // const newTestimonial = new Testimonial({ name, quote, rating });
    // const createdTestimonial = await newTestimonial.save();
    // res.status(201).json(createdTestimonial);

    console.log('New testimonial received (but not saved yet):', req.body);
    res.status(201).send('Testimonial received!');
});


module.exports = router;