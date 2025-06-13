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
 * @param {string} bookingData.roomType - Selected room type ID
 * @param {Date} bookingData.checkIn - Check-in date
 * @param {Date} bookingData.checkOut - Check-out date
 * @param {number} bookingData.numberOfGuests - Number of guests
 * @param {number} bookingData.totalAmount - Total booking amount
 * @returns {Promise<Object>} Created booking object
 */
export const createBooking = (bookingData) => api.post('/bookings', bookingData);

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
 * @param {string} status - New booking status (pending, confirmed, cancelled, etc.)
 * @returns {Promise<Object>} Updated booking object
 */
export const updateBookingStatus = (bookingId, status) => 
  api.put(`/bookings/${bookingId}/status`, { status });

/**
 * Get all bookings (admin function)
 * 
 * @returns {Promise<Array>} Array of all bookings in the system
 */
export const getAllBookings = () => api.get('/bookings');