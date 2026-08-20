import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hrflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hrflow_token'));
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session once on initial mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('hrflow_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('hrflow_user', JSON.stringify(res.data.data.user));
          } else {
            logout();
          }
        } catch {
          // If token is expired or unauthorized, clean state
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setIsInitialized(true);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data?.success && res.data?.data) {
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
          'Unable to sign in. Please verify your connection and try again.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', {
        ...userData,
        email: userData.email.trim().toLowerCase(),
      });

      if (res.data?.success && res.data?.data) {
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

  const socialLogin = async (provider, role = 'candidate') => {
    try {
      // Mock/simulated OAuth user payload or live OAuth exchange
      const mockOAuthEmail = `${provider.toLowerCase()}.user@example.com`;
      const mockOAuthName = `${provider} Verified User`;
      const res = await api.post('/auth/social', {
        provider,
        email: mockOAuthEmail,
        name: mockOAuthName,
        role,
        avatar:
          provider === 'Google'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      });

      if (res.data?.success && res.data?.data) {
        const { token: newToken, user: newUser } = res.data.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('hrflow_token', newToken);
        localStorage.setItem('hrflow_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return {
        success: false,
        message: res.data?.message || `${provider} sign-in failed.`,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.customMessage ||
          `Unable to complete ${provider} authentication.`,
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
        isInitialized,
        login,
        register,
        socialLogin,
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
