import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">WPH Hotel</Link>
          <div className="flex space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                {user.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
                <button onClick={logout} className="nav-link">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="nav-link">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header