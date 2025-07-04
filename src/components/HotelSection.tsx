import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
}

interface HotelSectionProps {
  hotels: Hotel[];
}

const HotelSection: React.FC<HotelSectionProps> = ({ hotels }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === 'All' || hotel.location === locationFilter)
  );

  const locations = ['All', ...Array.from(new Set(hotels.map((hotel) => hotel.location)))];

  return (
    <section className="hotels-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          Discover Our Hotels
        </h2>
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
            {filteredHotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="hotel-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]"
              >
                <img
                  src={hotel.image}
                  alt={`${hotel.name} hotel exterior`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{hotel.location}</p>
                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  <Link
                    to="/booking"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    onClick={() =>
                      window.gtag?.('event', 'click', {
                        event_category: 'HotelSection',
                        event_label: `Book ${hotel.name}`,
                      })
                    }
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelSection;