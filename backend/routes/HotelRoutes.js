const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel'); // Correct path to your Hotel model

// @route   GET /api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/hotels
// @desc    Add a new hotel (for initial data population)
// @access  Public (you might want to restrict this in a real app)
router.post('/', async (req, res) => {
  const { name, location, description, price, image } = req.body;

  try {
    const newHotel = new Hotel({
      name,
      location,
      description,
      price,
      image,
    });

    const hotel = await newHotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;