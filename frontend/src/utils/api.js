import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const googleAuth = async (idToken) => {
  const response = await api.post('/auth/google', { idToken });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/auth/bookmarks');
  return response.data;
};

export const toggleBookmark = async (id) => {
  const response = await api.post(`/auth/bookmarks/${id}`);
  return response.data;
};

// History
export const getHistory = async () => {
  const response = await api.get('/auth/history');
  return response.data;
};

export const addToHistory = async (id) => {
  const response = await api.post(`/auth/history/${id}`);
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/auth/history');
  return response.data;
};

// Laws
export const getLaws = async (params) => {
  const response = await api.get('/laws', { params });
  return response.data;
};

export const searchLaws = async (q) => {
  const response = await api.get('/search', { params: { q } });
  return response.data;
};

// Admin
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getTopLaws = async () => {
  const response = await api.get('/stats/top-laws');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleBan = async (id) => {
  const response = await api.patch(`/admin/users/${id}/ban`);
  return response.data;
};

export const changeRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export default api;
