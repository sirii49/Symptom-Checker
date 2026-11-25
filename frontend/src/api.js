import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Expired or invalid session: clear it and go to the login page
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.startsWith('/auth')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = (body) => api.post('/auth/register', body).then((r) => r.data);
export const login = (body) => api.post('/auth/login', body).then((r) => r.data);
export const getSymptoms = () => api.get('/symptoms').then((r) => r.data);
export const checkSymptoms = (body) => api.post('/check', body).then((r) => r.data);
export const getHistory = () => api.get('/history').then((r) => r.data);
export const deleteCheck = (id) => api.delete(`/history/${id}`);
export const clearHistory = () => api.delete('/history');
