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
 * @param {string} roomData.image - Room image URL
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