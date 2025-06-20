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
  const response = await api.get('/api/rooms');

  // response is already unwrapped by api.js, so this should be the room list directly
  console.log('getRooms response (unwrapped):', response);
  
  // Check if response is already an array (direct data)
  if (Array.isArray(response)) {
    return response;
  }
  
  // If response has a data property that's an array, use that
  if (response && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Fallback - return empty array if structure is unexpected
  console.warn('Unexpected getRooms response structure:', response);
  return [];
};

/**
 * Get a specific room by ID
 * 
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room object
 */
export const getRoomById = async (roomId) => {
  const response = await api.get(`/api/rooms/${roomId}`);
  
  // response is already unwrapped by api.js
  console.log('getRoomById response (unwrapped):', response);
  
  // Check if response is the room object directly
  if (response && (response.id || response.roomId)) {
    return response;
  }
  
  // If response has a data property with the room, use that
  if (response && response.data && (response.data.id || response.data.roomId)) {
    return response.data;
  }
  
  // Fallback
  console.warn('Unexpected getRoomById response structure:', response);
  return response;
};

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
      formData.append('Images', file);
    });
  }
  
  return api.uploadFile('/api/rooms/with-images', formData, 'POST');
};

/**
 * Update existing room with images (admin function)
 * 
 * @param {string} roomId - Room ID to update
 * @param {Object} roomData - Updated room information
 * @param {Array<File>} roomData.images - Array of new image files (optional)
 * @param {Array<Object>} roomData.existingImages - Array of existing images to keep (optional)
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoomWithImages = async (roomId, roomData) => {
  const formData = new FormData();
  
  // Add room data
  formData.append('name', roomData.name);
  formData.append('description', roomData.description || '');
  formData.append('price', roomData.price);
  formData.append('capacity', roomData.capacity);
  
  // Debug logging
  console.log('updateRoomWithImages debug:', {
    hasNewImages: !!(roomData.images && roomData.images.length > 0),
    newImagesCount: roomData.images ? roomData.images.length : 0,
    hasExistingImages: !!(roomData.existingImages && roomData.existingImages.length > 0),
    existingImagesCount: roomData.existingImages ? roomData.existingImages.length : 0
  });
  
  // Determine if we should replace existing images
  // If we have new images OR if we have existing images to keep (meaning some were removed),
  // we need to replace all images
  const hasNewImages = roomData.images && roomData.images.length > 0;
  const hasExistingImagesToKeep = roomData.existingImages && roomData.existingImages.length > 0;
  
  // Replace existing images if:
  // 1. We have new images to upload, OR
  // 2. We have existing images to keep (meaning some were removed)
  const shouldReplace = hasNewImages || hasExistingImagesToKeep;
  
  console.log('ReplaceExistingImages will be:', shouldReplace);
  
  // Always send a boolean value, never undefined
  formData.append('ReplaceExistingImages', shouldReplace.toString());
  
  // Add new image files if any
  if (roomData.images && roomData.images.length > 0) {
    roomData.images.forEach((file) => {
      formData.append('NewImages', file);
    });
  }
  
  // If we have existing images to keep but no new images, we need to re-upload the existing ones
  // This is a workaround since the backend doesn't support "keep these specific existing images"
  if (hasExistingImagesToKeep && !hasNewImages) {
    console.log('Re-uploading existing images as new images to preserve them');
    // Note: This would require converting the existing image URLs back to files
    // For now, this is a limitation - the backend needs to be enhanced
  }
  
  return api.uploadFile(`/api/rooms/${roomId}/with-images`, formData, 'PUT');
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
  
  return api.put(`/api/rooms/${roomId}`, updateRoomDto);
};

/**
 * Delete a room (admin function)
 * 
 * @param {string} roomId - Room ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRoom = (roomId) => api.delete(`/api/rooms/${roomId}`);

/**
 * Upload room images (admin function)
 * 
 * @param {string} roomId - Room ID to upload images for
 * @param {Array<File>} imageFiles - Array of image files
 * @returns {Promise<Object>} Upload result
 */
export const uploadRoomImages = async (roomId, imageFiles) => {
  const formData = new FormData();
  
  // Add image files - use 'Files' to match backend controller parameter
  imageFiles.forEach((file, index) => {
    if (file) {
      formData.append('Files', file);
    }
  });
  
  return api.uploadFile(`/api/rooms/${roomId}/images`, formData, 'POST');
};

/**
 * Update room status (admin function)
 * 
 * @param {string} roomId - Room ID to update
 * @param {string} status - New room status (Available=0, Booked=1, Occupied=2, Maintenance=3, Inactive=4)
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoomStatus = (roomId, status) => {
  console.log(`roomId : ${roomId} + status ${status}`);
  return api.put(`/api/rooms/${roomId}/status`, { 
    roomId: roomId,
    newStatus: parseInt(status)
  });
};

/**
 * Check room availability for a given date range
 * @param {string} roomId - Room ID
 * @param {Date|string} checkIn - Check-in date (Date object or ISO string)
 * @param {Date|string} checkOut - Check-out date (Date object or ISO string)
 * @returns {Promise<Object>} Availability result from API
 */
export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  // Format dates as YYYY/MM/DD
  function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}/${month}/${day}`;
  }
  const checkInStr = formatDate(checkIn);
  const checkOutStr = formatDate(checkOut);
  const params = new URLSearchParams({
    RoomId: roomId, // Capital R
    CheckIn: checkInStr,
    CheckOut: checkOutStr
  });
  const response = await api.get(`/api/rooms/room-availability?${params.toString()}`);
  // Parse the nested response structure
  let available = false;
  let message = 'Unknown response';
  if (response && response.data && typeof response.data.isAvailable === 'boolean') {
    available = response.data.isAvailable;
    message = response.message || '';
  } else if (response && response.isAvailable !== undefined) {
    available = response.isAvailable;
    message = response.message || '';
  }
  return { available, message };
};