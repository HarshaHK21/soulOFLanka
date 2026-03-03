// src/components/HotelBookingModal.tsx

import React, { useState } from 'react';

// Define the shape of the Hotel object
interface Hotel {
  _id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  pricePerNight: number;
}

// Define the type for the booking details that will be passed up
interface BookingDetails {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

// Define the props that this modal component will accept
interface HotelBookingModalProps {
  hotel: Hotel;
  // FIX: Added the onConfirm prop to the interface
  onConfirm: (bookingDetails: BookingDetails) => void;
  onClose: () => void;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ hotel, onConfirm, onClose }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      hotelId: hotel._id,
      checkIn,
      checkOut,
      guests,
    });
    
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full m-4 relative transform transition-transform duration-300 scale-95 hover:scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close booking modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">{hotel.name}</h2>
        <p className="text-gray-600 mb-6">{hotel.location}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="check-in" className="block text-sm font-medium text-gray-700">Check-In Date</label>
            <input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="check-out" className="block text-sm font-medium text-gray-700">Check-Out Date</label>
            <input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
            <input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelBookingModal;