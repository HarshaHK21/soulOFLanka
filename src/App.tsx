import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ActivityMap from './components/ActivityMap';
import HotelBooking from './components/HotelBooking';
import ChatBot from './components/ChatBot';
import BlogSection from './components/BlogSection';
import Visa from './components/Visa';
import HotelSection from './components/HotelSection';
import TestimonialSection from './components/TestimonialSection';
import AuthSection from './components/AuthSection';
import './styles/App.css';


// Sample hotel data (replace with API data later)
const hotels = [
 // ...existing code...
{
  id: 1,
  name: 'Cinnamon Grand Colombo',
  description: 'Luxury hotel in the heart of Colombo with stunning city views.',
  image: '/assets/cinnamon-grand-colombo.jpg', // updated image path
  location: 'Colombo',
},
// ...existing code...
  {
    id: 2,
   name: 'Yala National Park',
    description: 'Famous wildlife sanctuary known for leopards, elephants, and diverse birdlife.',
    image: '/assets/yala-national-park.jpg',
    location: 'Southeast Sri Lanka',
  },
  {
    id: 3,
    name: 'Ambuluwawa Tower',
    description: 'Unique multi-religious tower offering panoramic views of the surrounding mountains and valleys.',
    image: '/assets/ambuluwawa-tower.jpg',
    location: 'Gampola',
  },
  {
     id: 4,
    name: "Adam's Peak",
    description: "A sacred mountain and popular pilgrimage site with breathtaking sunrise views.",
    image: '/assets/adams-peak.jpg',
    location: 'Central Sri Lanka',
  },
  {
    id: 5,
    name: 'Sigiriya',
    description: 'Ancient rock fortress and UNESCO World Heritage Site with stunning frescoes.',
    image: '/assets/sigiriya.jpg',
    location: 'Matale District',
  },
  {id: 6,
    name: 'Galle Fort',
    description: 'Historic fort built by the Portuguese and Dutch, known for its colonial architecture.',
    image: '/assets/galle-fort.jpg',
    location: 'Galle',
  },
    {
    id: 9,
    name: 'Garadi Ella',
    description: 'A beautiful and lesser-known waterfall surrounded by lush greenery.',
    image: '/assets/garadi-ella.jpg',
    location: 'Ratnapura District',
  },
   {
    id: 10,
    name: 'Horton Plains',
    description: 'A protected area in the central highlands, famous for its rich biodiversity and World’s End cliff.',
    image: '/assets/horton-plains.jpg',
    location: 'Nuwara Eliya District',
  }, 
   {
    id: 11,
    name: 'Ramboda Waterfall',
    description: 'A stunning multi-tiered waterfall located in the scenic hills of Ramboda.',
    image: '/assets/ramboda-waterfall.jpg',
    location: 'Nuwara Eliya District',
  },
  {
    id: 12,
    name: 'Ella Rock',
    description: 'A popular hiking destination offering panoramic views of the surrounding hills and valleys.',
    image: '/assets/ella-rock.jpg',
    location: 'Ella',
  },
  {
    id: 13,
    name: 'Kandy Lake',
    description: 'A serene lake in the heart of Kandy, perfect for leisurely walks and boat rides.',
    image: '/assets/kandy-lake.jpg',
    location: 'Kandy',
  },
 
 
  {
    id: 14,

    name: 'Polonnaruwa',
    description: 'An ancient city and UNESCO World Heritage Site with well-preserved ruins of palaces and temples.',
    image: '/assets/polonnaruwa.jpg',       
    location: 'Polonnaruwa District',
  },
  
];

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="app-container bg-gray-100 min-h-screen">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<ActivityMap />} />
            <Route path="/booking" element={<HotelBooking />} />
            <Route path="/blog" element={<BlogSection />} />
            <Route path="/visa" element={<Visa />} />
            <Route path="/hotels" element={<HotelSection hotels={hotels} />} />
            <Route path="/login" element={<AuthSection />} />
            <Route path="/signup" element={<AuthSection />} />
          </Routes>
        </main>
        <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-[pulse_2s_ease-in-out_infinite] z-50"
            aria-label="Open Travel Assistant Chat"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </button>
        )}
      </div>
    </Router>
  );
};

const Home: React.FC = () => (
  <>
    <HeroSection />
    <section className="features-section py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight animate-[fadeIn_1s_ease-in-out]">
          Explore Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Activity Map',
              description: 'Discover top attractions and activities across Sri Lanka.',
              icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z',
              link: '/map',
            },
            {
              title: 'Hotel Booking',
              description: 'Find and book the best accommodations for your trip.',
              icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
              link: '/hotels',
            },
            {
              title: 'Travel Blog',
              description: 'Get inspired with tips, guides, and stories from Sri Lanka.',
              icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2z',
              link: '/blog',
            },
          ].map((feature, index) => (
            <Link
              to={feature.link}
              key={feature.title}
              className="feature-card p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]"
            >
              <svg
                className="w-12 h-12 text-green-600 mb-4 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
    <TestimonialSection />
    <section className="hotels-section py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          Featured Hotels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className="hotel-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]"
            >
             <img
             src={hotel.image}
             alt={`${hotel.name} hotel exterior`}
             style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
            />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{hotel.name}</h3>
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
        <div className="text-center mt-8">
          <Link
            to="/hotels"
            className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            View All Hotels
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default App;