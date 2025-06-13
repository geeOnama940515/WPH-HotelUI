import { api } from './api';

/**
 * User service for managing user profiles
 * All functions are ready for API integration
 */

/**
 * Update user profile information
 * 
 * @param {Object} profileData - Profile information to update
 * @param {string} profileData.fullName - User's full name
 * @param {string} profileData.phone - User's phone number
 * @param {string} profileData.address - User's address
 * @returns {Promise<Object>} Updated profile object
 */
export const updateProfile = (profileData) => api.put('/profile', profileData);

/**
 * Get current user's profile information
 * 
 * @returns {Promise<Object>} User profile object
 */
export const getProfile = () => api.get('/profile');