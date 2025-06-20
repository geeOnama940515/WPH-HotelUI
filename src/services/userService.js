import { api } from './api';

/**
 * User service for managing user profiles and administration
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

/**
 * Get all users (admin function)
 * Uses the correct endpoint: /api/auth/list-users
 * 
 * @returns {Promise<Object>} Response with users array
 */
export const getAllUsers = () => api.get('/api/auth/list-users');

/**
 * Get a specific user by ID (admin function)
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
export const getUserById = (userId) => api.get(`/api/users/${userId}`);

/**
 * Create a new user (admin function)
 * 
 * @param {Object} userData - User information
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.phoneNumber - User's phone number
 * @param {string} userData.password - User's password
 * @param {string} userData.confirmPassword - Password confirmation
 * @param {string} userData.role - User's role (User, Administrator)
 * @param {string} userData.status - User's status (Active, Inactive, Suspended)
 * @returns {Promise<Object>} Created user object
 */
export const createUser = (userData) => api.post('/api/users', userData);

/**
 * Update existing user (admin function)
 * 
 * @param {string} userId - User ID to update
 * @param {Object} userData - Updated user information
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = (userId, userData) => api.put(`/api/users/${userId}`, userData);

/**
 * Delete a user (admin function)
 * 
 * @param {string} userId - User ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUser = (userId) => api.delete(`/api/users/${userId}`);

/**
 * Update user role (admin function)
 * 
 * @param {string} userId - User ID to update
 * @param {string} role - New user role (User, Administrator)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserRole = (userId, role) => 
  api.put(`/api/users/${userId}/role`, { role });

/**
 * Update user status (admin function)
 * 
 * @param {string} userId - User ID to update
 * @param {string} status - New user status (Active, Inactive, Suspended)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserStatus = (userId, status) => 
  api.put(`/api/users/${userId}/status`, { status });

/**
 * Enable user account (admin function)
 * 
 * @param {string} userId - User ID to enable
 * @returns {Promise<Object>} Updated user object
 */
export const enableUserAccount = (userId) => 
  api.put(`/api/auth/enable-account/${userId}`, {});

/**
 * Disable user account (admin function)
 * 
 * @param {string} userId - User ID to disable
 * @returns {Promise<Object>} Updated user object
 */
export const disableUserAccount = (userId) => 
  api.put(`/api/auth/disable-account/${userId}`, {});

/**
 * Search users (admin function)
 * 
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.query - Search query (name, email)
 * @param {string} searchParams.role - Filter by role
 * @param {string} searchParams.status - Filter by status
 * @param {number} searchParams.page - Page number
 * @param {number} searchParams.pageSize - Items per page
 * @returns {Promise<Object>} Paginated search results
 */
export const searchUsers = (searchParams) => {
  const params = new URLSearchParams();
  
  if (searchParams.query) params.append('query', searchParams.query);
  if (searchParams.role) params.append('role', searchParams.role);
  if (searchParams.status) params.append('status', searchParams.status);
  if (searchParams.page) params.append('page', searchParams.page);
  if (searchParams.pageSize) params.append('pageSize', searchParams.pageSize);
  
  return api.get(`/api/users/search?${params.toString()}`);
};