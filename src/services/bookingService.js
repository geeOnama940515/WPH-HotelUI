import { api } from './api';

export const createBooking = (bookingData) => api.post('/bookings', bookingData);

export const getUserBookings = () => api.get('/bookings/user');

export const updateBookingStatus = (bookingId, status) => 
  api.put(`/bookings/${bookingId}/status`, { status });

export const getAllBookings = () => api.get('/bookings');