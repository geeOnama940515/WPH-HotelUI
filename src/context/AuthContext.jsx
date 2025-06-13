import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginService, logout as logoutService } from '../services/authService';

// Create authentication context
const AuthContext = createContext(null);

/**
 * AuthProvider component that manages authentication state
 * Provides user authentication context to all child components
 * 
 * @param {Object} children - Child components to wrap with auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current authenticated user
  const [loading, setLoading] = useState(true); // Loading state during auth check

  // Check for existing authentication on component mount
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  /**
   * Login function that authenticates user and updates state
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} User object if successful
   */
  const login = async (email, password) => {
    try {
      const user = await loginService(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout function that clears user state and removes tokens
   */
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 * 
 * @returns {Object} Authentication context with user, login, and logout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};