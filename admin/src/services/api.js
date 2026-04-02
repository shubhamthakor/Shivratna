import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login       = (data)     => API.post('/auth/login', data);
export const verifyToken = ()         => API.get('/auth/verify');

// Gems
export const getAllGems  = ()         => API.get('/gems/admin/all');
export const addGem      = (data)     => API.post('/gems', data);
export const updateGem   = (id, data) => API.put(`/gems/${id}`, data);
export const deleteGem   = (id)       => API.delete(`/gems/${id}`);
export const toggleGem   = (id)       => API.patch(`/gems/${id}/toggle`);

// Inquiries
export const getInquiries    = (params) => API.get('/inquiries', { params });
export const markRead        = (id)     => API.patch(`/inquiries/${id}/read`);
export const updateInquiry   = (id, data)=> API.patch(`/inquiries/${id}/status`, data);
export const deleteInquiry   = (id)     => API.delete(`/inquiries/${id}`);

export default API;
