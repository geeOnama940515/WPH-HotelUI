import React from 'react';
import './Footer.css';

/**
 * Footer component with copyright information
 * Simple footer that appears at the bottom of all pages
 */
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <p className="text-center">&copy; 2025 Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;