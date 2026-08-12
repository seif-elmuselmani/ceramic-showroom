import axios from 'axios';
import { showToastNotification } from '../components/ToastNotification';

// Automatically detects local dev environment vs Vercel live server
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

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

// Handle 401 or 403 token expiration and network/500 errors gracefully with toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('ceramic_admin_token');
      } else if (error.response.status >= 500) {
        showToastNotification('تعذر الاتصال بالخادم الرئيسي، جاري استعادة البيانات تلقائياً', 'warning', 4500);
      }
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      showToastNotification('تنبيه: انقطاع مؤقت في الاتصال بالشبكة، يرجى الفحص', 'danger', 5000);
    }
    return Promise.reject(error);
  }
);

export const getSettings = () => api.get('/settings');
export const getCategories = () => api.get('/categories');
export const getBrands = () => api.get('/brands');
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

export const addCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export default api;
