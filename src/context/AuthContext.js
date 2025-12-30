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
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);

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
          localStorage.removeItem('userToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Register function
  const register = async (username, password, mobile) => {
    try {
      const response = await axios.post('/api/auth/register', { username, password, mobile });
      return { 
        success: true, 
        message: response.data.message,
        userId: response.data.userId,
        otp: response.data.otp // OTP for display (demo mode)
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  // Send OTP function
  const sendOtp = async (mobile) => {
    try {
      const response = await axios.post('/api/auth/send-otp', { mobile });
      return { 
        success: true, 
        message: response.data.message,
        otp: response.data.otp // OTP for display (demo mode)
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send OTP.' 
      };
    }
  };

  // Verify OTP function
  const verifyOtp = async (mobile, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { mobile, otp });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'OTP verification failed.' 
      };
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      return { 
        success: false, 
        error: errorData?.error || 'Login failed. Please try again.',
        needsVerification: errorData?.needsVerification,
        mobile: errorData?.mobile
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userToken');
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
    isAuthenticated: !!user && !!token,
    isVerified: user?.isVerified || false,
    register,
    sendOtp,
    verifyOtp,
    login,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
