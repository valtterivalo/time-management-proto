import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in by looking for token in localStorage
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Try to verify token with backend
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          setUser({ 
            ...res.data,
            token
          });
        } catch (err) {
          console.error('Token validation error:', err);
          
          // Fallback in development - use stored email
          if (process.env.NODE_ENV === 'development') {
            const email = localStorage.getItem('userEmail');
            if (email) {
              // Create a more complete mock user object
              setUser({ 
                id: 'mock-id-' + Date.now(),
                email,
                name: email.split('@')[0], // Create a name from email
                token 
              });
            } else {
              // Clear invalid token
              localStorage.removeItem('token');
              localStorage.removeItem('userEmail');
            }
          } else {
            // In production, clear invalid tokens
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Save token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      
      setUser({ 
        ...res.data.user,
        token: res.data.token
      });
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with an error status
        setError(err.response.data.msg || 'Login failed');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Server not responding. Please try again later.');
        
        // Fallback for development
        if (process.env.NODE_ENV === 'development') {
          const token = 'mock-token-' + Date.now();
          localStorage.setItem('token', token);
          localStorage.setItem('userEmail', email);
          // Create a more complete mock user object that matches what the backend would return
          setUser({ 
            id: 'mock-id-' + Date.now(),
            email, 
            name: email.split('@')[0], // Create a name from email
            token 
          });
          return true;
        }
      } else {
        // Something else caused the error
        setError('Login error: ' + err.message);
      }
      
      throw err;
    }
  };

  const register = async (email, password, name) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password, name });
      
      // Save token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      
      setUser({
        ...res.data.user,
        token: res.data.token
      });
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with an error status
        setError(err.response.data.msg || 'Registration failed');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Server not responding. Please try again later.');
        
        // Fallback for development
        if (process.env.NODE_ENV === 'development') {
          const token = 'mock-token-' + Date.now();
          localStorage.setItem('token', token);
          localStorage.setItem('userEmail', email);
          // Create a more complete mock user object
          setUser({ 
            id: 'mock-id-' + Date.now(),
            email, 
            name, 
            token 
          });
          return true;
        }
      } else {
        // Something else caused the error
        setError('Registration error: ' + err.message);
      }
      
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};