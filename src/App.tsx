// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import AuthProvider and AuthContext from the dedicated context file
import { AuthProvider, AuthContext, UserData } from './components/context/AuthContext'; 

import Navbar from './components/Navbar';
import ActivityMap from './components/ActivityMap';
import HotelBooking from './components/HotelBooking';
import ChatBot from './components/ChatBot';
import BlogSection from './components/BlogSection';
import Visa from './components/Visa';
import HotelSection from './components/HotelSection'; // Keep if you have a separate HotelSection
import TestimonialSection from './components/TestimonialSection';
import AuthSection from './components/AuthSection';
import Home from './components/Home'; // Import the new Home component
import './styles/App.css';
import AdminDashboard from './components/AdminDashboard';

// --- PrivateRoute component ---
// This component will protect routes that require authentication
const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('user' | 'vendor' | 'admin')[] }> = ({ children, allowedRoles }) => {
  const authContext = React.useContext(AuthContext); // Use React.useContext
  
  if (!authContext) {
    // This case should ideally not be reached if AuthProvider is correctly wrapping everything
    console.error("AuthContext not found in PrivateRoute. Ensure App is wrapped correctly.");
    return <div>Loading authentication...</div>; 
  }

  const { user, token } = authContext;

  // If no token or user, redirect to login (or /auth in our case)
  if (!token || !user) {
    return <Navigate to="/auth" replace />; // Redirect to the consolidated auth route
  }

  // If roles are specified, check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a forbidden page or home if role is not allowed
    return <Navigate to="/" replace />; // Or a dedicated /forbidden page
  }

  // If authenticated and role is allowed, render the children components
  return <>{children}</>;
};

// --- Placeholder Dashboard Components (These can stay here or be moved to separate files) ---
const Dashboard: React.FC = () => {
    const authContext = React.useContext(AuthContext);
    const { user, logout } = authContext!; 

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
    const authContext = React.useContext(AuthContext);
    const { user, logout } = authContext!; 

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

// Assuming AdminDashboard is in src/components/AdminDashboard.tsx
//import AdminDashboard from './components/AdminDashboard';


const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Auth state is now managed by AuthProvider, no need for these here
  // const [user, setUser] = useState<UserData | null>(null); 
  // const [token, setToken] = useState<string | null>(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); 

  // This useEffect is no longer needed here as AuthProvider handles it
  useEffect(() => {
    setLoadingAuth(false); // Just set to false directly since AuthProvider handles loading from local storage
  }, []);

  // Login and logout functions are now provided by AuthProvider via context
  // const login = (newToken: string, newUser: UserData) => { ... };
  // const logout = () => { ... };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Loading application...
      </div>
    );
  }

  return (
    // AuthProvider now wraps the Router
    <AuthProvider>
      <Router>
        <div className="app-container bg-gray-100 min-h-screen">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} /> {/* Use the new Home component */}
              <Route path="/map" element={<ActivityMap />} />
              <Route path="/booking" element={<HotelBooking />} />
              <Route path="/blog" element={<BlogSection />} />
              <Route path="/visa" element={<Visa />} />
              {/* HotelSection now receives hotels data from Home component */}
              <Route path="/hotels" element={<HotelSection hotels={[]} />} /> {/* Pass empty array or fetch in HotelSection */}
              
              {/* Consolidated Auth route */}
              <Route path="/auth" element={<AuthSection />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute allowedRoles={['user', 'vendor', 'admin']}>
                  <Dashboard />
                </PrivateRoute>
              } />
              {/* For vendors only */}
              <Route path="/vendor-dashboard" element={
                <PrivateRoute allowedRoles={['vendor', 'admin']}>
                  <VendorDashboard />
                </PrivateRoute>
              } />
              {/* Admin Dashboard Route (uncomment when AdminDashboard component is ready) */}
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

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
    </AuthProvider>
  );
};

export default App;