// Base API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5187';

/**
 * Custom fetch wrapper with authentication and error handling
 * Automatically includes JWT token in requests and handles common errors
 * Updated to handle Result<T> wrapper pattern from backend
 * Now includes automatic token refresh on 401 errors
 * 
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} Parsed JSON response data
 */
const customFetch = async (endpoint, options = {}) => {
  // Get JWT token from localStorage for authenticated requests
  const token = localStorage.getItem('token');
  
  // Default headers with content type and optional authorization
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // Merge default options with provided options
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && token) {
      try {
        const { refreshToken } = await import('./authService');
        const newToken = await refreshToken();
        
        // Retry the request with new token
        config.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_URL}${endpoint}`, config);
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
        }
        
        const retryResult = await retryResponse.json();
        
        if (!retryResult.isSuccess) {
          const errorMessage = retryResult.message || 
                              (retryResult.errors && retryResult.errors.length > 0 ? retryResult.errors.join(', ') : '') ||
                              'Request failed';
          throw new Error(errorMessage);
        }
        
        return retryResult.data;
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        const { logout } = await import('./authService');
        await logout();
        window.location.href = '/auth';
        throw new Error('Session expired. Please login again.');
      }
    }

    // Parse JSON response
    const result = await response.json();
    
    // Handle non-successful responses or failed results
    if (!response.ok || !result.isSuccess) {
      const errorMessage = result.message || 
                          (result.errors && result.errors.length > 0 ? result.errors.join(', ') : '') ||
                          `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Return the data from the Result<T> wrapper
    return result.data;
  } catch (error) {
    // Re-throw error for handling by calling code
    throw error;
  }
};

/**
 * API service object with common HTTP methods
 * Provides a clean interface for making API calls
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  get: (endpoint) => customFetch(endpoint),
  
  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  post: (endpoint, data) => customFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  put: (endpoint, data) => customFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  delete: (endpoint) => customFetch(endpoint, {
    method: 'DELETE'
  }),

  /**
   * POST request for file uploads
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with files
   * @returns {Promise<Object>} Response data
   */
  postFile: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      // Handle 401 Unauthorized for file uploads too
      if (response.status === 401 && token) {
        try {
          const { refreshToken } = await import('./authService');
          const newToken = await refreshToken();
          
          // Retry the request with new token
          const retryResponse = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`
            },
            body: formData
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          
          const retryResult = await retryResponse.json();
          
          if (!retryResult.isSuccess) {
            const errorMessage = retryResult.message || 
                                (retryResult.errors && retryResult.errors.length > 0 ? retryResult.errors.join(', ') : '') ||
                                'Upload failed';
            throw new Error(errorMessage);
          }
          
          return retryResult.data;
        } catch (refreshError) {
          const { logout } = await import('./authService');
          await logout();
          window.location.href = '/auth';
          throw new Error('Session expired. Please login again.');
        }
      }

      const result = await response.json();
      
      // Handle non-successful responses or failed results
      if (!response.ok || !result.isSuccess) {
        const errorMessage = result.message || 
                            (result.errors && result.errors.length > 0 ? result.errors.join(', ') : '') ||
                            `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Return the data from the Result<T> wrapper
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};