const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Hotel names should probably be unique
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or path to the image
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pricePerNight: { // Example: Add a price field
        type: Number,
        required: true,
        min: 0
    },
    amenities: { // Example: Array of strings for amenities
        type: [String],
        default: []
    },
    rating: { // Example: Rating from 1 to 5
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hotel', HotelSchema);
