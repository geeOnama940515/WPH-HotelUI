import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function BookingForm({ room, onSubmit }) {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!checkOut) newErrors.checkOut = 'Check-out date is required';
    if (checkOut <= checkIn) newErrors.checkOut = 'Check-out date must be after check-in date';
    if (guests < 1) newErrors.guests = 'At least one guest is required';
    if (guests > room.capacity) newErrors.guests = `Maximum ${room.capacity} guests allowed`;
    if (!contactInfo.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        checkIn,
        checkOut,
        guests,
        specialRequests,
        contactInfo
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <DatePicker
            selected={checkIn}
            onChange={date => setCheckIn(date)}
            minDate={new Date()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
          <DatePicker
            selected={checkOut}
            onChange={date => setCheckOut(date)}
            minDate={checkIn}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
        <input
          type="number"
          min="1"
          max={room?.capacity || 4}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={contactInfo.address}
          onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
          rows="2"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Special Requests</label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any special requests or preferences?"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Continue to Review
      </button>
    </form>
  );
}

export default BookingForm;