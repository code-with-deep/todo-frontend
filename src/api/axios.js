import axios from 'axios';

// Module-level token that AuthContext keeps in sync
let _token = localStorage.getItem('token');

export function setAxiosToken(token) {
  _token = token;
}

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: false
});

api.interceptors.request.use(config => {
  const token = _token || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(err);
  }
);

export default api;
