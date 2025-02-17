import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

// Create a context for authentication
export const AuthContext = createContext();

// Provider component to wrap your app and provide auth state and functions
export const AuthProvider = ({ children }) => {
  // Initialize state based on whether a token exists in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Login function to store token and update auth state
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Logout function to remove token and update auth state
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Check token validity on mount.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        // Check if token is expired. JWT "exp" is in seconds; multiply by 1000 to compare with Date.now().
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  // Listen to storage changes if multiple tabs are open:
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
