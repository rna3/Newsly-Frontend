import React, { createContext, useState, useEffect } from 'react';
import api from '../../src/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch current user info using /auth/me endpoint
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = () => {
    // After a successful login, cookies are set, so fetch the user info.
    fetchUser();
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    setIsAuthenticated(false);
    alert("You have been logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
