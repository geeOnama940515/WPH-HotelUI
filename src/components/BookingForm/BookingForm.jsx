import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getRooms } from '../../services/roomService';
import { showToast, toastMessages } from '../../utils/notifications';

/**
 * BookingForm component handles guest information and booking details
 * Includes comprehensive form validation and guest capacity checking
 * Now integrated with API to load rooms
 * 
 * @param {Object} selectedRoom - Pre-selected room object (optional)
 * @param {Function} onSubmit - Callback function when form is submitted
 */
function BookingForm({ selectedRoom, onSubmit }) {
  // Form state with all booking information
  const [formData, setFormData] = useState({
    guestFullName: '',
    emailAddress: '',
    phoneNumber: '',
    roomType: '',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    numberOfGuests: 1
  });
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load rooms from API
  useEffect(() => {
    loadRooms();
  }, []);

  // Pre-select the room if one was passed from the room card
  useEffect(() => {
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        roomType: selectedRoom.id.toString()
      }));
    }
  }, [selectedRoom]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      showToast.error('Failed to load room options. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate all form fields
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const selectedRoomData = rooms.find(room => room.id === formData.roomType);
    
    // Guest information validation
    if (!formData.guestFullName.trim()) {
      showToast.error('Guest full name is required');
      return false;
    }
    if (!formData.emailAddress.trim()) {
      showToast.error('Email address is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      showToast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      showToast.error('Phone number is required');
      return false;
    }
    
    // Booking details validation
    if (!formData.roomType) {
      showToast.error('Please select a room type');
      return false;
    }
    if (!formData.checkIn) {
      showToast.error('Check-in date is required');
      return false;
    }
    if (!formData.checkOut) {
      showToast.error('Check-out date is required');
      return false;
    }
    if (formData.checkOut <= formData.checkIn) {
      showToast.error('Check-out date must be after check-in date');
      return false;
    }
    
    // Guest capacity validation
    if (!formData.numberOfGuests || formData.numberOfGuests < 1) {
      showToast.error('At least 1 guest is required');
      return false;
    }
    if (selectedRoomData && formData.numberOfGuests > selectedRoomData.capacity) {
      showToast.error(`This room can accommodate maximum ${selectedRoomData.capacity} guests`);
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /**
   * Handle input field changes
   * @param {string} field - Field name to update
   * @param {any} value - New field value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get selected room data for capacity validation
  const selectedRoomData = rooms.find(room => room.id === formData.roomType);

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
      <h2 className="text-xl lg:text-2xl font-semibold mb-6">Booking Information</h2>
      
      {/* Show selected room info if available */}
      {selectedRoom && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Selected Room</h3>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img 
              src={selectedRoom.images && selectedRoom.images.length > 0 && selectedRoom.images[0].fileName
                ? `/images/rooms/${selectedRoom.images[0].fileName}`
                : 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'} 
              alt={selectedRoom.name}
              className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
              }}
            />
            <div className="flex-1">
              <p className="font-semibold">{selectedRoom.name}</p>
              <p className="text-sm text-gray-600">{selectedRoom.description}</p>
              <p className="text-blue-600 font-medium">₱{selectedRoom.price?.toLocaleString()}/night</p>
              <p className="text-sm text-gray-500">Capacity: Up to {selectedRoom.capacity} guests</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Information Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Guest Information</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Guest full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Full Name *
              </label>
              <input
                type="text"
                value={formData.guestFullName}
                onChange={(e) => handleInputChange('guestFullName', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>
            
            {/* Email address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Phone number */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Booking Details Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Room type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => handleInputChange('roomType', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select a room type</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} - ₱{room.price?.toLocaleString()}/night (Up to {room.capacity} guests)
                  </option>
                ))}
              </select>
            </div>

            {/* Number of guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests *
              </label>
              <select
                value={formData.numberOfGuests}
                onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {/* Generate options based on selected room capacity */}
                {[...Array(selectedRoomData ? selectedRoomData.capacity : 6)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1} Guest{index + 1 !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              {selectedRoomData && (
                <p className="text-sm text-gray-500 mt-1">
                  This room can accommodate up to {selectedRoomData.capacity} guests
                </p>
              )}
            </div>
          </div>

          {/* Date selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Check-in date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date *
              </label>
              <DatePicker
                selected={formData.checkIn}
                onChange={date => handleInputChange('checkIn', date)}
                minDate={new Date()} // Prevent past dates
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholderText="Select check-in date"
              />
            </div>
            
            {/* Check-out date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date *
              </label>
              <DatePicker
                selected={formData.checkOut}
                onChange={date => handleInputChange('checkOut', date)}
                minDate={formData.checkIn} // Must be after check-in
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholderText="Select check-out date"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Continue to Summary'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;