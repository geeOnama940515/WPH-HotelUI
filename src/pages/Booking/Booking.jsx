import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingForm from '../../components/BookingForm/BookingForm';
import BookingSummary from '../../components/BookingSummary/BookingSummary';
import OtpVerification from '../../components/OtpVerification/OtpVerification';
import { getRooms } from '../../services/roomService';
import { createBooking, verifyBookingOtp, resendBookingOtp, cancelBooking } from '../../services/bookingService';
import { showToast } from '../../utils/notifications';

function Booking() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmingBooking, setConfirmingBooking] = useState(false);
  const [error, setError] = useState('');
  
  // OTP verification state
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);
  
  const navigate = useNavigate();

  // Load rooms from API
  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    // First try to get room from location state (passed from RoomCard)
    if (location.state?.selectedRoom) {
      setSelectedRoom(location.state.selectedRoom);
    } else {
      // Fallback to URL parameter
      const roomId = searchParams.get('room');
      if (roomId && rooms.length > 0) {
        const room = rooms.find(r => r.id === roomId);
        setSelectedRoom(room);
      }
    }
  }, [searchParams, location.state, rooms]);

  const loadRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (formData) => {
    setBookingData(formData);
    setCurrentStep(2);
  };

  /**
   * Handle initial booking creation (triggers OTP)
   */
  const handleInitialBooking = async (finalBookingData) => {
    setConfirmingBooking(true);
    
    try {
      const result = await createBooking(finalBookingData);
      console.log('Initial booking created:', result);
      
      // Extract booking ID from response
      const bookingId = result.bookingId || result.id || result.data?.bookingId || result.data?.id;
      
      if (!bookingId) {
        throw new Error('Booking ID not received from server');
      }
      
      setPendingBookingId(bookingId);
      setCurrentStep(3); // Move to OTP verification step
      showToast.success('Booking created! Please check your email for the verification code.');
    } catch (error) {
      console.error('Initial booking failed:', error);
      showToast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setConfirmingBooking(false);
    }
  };

  /**
   * Handle OTP verification
   */
  const handleOtpVerification = async (bookingId, otpCode) => {
    setIsVerifyingOtp(true);
    
    try {
      const result = await verifyBookingOtp(bookingId, otpCode);
      console.log('OTP verification successful:', result);
      
      showToast.success('Email verified! Your booking is now confirmed.');
      setCurrentStep(4); // Move to final confirmation step
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error; // Re-throw to be handled by OtpVerification component
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Handle OTP resend
   */
  const handleResendOtp = async (bookingId, emailAddress) => {
    try {
      const result = await resendBookingOtp(bookingId, emailAddress);
      console.log('OTP resent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      throw error; // Re-throw to be handled by OtpVerification component
    }
  };

  /**
   * Handle booking cancellation during OTP verification
   */
  const handleCancelBooking = async (bookingId) => {
    setIsCancellingBooking(true);
    
    try {
      const result = await cancelBooking(bookingId);
      console.log('Booking cancelled successfully:', result);
      
      showToast.success('Booking cancelled successfully.');
      
      // Reset to booking form
      setCurrentStep(1);
      setPendingBookingId(null);
      
      return result;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      showToast.error(error.message || 'Failed to cancel booking. Please try again.');
      throw error;
    } finally {
      setIsCancellingBooking(false);
    }
  };

  /**
   * Handle OTP verification cancellation
   */
  const handleCancelOtpVerification = async () => {
    if (pendingBookingId) {
      try {
        await handleCancelBooking(pendingBookingId);
      } catch (error) {
        // Even if cancellation fails, reset the form
        console.error('Cancellation failed, but resetting form anyway:', error);
        setCurrentStep(1);
        setPendingBookingId(null);
        showToast.info('Booking process cancelled. You can start over if needed.');
      }
    } else {
      // No booking ID, just reset
      setCurrentStep(1);
      setPendingBookingId(null);
      showToast.info('Booking process cancelled. You can start over if needed.');
    }
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 lg:space-x-4 overflow-x-auto px-4">
        <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'} whitespace-nowrap`}>
          <span className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm lg:text-base ${
            currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>1</span>
          <span className="font-medium text-sm lg:text-base">Booking Details</span>
        </div>
        <div className="w-8 lg:w-16 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'} whitespace-nowrap`}>
          <span className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm lg:text-base ${
            currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>2</span>
          <span className="font-medium text-sm lg:text-base">Review & Confirm</span>
        </div>
        <div className="w-8 lg:w-16 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'} whitespace-nowrap`}>
          <span className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm lg:text-base ${
            currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>3</span>
          <span className="font-medium text-sm lg:text-base">Email Verification</span>
        </div>
        <div className="w-8 lg:w-16 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-400'} whitespace-nowrap`}>
          <span className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm lg:text-base ${
            currentStep >= 4 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>4</span>
          <span className="font-medium text-sm lg:text-base">Confirmation</span>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingForm 
            selectedRoom={selectedRoom} 
            onSubmit={handleFormSubmit}
          />
        );
      case 2:
        return (
          <BookingSummary 
            bookingData={bookingData}
            onConfirm={handleInitialBooking}
            onBack={handleBackToForm}
            isConfirming={confirmingBooking}
            onOtpRequired={handleInitialBooking}
          />
        );
      case 3:
        return (
          <OtpVerification
            bookingId={pendingBookingId}
            emailAddress={bookingData?.emailAddress}
            onVerified={handleOtpVerification}
            onCancel={handleCancelOtpVerification}
            onResendOtp={handleResendOtp}
            onCancelBooking={handleCancelBooking}
            isCancellingBooking={isCancellingBooking}
          />
        );
      case 4:
        return (
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md text-center">
            <div className="text-green-600 text-4xl lg:text-6xl mb-6">✓</div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
            <p className="text-base lg:text-lg text-gray-600 mb-6">
              Thank you for choosing WPH Hotel. Your booking has been successfully confirmed and verified.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to <strong>{bookingData?.emailAddress}</strong>
              </p>
              {pendingBookingId && (
                <p className="text-xs text-gray-500 mt-2">
                  Booking ID: {pendingBookingId}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Browse More Rooms
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">Book Your Stay</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg">Loading rooms...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">Book Your Stay</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <button
            onClick={loadRooms}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show room selection interface if no room is selected
  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8">Book Your Stay</h1>
          <p className="text-center text-gray-600 mb-8">Choose a room to start your booking</p>
          
          {/* Room Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {rooms.map(room => {
              // Get the primary image for the room (first image's fileName or fallback)
              const primaryImage = room.images && room.images.length > 0 && room.images[0].fileName
                ? `https://wph-backend.gregdoesdev.xyz/images/rooms/${room.images[0].fileName}`
                : 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';

              return (
                <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                  <img 
                    src={primaryImage} 
                    alt={room.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
                    }}
                  />
                  <div className="p-4 lg:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg lg:text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow text-sm lg:text-base">{room.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl lg:text-2xl font-bold text-blue-600">₱{room.price?.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm lg:text-base">per night</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm lg:text-base">Capacity:</span>
                        <span className="font-medium text-sm lg:text-base">Up to {room.capacity} guests</span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold mt-auto"
                      >
                        Select This Room
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Want to see more details about our rooms?</p>
            <button
              onClick={() => navigate('/rooms')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
            >
              Browse All Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">Book Your Stay</h1>
        <p className="text-center text-gray-600 mb-8 text-sm lg:text-base">Selected: {selectedRoom.name}</p>
        
        {renderStepIndicator()}
        
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default Booking;