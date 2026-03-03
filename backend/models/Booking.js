// backend/src/models/Booking.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// This is the Mongoose schema that maps to our MongoDB collection
const BookingSchema = new Schema({
  hotel: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel', // This links the booking to a specific Hotel document
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' // We'll use this once user login is complete
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  bookingStatus: { 
    type: String, 
    enum: ['confirmed', 'pending', 'cancelled'], 
    default: 'confirmed' 
  },
}, { timestamps: true }); // `timestamps` automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Booking', BookingSchema);