import React from 'react';
import { getRooms } from '../../services/roomService';

/**
 * BookingSummary component displays booking details and cost breakdown
 * Shows guest information, booking details, and total cost calculation
 * Now handles API room data structure
 * 
 * @param {Object} bookingData - Booking form data
 * @param {Function} onConfirm - Callback when booking is confirmed
 * @param {Function} onBack - Callback to go back to form
 * @param {boolean} isViewOnly - If true, shows contact info instead of action buttons
 * @param {boolean} isConfirming - If true, shows loading state on confirm button
 */
function BookingSummary({ bookingData, onConfirm, onBack, isViewOnly = false, isConfirming = false }) {
  const [rooms, setRooms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Load rooms to get current room data
  React.useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find the selected room from the rooms data
  const selectedRoom = rooms.find(room => room.id === bookingData?.roomType);
  
  /**
   * Calculate booking costs including taxes and service charges
   * @returns {Object} Breakdown of all costs
   */
  const calculateBookingDetails = () => {
    if (!bookingData?.checkIn || !bookingData?.checkOut || !selectedRoom) {
      return {
        nights: 0,
        roomTotal: 0,
        tax: 0,
        serviceCharge: 0,
        total: 0
      };
    }

    // Calculate number of nights
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Calculate costs
    const roomTotal = nights * selectedRoom.price;
    const tax = roomTotal * 0.12; // 12% tax
    const serviceCharge = roomTotal * 0.10; // 10% service charge
    const total = roomTotal + tax + serviceCharge;

    return {
      nights,
      roomTotal,
      tax,
      serviceCharge,
      total
    };
  };

  /**
   * Format date for display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const { nights, roomTotal, tax, serviceCharge, total } = calculateBookingDetails();

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
        <h2 className="text-xl lg:text-2xl font-semibold mb-4">Booking Summary</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  // Show message if booking data is incomplete
  if (!bookingData || !selectedRoom) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
        <h2 className="text-xl lg:text-2xl font-semibold mb-4">Booking Summary</h2>
        <p className="text-gray-600">Please complete the booking form to see your summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
      <h2 className="text-xl lg:text-2xl font-semibold mb-6">Booking Summary</h2>
      
      <div className="space-y-6">
        {/* Guest Details Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-3">Guest Details</h3>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-medium">Name:</span> {bookingData.guestFullName}</p>
            <p><span className="font-medium">Email:</span> {bookingData.emailAddress}</p>
            <p><span className="font-medium">Phone:</span> {bookingData.phoneNumber}</p>
            {bookingData.address && (
              <p><span className="font-medium">Address:</span> {bookingData.address}</p>
            )}
            <p><span className="font-medium">Number of Guests:</span> {bookingData.numberOfGuests} guest{bookingData.numberOfGuests !== 1 ? 's' : ''}</p>
            {bookingData.specialRequests && (
              <p><span className="font-medium">Special Requests:</span> {bookingData.specialRequests}</p>
            )}
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-3">Booking Details</h3>
          <div className="space-y-2 text-sm lg:text-base">
            <p><span className="font-medium">Room:</span> {selectedRoom.name}</p>
            <p><span className="font-medium">Check-in:</span> {formatDate(bookingData.checkIn)}</p>
            <p><span className="font-medium">Check-out:</span> {formatDate(bookingData.checkOut)}</p>
            <p><span className="font-medium">Duration:</span> {nights} night{nights !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Total Cost Breakdown</h3>
          <div className="space-y-3 text-sm lg:text-base">
            {/* Room rate calculation */}
            <div className="flex justify-between">
              <span>Room Rate ({nights} night{nights !== 1 ? 's' : ''} × ₱{selectedRoom.price?.toLocaleString()})</span>
              <span>₱{roomTotal.toLocaleString()}</span>
            </div>
            
            {/* Tax calculation */}
            <div className="flex justify-between text-gray-600">
              <span>Tax (12%)</span>
              <span>₱{tax.toLocaleString()}</span>
            </div>
            
            {/* Service charge calculation */}
            <div className="flex justify-between text-gray-600">
              <span>Service Charge (10%)</span>
              <span>₱{serviceCharge.toLocaleString()}</span>
            </div>
            
            {/* Total amount */}
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg lg:text-xl font-bold">
                <span>Total Amount</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Action Buttons or Contact Information */}
        {isViewOnly ? (
          <div className="border-t pt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-800">Need Help?</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <span className="font-medium">To cancel your booking:</span> Please contact the hotel directly. 
                  Cancellations must be made at least 24 hours before check-in.
                </p>
                <p>
                  <span className="font-medium">Questions about your booking?</span> Our team is here to help!
                </p>
                <div className="mt-3">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm"
                  >
                    Contact Hotel
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
            >
              Back to Edit
            </button>
            <button
              onClick={() => onConfirm({ ...bookingData, totalAmount: total })}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              disabled={isConfirming}
            >
              {isConfirming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirming...
                </div>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingSummary;