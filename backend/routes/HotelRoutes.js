const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { auth, authorizeRoles } = require('../middleware/auth'); // Import auth middleware

// @route   GET /api/hotels
// @desc    Get all hotels (Publicly accessible for display)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel by ID (Publicly accessible)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ msg: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Hotel not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/hotels
// @desc    Add a new hotel (Admin or Agent)
// @access  Private (Admin or Agent)
router.post('/', auth, authorizeRoles('admin', 'agent'), async (req, res) => {
    const { name, description, image, location, pricePerNight, amenities, rating } = req.body;

    try {
        // Check if a hotel with the same name already exists
        let hotel = await Hotel.findOne({ name });
        if (hotel) {
            return res.status(400).json({ msg: 'Hotel with this name already exists' });
        }

        hotel = new Hotel({
            name,
            description,
            image,
            location,
            pricePerNight,
            amenities,
            rating,
            agent: req.user.id // Assign the current user as the agent
        });

        await hotel.save();
        res.status(201).json({ msg: 'Hotel added successfully', hotel });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel details (Admin or Owner Agent)
// @access  Private (Admin/Agent)
router.put('/:id', auth, authorizeRoles('admin', 'agent'), async (req, res) => {
    const { name, description, image, location, pricePerNight, amenities, rating } = req.body;

    // Build hotel object
    const hotelFields = {};
    if (name) hotelFields.name = name;
    if (description) hotelFields.description = description;
    if (image) hotelFields.image = image;
    if (location) hotelFields.location = location;
    if (pricePerNight) hotelFields.pricePerNight = pricePerNight;
    if (amenities) hotelFields.amenities = amenities;
    if (rating) hotelFields.rating = rating;

    try {
        let hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ msg: 'Hotel not found' });
        }

        // Check for duplicate name if name is being updated
        if (name && name !== hotel.name) {
            const existingHotel = await Hotel.findOne({ name });
            if (existingHotel) {
                return res.status(400).json({ msg: 'Another hotel with this name already exists' });
            }
        }

        // Check ownership if not admin
        if (req.user.role !== 'admin' && hotel.agent.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to update this hotel' });
        }

        hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: hotelFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json({ msg: 'Hotel updated successfully', hotel });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Hotel not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete a hotel (Admin or Owner Agent)
// @access  Private (Admin/Agent)
router.delete('/:id', auth, authorizeRoles('admin', 'agent'), async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ msg: 'Hotel not found' });
        }

        // Check ownership if not admin
        if (req.user.role !== 'admin' && hotel.agent.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this hotel' });
        }

        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Hotel removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Hotel not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
