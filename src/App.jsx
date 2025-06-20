import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import Profile from './pages/Profile/Profile';
import { AuthProvider } from './context/AuthContext';
import ViewBookingSummary from './pages/Booking/ViewBookingSummary';

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
              <Route path="/view-booking-summary" element={<ViewBookingSummary />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              {/* Catch-all route - redirect to home for any unmatched routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer component */}
          <Footer />
        </div>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App