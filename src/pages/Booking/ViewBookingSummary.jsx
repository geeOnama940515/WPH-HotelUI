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
    console.log('token', token);  
    if (!token) {
      setError('No booking token provided.');
      setLoading(false);
      return;
    }
    fetchBooking(token);
  }, [searchParams]);

  const fetchBooking = async (token) => {
    setLoading(true);
    setError('');
    try {
      const booking = await getBookingByToken(token);
      if (!booking || !booking.data) {
        setError('Booking not found or invalid token.');
        setLoading(false);
        return;
      }
      const b = booking.data;
      setBookingData({
        guestFullName: b.guestName,
        emailAddress: b.emailAddress,
        phoneNumber: b.phone,
        address: b.address,
        numberOfGuests: b.guests,
        specialRequests: b.specialRequests,
        roomType: b.roomId,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
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
          <BookingSummary bookingData={bookingData} onConfirm={null} onBack={null} />
        )}
      </div>
    </div>
  );
}

export default ViewBookingSummary; 