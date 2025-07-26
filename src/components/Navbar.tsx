import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext'; // Import AuthContext

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext!; // Assert non-null as App.tsx ensures AuthProvider

  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Soul of Sri Lanka
        </Link>
        <div className="space-x-6">
          <Link to="/" className="relative inline-block text-white transition-colors duration-300 hover:text-green-400 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-green-400 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left"
>
            Home
          </Link>
          <Link to="/map" className="hover:text-yellow-300 transition-colors duration-200">
            Activity Map
          </Link>
          <Link to="/hotels" className="hover:text-yellow-300 transition-colors duration-200">
            Hotels
          </Link>
          <Link to="/blog" className="hover:text-yellow-300 transition-colors duration-200">
            Blog
          </Link>
          <Link to="/visa" className="hover:text-yellow-300 transition-colors duration-200">
            Visa
          </Link>
          {/* Conditional rendering for Login/Signup or Dashboard/Logout */}
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-yellow-300 transition-colors duration-200">
                Dashboard
              </Link>
              {user.role === 'vendor' && (
                <Link to="/vendor-dashboard" className="hover:text-yellow-300 transition-colors duration-200">
                  Vendor Dashboard
                </Link>
              )}
               {/* Link to Admin Dashboard (only if user is an admin) */}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-yellow-300 transition-colors duration-200 font-bold text-red-300">
                  Admin Panel
                </Link>
              )}
              <button onClick={logout} className="hover:text-yellow-300 transition-colors duration-200 bg-transparent border-none text-white cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hover:text-yellow-300 transition-colors duration-200">
                Login
              </Link>
              <Link to="/auth" className="hover:text-yellow-300 transition-colors duration-200">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


