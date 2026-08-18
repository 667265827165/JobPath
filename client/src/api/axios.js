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
      // Network error or backend server not reachable
      error.customMessage = 'Unable to reach backend server. Please verify the API service is running.';
    } else if (error.response.status === 401) {
      // Token invalid or expired
      if (
        window.location.pathname.includes('/candidate') ||
        window.location.pathname.includes('/recruiter') ||
        window.location.pathname.includes('/admin')
      ) {
        localStorage.removeItem('hrflow_token');
        localStorage.removeItem('hrflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
