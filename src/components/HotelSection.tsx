import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelBookingModal from './HotelBookingModal';
import PaymentMethodModal from './PaymentMethodModal';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  pricePerNight: number;
  amenities: string[];
  rating: number;
  dateAdded: string;
}

// Add the new prop to the interface
interface HotelSectionProps {
  initialLocation?: string;
}

// Accept the new prop
const HotelSection: React.FC<HotelSectionProps> = ({ initialLocation }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  // Use the initialLocation prop to set the initial state
  const [locationFilter, setLocationFilter] = useState(initialLocation || 'All');

  // State for managing the booking form modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // State for storing booking details after confirmation from the first modal
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // State for managing the payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api/hotels';

  // Function to generate USD price starting from $100 upwards
  const generateUSDPrice = (lkrAmount: number): number => {
    // Use a base price of $100 and add variation based on LKR amount
    const baseUSD = 100;
    const variation = Math.floor(lkrAmount / 1000) * 50; // Every 1000 LKR adds $50
    return baseUSD + variation;
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Hotel[]>(API_BASE_URL);
        setHotels(response.data);
      } catch (err: any) {
        console.error('Failed to fetch hotels:', err);
        setError(err.message || 'Failed to load hotels. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // New useEffect hook to react to the initialLocation prop change
  useEffect(() => {
    if (initialLocation) {
      setLocationFilter(initialLocation);
    }
  }, [initialLocation]);

  // Handlers for booking modal
  const handleOpenBookingModal = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHotel(null);
  };

  const handleConfirmBooking = (details: any) => {
    console.log("Booking details confirmed, opening payment modal:", details);
    setBookingDetails(details);
    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedHotel(null);
    setBookingDetails(null);
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === 'All' || hotel.location.toLowerCase() === locationFilter.toLowerCase())
  );
  
  const locations = ['All', ...Array.from(new Set(hotels.map((hotel) => hotel.location)))];

  if (loading) {
    return (
      <section className="hotels-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Loading Hotels...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hotels-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl text-red-600">Oops! Something went wrong.</p>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hotels-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <input
              type="text"
              placeholder="Search hotels by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/2 border-gray-300 rounded-full p-3 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full sm:w-1/4 border-gray-300 rounded-full p-3 focus:ring-green-500 focus:border-green-500 transition duration-200"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          {filteredHotels.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No hotels found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="hotel-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={hotel.image}
                    alt={`${hotel.name} hotel exterior`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/400x256/cccccc/333333?text=Image+Not+Found`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{hotel.location}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{hotel.description}</p>
                    <div className="text-gray-800 font-bold mb-4 text-lg">
                      ${generateUSDPrice(hotel.pricePerNight)}/night
                    </div>
                    <button
                      onClick={() => handleOpenBookingModal(hotel)}
                      className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isBookingModalOpen && selectedHotel && (
        <HotelBookingModal
          hotel={selectedHotel}
          onConfirm={handleConfirmBooking}
          onClose={handleCloseBookingModal}
        />
      )}
      
      {isPaymentModalOpen && selectedHotel && bookingDetails && (
        <PaymentMethodModal
          hotel={selectedHotel}
          bookingDetails={bookingDetails}
          onClose={handleClosePaymentModal}
        />
      )}
    </>
  );
};

export default HotelSection;



