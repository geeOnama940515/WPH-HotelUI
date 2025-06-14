import { api } from './api';

/**
 * Room service for managing hotel rooms
 * All functions are ready for API integration
 */

/**
 * Get all available rooms
 * 
 * @returns {Promise<Array>} Array of room objects
 */
export const getRooms = () => api.get('/rooms');

/**
 * Create a new room (admin function)
 * 
 * @param {Object} roomData - Room information
 * @param {string} roomData.name - Room name
 * @param {string} roomData.description - Room description
 * @param {number} roomData.price - Room price per night
 * @param {number} roomData.capacity - Maximum number of guests
 * @param {string} roomData.image1 - Primary room image URL
 * @param {string} roomData.image2 - Additional gallery image URL
 * @param {string} roomData.image3 - Additional gallery image URL
 * @param {string} roomData.image4 - Additional gallery image URL
 * @param {string} roomData.image5 - Additional gallery image URL
 * @param {string} roomData.image6 - Additional gallery image URL
 * @param {string} roomData.status - Room status (available, occupied, maintenance)
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = (roomData) => api.post('/rooms', roomData);

/**
 * Update existing room (admin function)
 * 
 * @param {string} roomId - Room ID to update
 * @param {Object} roomData - Updated room information
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoom = (roomId, roomData) => api.put(`/rooms/${roomId}`, roomData);

/**
 * Delete a room (admin function)
 * 
 * @param {string} roomId - Room ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRoom = (roomId) => api.delete(`/rooms/${roomId}`);

/**
 * Upload room image (admin function)
 * 
 * @param {FormData} formData - Form data containing image file
 * @returns {Promise<Object>} Upload result with image URL
 */
export const uploadRoomImage = (formData) => {
  // Get JWT token from localStorage for authenticated requests
  const token = localStorage.getItem('token');
  
  // Custom fetch for file upload (don't set Content-Type, let browser set it with boundary)
  return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rooms/upload-image`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    return response.json();
  });
};