import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast, toastMessages, confirmAction, confirmMessages } from '../../utils/notifications';
import Modal from '../Modal/Modal';
import './Header.css';

/**
 * Header component with navigation and responsive mobile menu
 * Shows different navigation options based on user authentication status
 */
function Header() {
  const { user, logout } = useAuth(); // Get authentication state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle state
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Logout confirmation modal

  /**
   * Toggle mobile menu visibility
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Handle logout with confirmation
   */
  const handleLogout = async () => {
    try {
      await logout();
      showToast.success(toastMessages.logoutSuccess);
    } catch (error) {
      showToast.error('Logout failed. Please try again.');
    }
  };

  /**
   * Show logout confirmation modal
   */
  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and brand name */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/ChatGPT Image Jun 4, 2025, 02_33_57 PM.png" 
                alt="WPH Hotel Logo" 
                className="h-12"
              />
              <span className="text-2xl font-bold text-gray-800">WPH - HOTEL</span>
            </Link>

            {/* Mobile hamburger menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </button>

            {/* Desktop navigation menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/rooms" className="nav-link">Rooms</Link>
              <Link 
                to="/booking" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Book Now
              </Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              
              {/* Admin section - only show if user is admin */}
              {user?.isAdmin && (
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <Link to="/my-bookings" className="nav-link text-sm">My Bookings</Link>
                  <Link to="/admin" className="nav-link text-sm">Admin</Link>
                  <button onClick={showLogoutConfirmation} className="nav-link text-sm">Logout</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile navigation menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Rooms</Link>
              <Link 
                to="/booking" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              
              {/* Admin menu for mobile */}
              {user?.isAdmin && (
                <div className="pt-4 border-t border-gray-200">
                  <Link to="/my-bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                  <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                  <button onClick={showLogoutConfirmation} className="nav-link text-left">Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
      >
        <p className="text-gray-600">
          Are you sure you want to log out? You will need to sign in again to access admin features.
        </p>
      </Modal>
    </>
  );
}

export default Header;