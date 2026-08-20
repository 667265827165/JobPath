import axios from 'axios';

// Use environment variable for production (e.g. Render backend) or fallback to '/api' for Vite proxy
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: format user-friendly errors & handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        error.customMessage = 'Authentication request timed out. Please check your network and try again.';
      } else {
        error.customMessage = 'Unable to connect to the backend server. Please verify the API service is running.';
      }
    } else if (error.response.status === 401) {
      // Token invalid or expired on protected routes
      if (
        window.location.pathname.includes('/candidate') ||
        window.location.pathname.includes('/recruiter') ||
        window.location.pathname.includes('/admin')
      ) {
        localStorage.removeItem('hrflow_token');
        localStorage.removeItem('hrflow_user');
      }
    } else if (error.response.status === 409) {
      error.customMessage = error.response.data?.message || 'An account with this email already exists.';
    } else if (error.response.status === 400) {
      error.customMessage = error.response.data?.message || 'Invalid request. Please check the entered details.';
    } else if (error.response.status >= 500) {
      error.customMessage = 'Server error encountered. Please try again in a moment.';
    }
    return Promise.reject(error);
  }
);

export default api;
