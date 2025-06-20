import { api } from './api';

/**
 * Booking service for managing hotel reservations
 * All functions are ready for API integration
 */

/**
 * Create a new booking
 * 
 * @param {Object} bookingData - Booking information
 * @param {string} bookingData.guestFullName - Guest's full name
 * @param {string} bookingData.emailAddress - Guest's email
 * @param {string} bookingData.phoneNumber - Guest's phone number
 * @param {string} bookingData.address - Guest's address (optional)
 * @param {string} bookingData.roomType - Selected room type ID
 * @param {Date} bookingData.checkIn - Check-in date
 * @param {Date} bookingData.checkOut - Check-out date
 * @param {number} bookingData.numberOfGuests - Number of guests
 * @param {number} bookingData.totalAmount - Total booking amount
 * @param {string} bookingData.specialRequests - Special requests (optional)
 * @returns {Promise<Object>} Created booking object with bookingId
 */
export const createBooking = (bookingData) => {
  // Transform the data to match backend API requirements
  const apiData = {
    roomId: bookingData.roomType,
    checkIn: bookingData.checkIn.toISOString(),
    checkOut: bookingData.checkOut.toISOString(),
    guests: bookingData.numberOfGuests,
    totalAmount: bookingData.totalAmount,
    specialRequests: bookingData.specialRequests || '',
    phone: bookingData.phoneNumber,
    address: bookingData.address || '',
    emailAddress: bookingData.emailAddress,
    guestName: bookingData.guestFullName
  };

  return api.post('/api/bookings', apiData);
};

/**
 * Verify OTP for booking confirmation
 * 
 * @param {string} bookingId - Booking ID from the initial booking creation
 * @param {string} otpCode - 6-digit OTP code entered by user
 * @returns {Promise<Object>} Verification result
 */
export const verifyBookingOtp = (bookingId, otpCode) => {
  return api.post('/api/bookings/verify-otp', {
    bookingId: bookingId,
    otpCode: otpCode
  });
};

/**
 * Resend OTP for booking verification
 * 
 * @param {string} bookingId - Booking ID from the initial booking creation
 * @param {string} emailAddress - Email address to send OTP to
 * @returns {Promise<Object>} Resend result
 */
export const resendBookingOtp = (bookingId, emailAddress) => {
  return api.post('/api/bookings/resend-otp', {
    bookingId: bookingId,
    emailAddress: emailAddress
  });
};

/**
 * Cancel a booking
 * 
 * @param {string} bookingId - Booking ID to cancel
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelBooking = (bookingId) => {
  return api.put(`/api/bookings/${bookingId}/cancel`, {});
};

/**
 * Get all bookings for the current user
 * 
 * @returns {Promise<Array>} Array of user's bookings
 */
export const getUserBookings = () => api.get('/bookings/user');

/**
 * Update booking status (admin function)
 * 
 * @param {string} bookingId - Booking ID to update
 * @param {string|number} status - New booking status (0-5 or enum string)
 * @returns {Promise<Object>} Updated booking object
 */
export const updateBookingStatus = (bookingId, status) => {
  // Convert to integer if it's a string
  const newStatus = parseInt(status);
  
  return api.put(`/api/bookings/${bookingId}/status`, { 
    bookingId: bookingId,
    newStatus: newStatus
  });
};

/**
 * Get all bookings (admin function)
 * 
 * @returns {Promise<Array>} Array of all bookings in the system
 */
export const getAllBookings = async () => {
  const response = await api.get('/api/bookings');
  
  // response is already unwrapped by api.js
  console.log('getAllBookings response (unwrapped):', response);
  
  // Check if response is already an array (direct data)
  if (Array.isArray(response)) {
    return response;
  }
  
  // If response has a data property that's an array, use that
  if (response && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Fallback - return empty array if structure is unexpected
  console.warn('Unexpected getAllBookings response structure:', response);
  return [];
};

/**
 * Get a booking by its public token
 * @param {string} token - The booking token
 * @returns {Promise<Object>} Booking object
 */
export const getBookingByToken = (token) => api.get(`/api/bookings/view/${token}`);

/**
 * Update booking dates (admin function)
 * 
 * @param {string} bookingId - Booking ID to update
 * @param {string} checkIn - New check-in date (ISO string)
 * @param {string} checkOut - New check-out date (ISO string)
 * @returns {Promise<Object>} Updated booking object
 */
export const updateBookingDates = (bookingId, checkIn, checkOut) => 
  api.put(`/api/bookings/${bookingId}/dates`, { 
    checkIn: checkIn,
    checkOut: checkOut
  });