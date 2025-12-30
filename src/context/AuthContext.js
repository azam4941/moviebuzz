import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  // Check if setup is needed (no admins exist)
  const checkSetupStatus = async () => {
    try {
      const response = await axios.get('/api/auth/setup-status');
      setSetupRequired(response.data.setupRequired);
      return response.data.setupRequired;
    } catch (error) {
      console.error('Setup status check failed:', error);
      return false;
    }
  };

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
        }
      }
      await checkSetupStatus();
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  // Setup first admin
  const setupAdmin = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/setup', { username, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setUser(userData);
      setSetupRequired(false);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Setup failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  };

  // Get auth header for API calls
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    setupRequired,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
    setupAdmin,
    getAuthHeader,
    checkSetupStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

