import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/ChatGPT Image Jun 4, 2025, 02_33_57 PM.png" 
              alt="WPH Hotel Logo" 
              className="h-12"
            />
            <span className="text-2xl font-bold text-gray-800">WPH - HOTEL</span>
          </Link>

          {/* Hamburger menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600"></div>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
            <Link to="/rooms" className="nav-link">Book Now</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            
            {/* User menu - shown as dropdown or separate section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {user ? (
                <>
                  <Link to="/my-bookings" className="nav-link text-sm">My Bookings</Link>
                  {user.isAdmin && <Link to="/admin" className="nav-link text-sm">Admin</Link>}
                  <button onClick={logout} className="nav-link text-sm">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col space-y-4">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Rooms</Link>
            <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            
            {/* User menu for mobile */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <Link to="/my-bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                  {user.isAdmin && <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="nav-link text-left">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;