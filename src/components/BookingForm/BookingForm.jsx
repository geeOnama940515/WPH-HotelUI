import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { rooms } from '../../data/roomsData';

/**
 * BookingForm component handles guest information and booking details
 * Includes comprehensive form validation and guest capacity checking
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
  
  const [errors, setErrors] = useState({}); // Form validation errors

  // Pre-select the room if one was passed from the room card
  useEffect(() => {
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        roomType: selectedRoom.id.toString()
      }));
    }
  }, [selectedRoom]);

  /**
   * Validate all form fields
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    const selectedRoomData = rooms.find(room => room.id === parseInt(formData.roomType));
    
    // Guest information validation
    if (!formData.guestFullName.trim()) newErrors.guestFullName = 'Guest full name is required';
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email address is required';
    if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) newErrors.emailAddress = 'Please enter a valid email address';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    // Booking details validation
    if (!formData.roomType) newErrors.roomType = 'Please select a room type';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (formData.checkOut <= formData.checkIn) newErrors.checkOut = 'Check-out date must be after check-in date';
    
    // Guest capacity validation
    if (!formData.numberOfGuests || formData.numberOfGuests < 1) newErrors.numberOfGuests = 'At least 1 guest is required';
    if (selectedRoomData && formData.numberOfGuests > selectedRoomData.capacity) {
      newErrors.numberOfGuests = `This room can accommodate maximum ${selectedRoomData.capacity} guests`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
  const selectedRoomData = rooms.find(room => room.id === parseInt(formData.roomType));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Booking Information</h2>
      
      {/* Show selected room info if available */}
      {selectedRoom && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Selected Room</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={selectedRoom.image} 
              alt={selectedRoom.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{selectedRoom.name}</p>
              <p className="text-sm text-gray-600">{selectedRoom.description}</p>
              <p className="text-blue-600 font-medium">₱{selectedRoom.price.toLocaleString()}/night</p>
              <p className="text-sm text-gray-500">Capacity: Up to {selectedRoom.capacity} guests</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Information Section */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Guest Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {errors.guestFullName && <p className="text-red-500 text-sm mt-1">{errors.guestFullName}</p>}
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
              {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
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
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Booking Details Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Room type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => handleInputChange('roomType', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a room type</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} - ₱{room.price.toLocaleString()}/night (Up to {room.capacity} guests)
                  </option>
                ))}
              </select>
              {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
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
              {errors.numberOfGuests && <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests}</p>}
              {selectedRoomData && (
                <p className="text-sm text-gray-500 mt-1">
                  This room can accommodate up to {selectedRoomData.capacity} guests
                </p>
              )}
            </div>
          </div>

          {/* Date selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
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
              {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue to Summary
        </button>
      </form>
    </div>
  );
}

export default BookingForm;