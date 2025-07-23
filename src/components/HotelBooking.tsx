import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Hotel {
  _id: string; // MongoDB's default ID is _id
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
}

const HotelBooking: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]); // State to store hotels
  const [search, setSearch] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotels from the backend when the component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels'); // Your backend API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Hotel[] = await response.json();
        setHotels(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []); // Empty dependency array means this runs once on mount

  const filteredHotels = hotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(search.toLowerCase()) ||
    hotel.name.toLowerCase().includes(search.toLowerCase()) // Also allow searching by hotel name
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you might want to send these search parameters to the backend
    // to perform server-side filtering, especially for larger datasets.
    // For now, filtering is done on the client side after fetching all hotels.
    window.gtag?.('event', 'search', { event_category: 'HotelBooking', event_label: search });
  };

  if (loading) {
    return <div className="text-center py-12">Loading hotels...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  return (
    <section className="hotel-booking-section py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Discover Our Hotels
        </h2>
        <div className="search-form bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination / Hotel Name
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Enter city or hotel name"
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
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel._id} // Use _id from MongoDB
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
                    to={`/booking/${hotel._id}`} // Use _id for routing
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
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No hotels found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelBooking;