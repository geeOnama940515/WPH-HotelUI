import { api } from './api';

/**
 * Room service for managing hotel rooms
 * All functions are integrated with your backend API using Result<T> pattern
 */

/**
 * Get all available rooms
 * 
 * @returns {Promise<Array>} Array of room objects
 */
export const getRooms = () => api.get('/api/room');

/**
 * Get a specific room by ID
 * 
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room object
 */
export const getRoomById = (roomId) => api.get(`/api/room/${roomId}`);

/**
 * Create a new room (admin function)
 * 
 * @param {Object} roomData - Room information
 * @param {string} roomData.name - Room name
 * @param {string} roomData.description - Room description
 * @param {number} roomData.price - Room price per night
 * @param {number} roomData.capacity - Maximum number of guests
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = (roomData) => {
  const createRoomDto = {
    name: roomData.name,
    description: roomData.description || '',
    price: roomData.price,
    capacity: roomData.capacity,
    images: [] // Images will be uploaded separately
  };
  
  return api.post('/api/room', createRoomDto);
};

/**
 * Update existing room (admin function)
 * 
 * @param {string} roomId - Room ID to update
 * @param {Object} roomData - Updated room information
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoom = (roomId, roomData) => {
  const updateRoomDto = {
    name: roomData.name,
    description: roomData.description || '',
    price: roomData.price,
    capacity: roomData.capacity
  };
  
  return api.put(`/api/room/${roomId}`, updateRoomDto);
};

/**
 * Delete a room (admin function)
 * 
 * @param {string} roomId - Room ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRoom = (roomId) => api.delete(`/api/room/${roomId}`);

/**
 * Upload room images (admin function)
 * 
 * @param {string} roomId - Room ID to upload images for
 * @param {Array<File>} imageFiles - Array of image files
 * @returns {Promise<Object>} Upload result
 */
export const uploadRoomImages = async (roomId, imageFiles) => {
  const formData = new FormData();
  
  // Add room ID
  formData.append('roomId', roomId);
  
  // Add image files
  imageFiles.forEach((file, index) => {
    if (file) {
      formData.append('images', file);
    }
  });
  
  return api.postFile(`/api/room/${roomId}/images`, formData);
};

/**
 * Update room status (admin function)
 * 
 * @param {string} roomId - Room ID to update
 * @param {string} status - New room status (Available, Occupied, Maintenance)
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoomStatus = (roomId, status) => {
  return api.put(`/api/room/${roomId}/status`, { status });
};