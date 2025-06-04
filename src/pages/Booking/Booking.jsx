import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../../components/BookingForm/BookingForm';
import BookingSummary from '../../components/BookingSummary/BookingSummary';
import { rooms } from '../../data/roomsData';

function Booking() {
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = parseInt(searchParams.get('room'));
    const selectedRoom = rooms.find(r => r.id === roomId);
    setRoom(selectedRoom);
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/booking');
    }
  }, [user, navigate]);

  const handleBookingSubmit = (details) => {
    setBookingDetails(details);
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    try {
      // Here you would make an API call to save the booking
      setStep(3);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <BookingForm room={room} onSubmit={handleBookingSubmit} />
            </div>
            <div>
              <BookingSummary room={room} booking={bookingDetails} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Confirm Your Booking</h2>
            <BookingSummary room={room} booking={bookingDetails} />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm and Pay
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for choosing WPH Hotel. Your booking has been confirmed.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Please select a room from the rooms page first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Book Your Stay</h1>
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">1</span>
            <span>Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300" />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">2</span>
            <span>Review</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300" />
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">3</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>
      {renderStepContent()}
    </div>
  );
}

export default Booking;