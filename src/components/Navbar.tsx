import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext!;

  const linkStyle =
  "relative block px-4 py-2 text-white transition duration-300 hover:text-green-200 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-green-300 after:transition-all after:duration-300 hover:after:w-full";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
<nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-700 to-green-500 shadow-md">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
    {/* py-5 makes navbar taller (instead of py-3) */}
{/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center"
          >
            <img src="/logo192.png" className="w-8 h-8 mr-2" alt="Logo" />
            Soul Of Lanka
          </Link>

          {/* Desktop Menu (lg only, tablet & mobile will use hamburger) */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link to="/" className={linkStyle}>
              Home
            </Link>
            <Link to="/map" className={linkStyle}>
              Activity Map
            </Link>
            <Link to="/hotels" className={linkStyle}>
              Hotels
            </Link>
            <Link to="/blog" className={linkStyle}>
              Blog
            </Link>
            <Link to="/visa" className={linkStyle}>
              Visa
            </Link>
            <Link to="/shop" className={linkStyle}>
              Shop
            </Link>
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link to="/UserDashboard" className={linkStyle}>
                    User Dashboard
                  </Link>
                )}
                {user.role === "agent" && (
                  <Link to="/AgentDashboard" className={linkStyle}>
                     Agent Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/AdminDashboard" className={linkStyle}>
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className={linkStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className={linkStyle}>
                  Login
                </Link>
                <Link to="/auth" className={linkStyle}>
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-green-600 transition z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm my-1 transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile/Tablet Dropdown */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-blue-800 to-green-600 shadow-md rounded-b-2xl overflow-hidden transform transition-all duration-500 ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col py-3 space-y-1 text-center">
            <Link to="/" className={linkStyle} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              to="/map"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Activity Map
            </Link>
            <Link
              to="/hotels"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Hotels
            </Link>
            <Link
              to="/blog"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/visa"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Visa
            </Link>
            <Link
              to="/shop"
              className={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link
                    to="/UserDashboard"
                    className={linkStyle}
                    onClick={() => setMenuOpen(false)}
                  >
                    User Dashboard
                  </Link>
                )}
                {user.role === "agent" && (
                  <Link
                    to="/AgentDashboard"
                    className={linkStyle}
                    onClick={() => setMenuOpen(false)}
                  >
                    Agent Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/AdminDashboard"
                    className={linkStyle}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className={linkStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20"></div>
    </>
  ); 
};

export default Navbar;