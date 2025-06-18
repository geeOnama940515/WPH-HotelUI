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

  let response; // Declare response variable outside try block

  try {
    // Make the API request
    response = await fetch(`${API_URL}${endpoint}`, config);
    
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

    // Get response text first to check if it's empty
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    console.log('Response text preview:', responseText.substring(0, 100));
    
    if (!responseText || responseText.trim() === '') {
      // Empty response
      if (response.ok) {
        console.log('Empty response but successful, returning success object');
        return { success: true, message: 'Operation completed successfully' };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If no content or not JSON, check if it's a successful response
      if (response.ok) {
        console.log('Non-JSON response but successful, returning success object');
        return { success: true, message: 'Operation completed successfully' };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    // Try to parse JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      if (response.ok) {
        console.log('JSON parse failed but response was successful, returning success object');
        return { success: true, message: 'Operation completed successfully' };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    // Handle non-successful responses or failed results
    const isSuccess = result.isSuccess !== undefined ? result.isSuccess : result.success;
    if (!response.ok || !isSuccess) {
      const errorMessage = result.message || 
                          (result.errors && result.errors.length > 0 ? result.errors.join(', ') : '') ||
                          `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Return the data from the Result<T> wrapper
    return result.data;
  } catch (error) {
    // Handle JSON parsing errors specifically
    if (error.message === 'Unexpected end of JSON input') {
      console.log('JSON parsing error detected. Response details:', {
        status: response?.status,
        statusText: response?.statusText,
        ok: response?.ok,
        contentType: response?.headers.get('content-type')
      });
      
      // Check if response was successful despite empty content
      if (response && response.ok) {
        console.log('Empty response but successful, returning success object');
        return { success: true, message: 'Operation completed successfully' };
      } else {
        throw new Error(`HTTP ${response?.status || 'Unknown'}: ${response?.statusText || 'No response'}`);
      }
    }
    
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
    
    console.log('🚀 Starting file upload to:', `${API_URL}${endpoint}`);
    console.log('📁 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      console.log('📡 Upload response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
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
          
          // Check if response has content before parsing JSON
          const contentType = retryResponse.headers.get('content-type');
          console.log('Response content-type:', contentType);
          console.log('Response status:', retryResponse.status);
          console.log('Response ok:', retryResponse.ok);
          
          // Get response text first to check if it's empty
          const retryResponseText = await retryResponse.text();
          console.log('Retry response text length:', retryResponseText.length);
          console.log('Retry response text preview:', retryResponseText.substring(0, 100));
          
          if (!retryResponseText || retryResponseText.trim() === '') {
            // Empty response
            if (retryResponse.ok) {
              console.log('Empty retry response but successful, returning success object');
              return { success: true, message: 'Upload completed successfully' };
            } else {
              throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
            }
          }
          
          if (!contentType || !contentType.includes('application/json')) {
            // If no content or not JSON, check if it's a successful response
            if (retryResponse.ok) {
              console.log('Non-JSON retry response but successful, returning success object');
              return { success: true, message: 'Upload completed successfully' };
            } else {
              throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
            }
          }

          // Try to parse JSON
          let retryResult;
          try {
            retryResult = JSON.parse(retryResponseText);
          } catch (parseError) {
            console.log('Retry JSON parse error:', parseError);
            if (retryResponse.ok) {
              console.log('Retry JSON parse failed but response was successful, returning success object');
              return { success: true, message: 'Upload completed successfully' };
            } else {
              throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
            }
          }
          
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

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      // Get response text first to check if it's empty
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);
      console.log('Response text preview:', responseText.substring(0, 100));
      
      if (!responseText || responseText.trim() === '') {
        // Empty response
        if (response.ok) {
          console.log('Empty response but successful, returning success object');
          return { success: true, message: 'Upload completed successfully' };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        // If no content or not JSON, check if it's a successful response
        if (response.ok) {
          console.log('Non-JSON response but successful, returning success object');
          return { success: true, message: 'Upload completed successfully' };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
        if (response.ok) {
          console.log('JSON parse failed but response was successful, returning success object');
          return { success: true, message: 'Upload completed successfully' };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Handle non-successful responses or failed results
      const isSuccess = result.isSuccess !== undefined ? result.isSuccess : result.success;
      if (!response.ok || !isSuccess) {
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