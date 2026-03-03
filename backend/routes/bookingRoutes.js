// backend/src/routes/bookingRoutes.js

const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

const router = express.Router();

// Route: POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.body;

    if (!hotelId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'Missing required booking information.' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    
    if (timeDifference <= 0) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
    const totalPrice = numberOfNights * hotel.pricePerNight;
    
    const newBooking = new Booking({
      hotel: hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      user: '60c72b2f9b1d8c1e4c7b8e3a' 
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({ message: 'Booking successful!', booking: savedBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error while creating booking.', error: error.message });
  }
});

// GET /api/bookings/user/:userId - Fetch bookings using a pipeline
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userBookings = await Booking.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: 'hotel',
          foreignField: '_id',
          as: 'hotelDetails'
        }
      },
      {
        $unwind: '$hotelDetails'
      },
      {
        $project: {
          _id: 1,
          checkIn: 1,
          checkOut: 1,
          bookingStatus: 1,
          createdAt: 1,
          hotel: {
            _id: '$hotelDetails._id',
            name: '$hotelDetails.name'
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    if (!userBookings || userBookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json(userBookings);
    
  } catch (error) {
    console.error('Error fetching user bookings with pipeline:', error);
    res.status(500).json({ message: 'Server error while fetching bookings.', error: error.message });
  }
});

// GET /api/bookings/agent-stats/:agentId
// Calculate stats for the agent dashboard
router.get('/agent-stats/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;

        // 1. Total Listings: Count hotels owned by this agent
        const totalListings = await Hotel.countDocuments({ agent: agentId });

        // 2. Get IDs of these hotels to query bookings
        const agentHotels = await Hotel.find({ agent: agentId }).select('_id');
        const hotelIds = agentHotels.map(h => h._id);

        // 3. Query Bookings for these hotels
        // We can do this with efficient aggregations or simple counts depending on scale. 
        // Simple counts/finds are fine for now.

        const totalBookings = await Booking.countDocuments({ hotel: { $in: hotelIds } });
        
        const pendingRequests = await Booking.countDocuments({ 
            hotel: { $in: hotelIds },
            bookingStatus: 'pending' 
        });

        // 4. Total Earnings: Sum of totalPrice for confirmed bookings
        const earningsAgg = await Booking.aggregate([
            { 
                $match: { 
                    hotel: { $in: hotelIds }, 
                    bookingStatus: 'confirmed' 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: "$totalPrice" } 
                } 
            }
        ]);
        const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

        res.json({
            totalListings,
            totalBookings,
            pendingRequests,
            totalEarnings
        });

    } catch (err) {
        console.error('Error fetching agent stats:', err);
        res.status(500).json({ message: 'Server error calculating stats' });
    }
});

module.exports = router;