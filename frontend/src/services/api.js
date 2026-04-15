/**
 * services/api.js - Axios instance with JWT interceptor
 */
import axios from 'axios';
import { getStoredUser, clearStoredUser } from '../utils/authStorage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

const getLoginUrl = () => {
  const publicUrl = (process.env.PUBLIC_URL || '').trim();
  if (!publicUrl) return '/login';
  const normalized = publicUrl.endsWith('/')
    ? publicUrl.slice(0, -1)
    : publicUrl;
  return `${normalized}/login`;
};

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
      window.location.href = getLoginUrl();
    }
    return Promise.reject(error);
  }
);

export default api;
