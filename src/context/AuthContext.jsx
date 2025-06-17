import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginService, logout as logoutService, autoRefreshToken } from '../services/authService';

// Create authentication context
const AuthContext = createContext(null);

/**
 * AuthProvider component that manages authentication state
 * Provides user authentication context to all child components
 * Now integrated with JWT token management and auto-refresh
 * 
 * @param {Object} children - Child components to wrap with auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current authenticated user
  const [loading, setLoading] = useState(true); // Loading state during auth check

  // Check for existing authentication on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Set up auto token refresh
  useEffect(() => {
    if (user) {
      // Check token expiry every minute
      const interval = setInterval(() => {
        autoRefreshToken().catch(error => {
          console.error('Auto refresh failed:', error);
          // If auto refresh fails, logout user
          logout();
        });
      }, 60 * 1000); // 1 minute

      return () => clearInterval(interval);
    }
  }, [user]);

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
  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  /**
   * Update user data in context
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 * 
 * @returns {Object} Authentication context with user, login, logout, and updateUser
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};