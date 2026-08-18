import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hrflow_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
            localStorage.setItem('hrflow_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.error('Failed to authenticate session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('hrflow_token', newToken);
        localStorage.setItem('hrflow_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return {
        success: false,
        message: res.data?.message || 'Login failed. Please check your credentials.',
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.customMessage ||
          'Unable to sign in. Please verify your internet connection and server status.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('hrflow_token', newToken);
        localStorage.setItem('hrflow_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return {
        success: false,
        message: res.data?.message || 'Registration failed.',
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.customMessage ||
          'Unable to complete registration. Please check the backend connection and try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hrflow_token');
    localStorage.removeItem('hrflow_user');
  };

  const demoLogin = async (roleType) => {
    let email = 'candidate@hrflow.ai';
    if (roleType === 'recruiter') email = 'recruiter@hrflow.ai';
    if (roleType === 'admin') email = 'admin@hrflow.ai';

    return login(email, 'password123');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hrflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        demoLogin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
