import { api } from './api';

export const login = async (email, password) => {
  try {
    // Simulate admin login check
    if (email === 'admin@wphhotel.com' && password === 'Admin123!') {
      const adminUser = {
        id: '1',
        email: 'admin@wphhotel.com',
        name: 'Hotel Admin',
        isAdmin: true
      };
      localStorage.setItem('token', 'admin-token');
      return adminUser;
    }
    
    throw new Error('Invalid admin credentials');
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const register = async (email, password, name) => {
  try {
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

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Check if it's the admin token
    if (token === 'admin-token') {
      return {
        id: '1',
        email: 'admin@wphhotel.com',
        name: 'Hotel Admin',
        isAdmin: true
      };
    }
    
    return null;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};