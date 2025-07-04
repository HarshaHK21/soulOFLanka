import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
}

const hotels: Hotel[] = [
  {
    id: 1,
    name: 'Cinnamon Grand Colombo',
    location: 'Colombo',
    description: 'Luxury hotel in the heart of Colombo with stunning city views.',
    price: 150,
    image: '/assets/Cinnamon Grand Colombo.jpg',
  },
  {
    id: 2,
    name: 'Jetwing Lighthouse Galle',
    location: 'Galle',
    description: 'Coastal retreat with elegant rooms near the historic Galle Fort.',
    price: 120,
    image: '/assets/Jetwing Lighthouse Galle.jpg',
  },
  {
    id: 3,
    name: 'Heritance Kandalama',
    location: 'Dambulla',
    description: 'Eco-friendly resort nestled in the cultural triangle of Dambulla.',
    price: 180,
    image: '/assets/Heritance Kandalama.jpg',
  },
];

const HotelBooking: React.FC = () => {
  const [search, setSearch] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.gtag?.('event', 'search', { event_category: 'HotelBooking', event_label: search });
  };

  return (
    <section className="hotel-booking-section py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Book Your Stay
        </h2>
        <div className="search-form bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Enter city (e.g., Colombo)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700">
                Check-In
              </label>
              <input
                id="check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700">
                Check-Out
              </label>
              <input
                id="check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                Guests
              </label>
              <input
                id="guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>
          </form>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-full text-base font-medium hover:bg-blue-700 transition duration-300"
            onClick={handleSearch}
          >
            Search Hotels
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={hotel.image}
                alt={`${hotel.name} hotel exterior`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-2">{hotel.location}</p>
                <p className="text-gray-600 mb-4">{hotel.description}</p>
                <p className="text-blue-600 font-medium mb-4">${hotel.price} / night</p>
                <Link
                  to={`/booking/${hotel.id}`}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-base font-medium hover:bg-blue-700 transition duration-300"
                  onClick={() =>
                    window.gtag?.('event', 'click', {
                      event_category: 'HotelBooking',
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
      </div>
    </section>
  );
};

export default HotelBooking;