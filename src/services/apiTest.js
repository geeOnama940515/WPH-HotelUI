// API Test Utility
// This file helps test backend connectivity and available endpoints

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5187';

/**
 * Test basic API connectivity
 */
export const testApiConnectivity = async () => {
  console.log('Testing API connectivity...');
  console.log('API URL:', API_URL);
  
  try {
    // Test basic GET request to root
    const response = await fetch(`${API_URL}/`);
    console.log('Root endpoint response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('Root response content:', text.substring(0, 200));
    }
    
    return response.ok;
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return false;
  }
};

/**
 * Test room endpoints
 */
export const testRoomEndpoints = async () => {
  console.log('Testing room endpoints...');
  
  const endpoints = [
    { method: 'GET', path: '/api/room', description: 'Get all rooms' },
    { method: 'POST', path: '/api/room', description: 'Create room' },
    { method: 'GET', path: '/api/room/test-id', description: 'Get room by ID' },
    { method: 'PUT', path: '/api/room/test-id', description: 'Update room' },
    { method: 'DELETE', path: '/api/room/test-id', description: 'Delete room' },
    { method: 'POST', path: '/api/room/test-id/images', description: 'Upload room images' },
    { method: 'PUT', path: '/api/room/test-id/status', description: 'Update room status' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      // Add body for POST/PUT requests
      if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        options.body = JSON.stringify({ test: 'data' });
      }
      
      const response = await fetch(`${API_URL}${endpoint.path}`, options);
      
      results.push({
        endpoint: `${endpoint.method} ${endpoint.path}`,
        description: endpoint.description,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        allowed: response.status !== 405
      });
      
      console.log(`${endpoint.method} ${endpoint.path}: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      results.push({
        endpoint: `${endpoint.method} ${endpoint.path}`,
        description: endpoint.description,
        error: error.message,
        allowed: false
      });
      
      console.error(`${endpoint.method} ${endpoint.path}: Error - ${error.message}`);
    }
  }
  
  return results;
};

/**
 * Test authentication endpoints
 */
export const testAuthEndpoints = async () => {
  console.log('Testing authentication endpoints...');
  
  const endpoints = [
    { method: 'POST', path: '/api/auth/login', description: 'Login' },
    { method: 'POST', path: '/api/auth/register', description: 'Register' },
    { method: 'POST', path: '/api/auth/refresh-token', description: 'Refresh token' },
    { method: 'POST', path: '/api/auth/revoke-token', description: 'Revoke token' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      results.push({
        endpoint: `${endpoint.method} ${endpoint.path}`,
        description: endpoint.description,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        allowed: response.status !== 405
      });
      
      console.log(`${endpoint.method} ${endpoint.path}: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      results.push({
        endpoint: `${endpoint.method} ${endpoint.path}`,
        description: endpoint.description,
        error: error.message,
        allowed: false
      });
      
      console.error(`${endpoint.method} ${endpoint.path}: Error - ${error.message}`);
    }
  }
  
  return results;
};

/**
 * Test image upload endpoint specifically
 */
export const testImageUpload = async (roomId = 'test-room-id') => {
  console.log('🧪 Testing image upload endpoint...');
  
  try {
    // Create a test file
    const testFile = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('files', testFile);
    
    console.log('📁 Test FormData:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await fetch(`${API_URL}/api/room/${roomId}/images`, {
      method: 'POST',
      body: formData
    });
    
    console.log('📡 Image upload test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('✅ Image upload test successful:', result);
        return { success: true, result };
      } else {
        console.log('⚠️ Image upload test: Non-JSON response but successful');
        return { success: true, message: 'Non-JSON response' };
      }
    } else {
      console.log('❌ Image upload test failed:', response.status, response.statusText);
      return { success: false, status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error('❌ Image upload test error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test the working GET /api/room endpoint to see the data structure
 */
export const testWorkingRoomEndpoint = async () => {
  console.log('🧪 Testing working GET /api/room endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/api/room`);
    
    console.log('📡 GET /api/room response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      contentType: response.headers.get('content-type')
    });
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('✅ GET /api/room successful:', result);
        return { success: true, result };
      } else {
        const text = await response.text();
        console.log('⚠️ GET /api/room: Non-JSON response:', text.substring(0, 200));
        return { success: true, message: 'Non-JSON response', text: text.substring(0, 200) };
      }
    } else {
      console.log('❌ GET /api/room failed:', response.status, response.statusText);
      return { success: false, status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error('❌ GET /api/room error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Run all API tests
 */
export const runAllApiTests = async () => {
  console.log('=== API Connectivity Test ===');
  const connectivity = await testApiConnectivity();
  
  console.log('\n=== Room Endpoints Test ===');
  const roomResults = await testRoomEndpoints();
  
  console.log('\n=== Auth Endpoints Test ===');
  const authResults = await testAuthEndpoints();
  
  console.log('\n=== Test Summary ===');
  console.log('API Connectivity:', connectivity ? '✅ Connected' : '❌ Failed');
  
  console.log('\nRoom Endpoints:');
  roomResults.forEach(result => {
    const status = result.allowed ? '✅' : '❌';
    console.log(`${status} ${result.endpoint} - ${result.description} (${result.status || 'Error'})`);
  });
  
  console.log('\nAuth Endpoints:');
  authResults.forEach(result => {
    const status = result.allowed ? '✅' : '❌';
    console.log(`${status} ${result.endpoint} - ${result.description} (${result.status || 'Error'})`);
  });
  
  return {
    connectivity,
    roomResults,
    authResults
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.apiTest = {
    testApiConnectivity,
    testRoomEndpoints,
    testAuthEndpoints,
    testImageUpload,
    testWorkingRoomEndpoint,
    runAllApiTests
  };
} 