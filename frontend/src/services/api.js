import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

export const getGems      = (params = {}) => API.get('/gems', { params });
export const submitInquiry = (data)       => API.post('/inquiries', data);
export default API;
