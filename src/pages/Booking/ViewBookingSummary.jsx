import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookingSummary from '../../components/BookingSummary/BookingSummary';
import { getBookingByToken } from '../../services/bookingService';

function ViewBookingSummary() {
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('bookingtoken');
    console.log('token-from-url', token);  
    if (!token) {
      console.log('no token',token);
      setError('No booking token provided.');
      setLoading(false);
      return;
    }
    fetchBooking(token);
  }, [searchParams]);

  const fetchBooking = async (token) => {
    console.log('fetchBooking', token);
    setLoading(true);
    setError('');
    try {
      const booking = await getBookingByToken(token);
      console.log('booking-data', booking);
      if (!booking) {
        setError('Booking not found or invalid token.');
        setLoading(false);
        return;
      }
      setBookingData({
        guestFullName: booking.guestName,
        emailAddress: booking.emailAddress,
        phoneNumber: booking.phone,
        address: booking.address,
        numberOfGuests: booking.guests,
        specialRequests: booking.specialRequests,
        roomType: booking.roomId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        // Add any other fields as needed
      });
    } catch (err) {
      setError('Booking not found or invalid token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Booking Summary</h1>
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">Loading...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow text-center">{error}</div>
        ) : (
          <BookingSummary bookingData={bookingData} onConfirm={null} onBack={null} isViewOnly={true} />
        )}
      </div>
    </div>
  );
}

export default ViewBookingSummary; 