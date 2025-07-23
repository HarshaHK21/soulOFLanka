import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'; // Make sure Navigate is imported
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

// --- AuthContext related imports and definitions ---
// Define the shape of your user object
interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'vendor' | 'admin'; // Ensure 'admin' role is defined here
  businessName?: string; // Optional business name for vendors
}

// Define the shape of your AuthContext value
interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (newToken: string, newUser: UserData) => void;
  logout: () => void;
}

// Create the AuthContext - THIS IS CRUCIAL FOR AuthSection.tsx
export const AuthContext = createContext<AuthContextType | null>(null);

// --- PrivateRoute component ---
// This component will protect routes that require authentication
const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('user' | 'vendor' | 'admin')[] }> = ({ children, allowedRoles }) => {
  const authContext = useContext(AuthContext);
  // const navigate = useNavigate(); // useNavigate is not needed here as Navigate component is used

  // Handle case where AuthContext might not be available (shouldn't happen if setup correctly)
  if (!authContext) {
    console.error("AuthContext not found in PrivateRoute. Ensure App is wrapped correctly.");
    return <div>Loading authentication...</div>; // Or a proper error boundary/fallback
  }

  const { user, token } = authContext;

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a forbidden page or home if role is not allowed
    return <Navigate to="/" replace />; // Or a dedicated /forbidden page
  }

  // If authenticated and role is allowed, render the children components
  return <>{children}</>;
};

// --- Placeholder Dashboard Components (move to separate files later) ---
const Dashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const { user, logout } = authContext!; // Assert non-null as PrivateRoute ensures context exists

    return (
        <div className="py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard!</h1>
            {user && (
                <p className="text-xl text-gray-700">Hello, {user.username} ({user.role})!</p>
            )}
            <p className="text-lg text-gray-600 mt-2">This is a protected page for logged-in users.</p>
            <button
                onClick={logout}
                className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-300"
            >
                Logout
            </button>
        </div>
    );
};

const VendorDashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const { user, logout } = authContext!; // Assert non-null

    return (
        <div className="py-16 text-center bg-yellow-50">
            <h1 className="text-4xl font-bold mb-4 text-orange-700">Welcome to Vendor Dashboard!</h1>
            {user && (
                <>
                    <p className="text-xl text-gray-700">Hello, {user.username} ({user.role})!</p>
                    {user.businessName && (
                        <p className="text-lg text-gray-600 mt-2">Your Business: {user.businessName}</p>
                    )}
                </>
            )}
            <p className="text-lg text-gray-600 mt-2">This page is only accessible by Vendors.</p>
            <button
                onClick={logout}
                className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-300"
            >
                Logout
            </button>
        </div>
    );
};

// Import AdminDashboard (assuming you've moved it to src/components/AdminDashboard.tsx)
//import AdminDashboard from './components/AdminDashboard';


// Sample hotel data (replace with API data later)
const hotels = [
  {
    id: 1,
    name: 'Cinnamon Grand Colombo',
    description: 'Luxury hotel in the heart of Colombo with stunning city views.',
    image: '/assets/cinnamon-grand-colombo.jpg', // updated image path
    location: 'Colombo',
  },
 
];

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null); // State to hold user data
  const [token, setToken] = useState<string | null>(null); // State to hold JWT token
  const [loadingAuth, setLoadingAuth] = useState(true); // To manage auth loading state

  // Load token and user from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as UserData); // Parse and cast
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoadingAuth(false); // Finished loading auth state
  }, []);

  // Function to set user and token (passed to AuthContext)
  const login = (newToken: string, newUser: UserData) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Function to clear user and token (passed to AuthContext)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // If still loading auth state, show a simple loading message or spinner
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Loading application...
      </div>
    );
  }

  return (
    // Wrap the entire application with AuthContext.Provider
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Router>
        <div className="app-container bg-gray-100 min-h-screen">
          <Navbar /> {/* Navbar will now have access to AuthContext */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<ActivityMap />} />
              <Route path="/booking" element={<HotelBooking />} />
              <Route path="/blog" element={<BlogSection />} />
              <Route path="/visa" element={<Visa />} />
              <Route path="/hotels" element={<HotelSection hotels={hotels} />} />
              {/* Auth routes */}
              <Route path="/login" element={<AuthSection />} />
              <Route path="/signup" element={<AuthSection />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute allowedRoles={['user', 'vendor', 'admin']}> {/* Both can access dashboard */}
                  <Dashboard />
                </PrivateRoute>
              } />
              {/* For vendors only */}
              <Route path="/vendor-dashboard" element={
                <PrivateRoute allowedRoles={['vendor', 'admin']}>
                  <VendorDashboard />
                </PrivateRoute>
              } />
              {/* Admin Dashboard Route 
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } /> */}

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
    </AuthContext.Provider>
  );
};

// --- Home Component (from your previous App.tsx) ---
const Home: React.FC = () => {
  const authContext = useContext(AuthContext); // Use AuthContext in Home to display user info
  const { user } = authContext!; // Assert non-null

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
      <section className="hotels-section py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
            Featured Hotels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className={`hotel-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_1s_ease-in-out] delay-[${index * 200}ms]`}
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
};

export default App;
