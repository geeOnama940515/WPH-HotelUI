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

export const getRooms = async () => {
  const response = await api.get('/api/room');

  // response is already unwrapped, so this is the room list
  console.log('response (unwrapped):', response);
  const rooms = response.data; // because `data` is the array of rooms

  return rooms;
};

/**
 * Get a specific room by ID
 * 
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room object
 */
export const getRoomById = (roomId) => api.get(`/api/room/${roomId}`);

/**
 * Create a new room with images (admin function)
 * 
 * @param {Object} roomData - Room information
 * @param {string} roomData.name - Room name
 * @param {string} roomData.description - Room description
 * @param {number} roomData.price - Room price per night
 * @param {number} roomData.capacity - Maximum number of guests
 * @param {Array<File>} roomData.images - Array of image files
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = async (roomData) => {
  const formData = new FormData();
  
  // Add room data
  formData.append('name', roomData.name);
  formData.append('description', roomData.description || '');
  formData.append('price', roomData.price);
  formData.append('capacity', roomData.capacity);
  
  // Add image files if any
  if (roomData.images && roomData.images.length > 0) {
    roomData.images.forEach((file) => {
      formData.append('files', file);
    });
  }
  
  return api.postFile('/api/rooms/with-images', formData);
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
  
  // Add image files - use 'files' to match backend controller parameter
  imageFiles.forEach((file, index) => {
    if (file) {
      formData.append('files', file);
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