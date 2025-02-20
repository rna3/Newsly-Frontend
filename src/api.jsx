import axios from 'axios';
import { getNavigate } from './navigation';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  withCredentials: true,
});

// Request interceptor: automatically attach the token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: redirect to login on token errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && 
      (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token and redirect to login.
      localStorage.removeItem('token');
      // Use our global navigate function.
      const navigate = getNavigate();
      if (navigate) {
        navigate('/login', { replace: true })}
    }
    return Promise.reject(error);
  }
);

export default api;
