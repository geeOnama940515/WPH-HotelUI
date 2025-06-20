import { api } from './api';

/**
 * Authentication service for handling user login/logout/register
 * Integrated with your backend API endpoints
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
    // Make API call to login endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://wph-backend.gregdoesdev.xyz'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    // Handle non-successful responses
    if (!response.ok || !result.success) {
      const errorMessage = result.message || 
                          (result.errors && result.errors.length > 0 ? result.errors.join(', ') : '') ||
                          'Login failed';
      throw new Error(errorMessage);
    }

    // Extract user data from response
    const { data } = result;
    
    // Store authentication token and refresh token
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('tokenExpiry', data.expiresAt);

    // Create user object with role information
    const user = {
      id: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      role: data.role,
      isAdmin: data.role === 'Administrator' || data.role === 'HotelManager',
      isSuperAdmin: data.role === 'Administrator', // Only Administrator can manage users
      isHotelManager: data.role === 'HotelManager'
    };

    return user;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Register new user account
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.confirmPassword - Password confirmation
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.phoneNumber - User's phone number
 * @returns {Promise<Object>} User object with authentication details
 */
export const register = async (userData) => {
  try {
    // Make API call to register endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://wph-backend.gregdoesdev.xyz'}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    // Handle non-successful responses
    if (!response.ok || !result.success) {
      const errorMessage = result.message || 
                          (result.errors && result.errors.length > 0 ? result.errors.join(', ') : '') ||
                          'Registration failed';
      throw new Error(errorMessage);
    }

    // Extract user data from response
    const { data } = result;
    
    // Store authentication token and refresh token
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('tokenExpiry', data.expiresAt);

    // Create user object with role information
    const user = {
      id: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      role: data.role,
      isAdmin: data.role === 'Administrator' || data.role === 'HotelManager',
      isSuperAdmin: data.role === 'Administrator', // Only Administrator can manage users
      isHotelManager: data.role === 'HotelManager'
    };

    return user;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Change user password
 * 
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmNewPassword - Confirmation of new password
 * @returns {Promise<Object>} Password change result
 */
export const changePassword = async (userId, currentPassword, newPassword, confirmNewPassword) => {
  try {
    const response = await api.post('/api/auth/change-password', {
      userId,
      currentPassword,
      newPassword,
      confirmNewPassword
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Refresh JWT token using refresh token
 * 
 * @returns {Promise<string>} New JWT token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://wph-backend.gregdoesdev.xyz'}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Token refresh failed');
    }

    // Update stored tokens
    localStorage.setItem('token', result.data.token);
    localStorage.setItem('tokenExpiry', result.data.expiresAt);

    return result.data.token;
  } catch (error) {
    // If refresh fails, logout user
    logout();
    throw error;
  }
};

/**
 * Revoke refresh token and logout
 */
export const revokeToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://wph-backend.gregdoesdev.xyz'}/api/auth/revoke-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
    }
  } catch (error) {
    console.error('Failed to revoke token:', error);
    // Continue with logout even if revoke fails
  }
};

/**
 * Logout current user by removing authentication tokens
 */
export const logout = async () => {
  try {
    // Revoke refresh token on server
    await revokeToken();
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  }
};

/**
 * Check if token is expired
 * 
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  
  return new Date() >= new Date(expiry);
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
    // Check if token is expired
    if (isTokenExpired()) {
      logout();
      return null;
    }

    // Decode JWT token to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Extract user information from JWT claims
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    const user = {
      id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      firstName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      role: role,
      fullName: `${payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']} ${payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']}`,
      isAdmin: role === 'Administrator' || role === 'HotelManager',
      isSuperAdmin: role === 'Administrator', // Only Administrator can manage users
      isHotelManager: role === 'HotelManager'
    };

    return user;
  } catch (error) {
    // Invalid token, remove it
    logout();
    return null;
  }
};

/**
 * Auto-refresh token if it's about to expire
 */
export const autoRefreshToken = async () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return;

  const expiryDate = new Date(expiry);
  const now = new Date();
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  
  // Refresh token if it expires in less than 5 minutes
  if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Auto token refresh failed:', error);
    }
  }
};