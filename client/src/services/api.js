import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ceramic_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSettings = () => api.get('/settings');
export const getCategories = () => api.get('/categories');
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);

// Admin API
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const updateSettings = (data) => api.put('/settings', data);
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadImage = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
