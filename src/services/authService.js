import { api } from './api';

/**
 * Authentication service for handling user login/logout
 * Currently uses mock authentication but ready for real API integration
 */

/**
 * Login user with email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object with authentication details
 */
export const login = async (email, password) => {
  try {
    // Mock authentication - replace with real API call when backend is ready
    // Real implementation would be: const response = await api.post('/auth/login', { email, password });
    
    // Check for admin credentials
    if (email === 'admin@wphhotel.com' && password === 'Admin123!') {
      const adminUser = {
        id: '1',
        email: 'admin@wphhotel.com',
        name: 'Hotel Admin',
        isAdmin: true
      };
      // Store authentication token
      localStorage.setItem('token', 'admin-token');
      return adminUser;
    }
    
    // Invalid credentials
    throw new Error('Invalid admin credentials');
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Register new user account
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise<Object>} User object with authentication details
 */
export const register = async (email, password, name) => {
  try {
    // API call for user registration
    const response = await api.post('/auth/register', { email, password, name });
    if (response.token) {
      localStorage.setItem('token', response.token);
      return response.user;
    }
    throw new Error('Invalid response from server');
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Logout current user by removing authentication token
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Get current authenticated user from stored token
 * 
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Check if it's the admin token (mock implementation)
    if (token === 'admin-token') {
      return {
        id: '1',
        email: 'admin@wphhotel.com',
        name: 'Hotel Admin',
        isAdmin: true
      };
    }
    
    // In real implementation, you would decode JWT token here
    // const decoded = jwt.decode(token);
    // return decoded.user;
    
    return null;
  } catch (error) {
    // Invalid token, remove it
    localStorage.removeItem('token');
    return null;
  }
};