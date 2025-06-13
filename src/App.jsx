import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import all components and pages
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Rooms from './pages/Rooms/Rooms';
import RoomDetails from './pages/RoomDetails/RoomDetails';
import Booking from './pages/Booking/Booking';
import Auth from './pages/Auth/Auth';
import Admin from './pages/Admin/Admin';
import MyBookings from './pages/MyBookings/MyBookings';
import Contact from './pages/Contact/Contact';
import { AuthProvider } from './context/AuthContext';

/**
 * Main App component that sets up routing and global context
 * This is the root component that wraps the entire application
 */
function App() {
  return (
    // AuthProvider provides authentication context to all child components
    <AuthProvider>
      <Router>
        {/* Main layout with header, content area, and footer */}
        <div className="flex flex-col min-h-screen">
          {/* Header component with navigation */}
          <Header />
          
          {/* Main content area that grows to fill available space */}
          <main className="flex-grow">
            {/* Define all application routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/room-details/:id" element={<RoomDetails />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </main>
          
          {/* Footer component */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App