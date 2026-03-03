// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Corrected import path for AuthProvider, AuthContext, and UserData
import { AuthProvider, AuthContext, UserData } from './components/context/AuthContext'; 

import Navbar from './components/Navbar';
import ActivityMap from './components/ActivityMap';
import ChatBot from './components/ChatBot';
import BlogSection from './components/BlogSection';
import Visa from './components/Visa';
import HotelSection from './components/HotelSection';
import TestimonialSection from './components/TestimonialSection';
import AuthSection from './components/AuthSection';
import ShopPage from './components/ShopPage';
import Home from './components/Home';
import './styles/App.css';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';


// This component will protect routes that require authentication
const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('user' | 'agent' | 'admin')[] }> = ({ children, allowedRoles }) => {
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


const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true); 

  useEffect(() => {
    setLoadingApp(false); 
  }, []);

  if (loadingApp) {
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
              <Route path="/" element={<Home />} /> 
              <Route path="/map" element={<ActivityMap />} />
              <Route path="/blog" element={<BlogSection />} />
              <Route path="/visa" element={<Visa />} />
              {/* HotelSection no longer receives 'hotels' prop from App */}
              <Route path="/hotels" element={<HotelSection />} /> 
              
              {/* Consolidated Auth route */}
              <Route path="/auth" element={<AuthSection />} />

              {/* Protected Routes */}
              <Route path="/UserDashboard" element={
                <PrivateRoute allowedRoles={['user']}>
                  <UserDashboard />
                </PrivateRoute>
              } />
              {/* For agents only */}
              <Route path="/AgentDashboard" element={
                <PrivateRoute allowedRoles={['agent', 'admin']}>
                  <AgentDashboard />
                </PrivateRoute>
              } />
              {/* Admin Dashboard Route */}
              <Route path="/AdminDashboard" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/HotelSection" element={<HotelSection />} />
              

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



