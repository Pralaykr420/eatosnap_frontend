import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const restaurantAPI = {
  getAll: params => api.get('/restaurants', { params }),
  getOne: id => api.get(`/restaurants/${id}`),
  create: data => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: id => api.delete(`/restaurants/${id}`),
};

export const productAPI = {
  getAll: params => api.get('/products', { params }),
  getOne: id => api.get(`/products/${id}`),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getOne: id => api.get(`/orders/${id}`),
  create: data => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  addReview: (id, data) => api.put(`/orders/${id}/review`, data),
};

export const reelAPI = {
  getAll: params => api.get('/reels', { params }),
  getOne: id => api.get(`/reels/${id}`),
  create: data => api.post('/reels', data),
  like: id => api.post(`/reels/${id}/like`),
  comment: (id, text) => api.post(`/reels/${id}/comment`, { text }),
  delete: id => api.delete(`/reels/${id}`),
};

export default api;
