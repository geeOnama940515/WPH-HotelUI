import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import BookingForm from '../../components/BookingForm/BookingForm';
import BookingSummary from '../../components/BookingSummary/BookingSummary';
import { rooms } from '../../data/roomsData';

function Booking() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // First try to get room from location state (passed from RoomCard)
    if (location.state?.selectedRoom) {
      setSelectedRoom(location.state.selectedRoom);
    } else {
      // Fallback to URL parameter
      const roomId = parseInt(searchParams.get('room'));
      if (roomId) {
        const room = rooms.find(r => r.id === roomId);
        setSelectedRoom(room);
      }
    }
  }, [searchParams, location.state]);

  const handleFormSubmit = (formData) => {
    setBookingData(formData);
    setCurrentStep(2);
  };

  const handleConfirmBooking = async (finalBookingData) => {
    try {
      // Here you would make an API call to save the booking
      console.log('Booking confirmed:', finalBookingData);
      setCurrentStep(3);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
            currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>1</span>
          <span className="font-medium">Booking Details</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
            currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>2</span>
          <span className="font-medium">Review & Confirm</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300" />
        <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
            currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
          }`}>3</span>
          <span className="font-medium">Confirmation</span>
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
            onConfirm={handleConfirmBooking}
            onBack={handleBackToForm}
          />
        );
      case 3:
        return (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-green-600 text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for choosing WPH Hotel. Your booking has been successfully confirmed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to <strong>{bookingData?.emailAddress}</strong>
              </p>
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

  // Show room selection interface if no room is selected
  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Book Your Stay</h1>
          <p className="text-center text-gray-600 mb-8">Choose a room to start your booking</p>
          
          {/* Room Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{room.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">₱{room.price.toLocaleString()}</span>
                      <span className="text-gray-500">per night</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">Up to {room.capacity} guests</span>
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
            ))}
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
        <h1 className="text-4xl font-bold text-center mb-2">Book Your Stay</h1>
        <p className="text-center text-gray-600 mb-8">Selected: {selectedRoom.name}</p>
        
        {renderStepIndicator()}
        
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default Booking;