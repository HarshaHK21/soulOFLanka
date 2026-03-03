import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import ActivityMap from './ActivityMap';
import HotelSection from './HotelSection';
import BlogSection from './BlogSection';
import TestimonialSection from './TestimonialSection';
import { AuthContext } from './context/AuthContext'; 

// Sample hotel data (replace with API data later) - Moved here from App.tsx
const hotels = [
  {
    id: 1,
    name: 'Cinnamon Grand Colombo',
    description: 'Luxury hotel in the heart of Colombo with stunning city views.',
    image: '/assets/cinnamon-grand-colombo.jpg', // updated image path
    location: 'Colombo',
  },
  // Add more hotel data as needed
  {
    id: 2,
    name: 'Heritance Kandalama',
    description: 'An architectural marvel blending with nature, near Sigiriya.',
    image: '/assets/Heritance-Kandalama.jpg',
    location: 'Dambulla',
  },
  {
    id: 3,
    name: 'Jetwing Lighthouse Galle',
    description: 'Iconic Geoffrey Bawa-designed hotel overlooking the Indian Ocean.',
    image: '/assets/Jetwing Lighthouse Galle.jpg',
    location: 'Galle',
  },
];


const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  // Ensure authContext is not null before destructuring.
  // In a real app, you might handle loading states or redirect if context is unexpectedly null.
  // For now, we'll assert it's not null since App.tsx ensures AuthProvider wraps Home.
  const { user } = authContext!; 

  return (
    <>
      <HeroSection />
      <section className="features-section py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight animate-[fadeIn_1s_ease-in-out]">
            Explore Our Services
          </h2>
          {user && (
            <p className="text-center text-lg text-gray-700 mb-8">Hello, {user.username} ({user.role})! Welcome back to Soul of Sri Lanka.</p>
          )}
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
                link: '/hotels', // Changed to /hotels to show all hotels
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
                className={`feature-card p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]`}
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
      
    </>
  );
};

export default Home;
