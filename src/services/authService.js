import { api } from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      return response.user;
    }
    throw new Error('Invalid response from server');
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
    // This is a temporary solution until the backend is ready
    // Replace with actual token verification
    return {
      email: 'user@example.com',
      name: 'Test User',
      isAdmin: false
    };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};