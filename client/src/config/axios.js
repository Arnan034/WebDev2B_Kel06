import axios from 'axios';
const API_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT || 30000,
  headers: {
    'Accept': 'application/json',
  }
});

// Tambahkan interceptor untuk mengatur Content-Type secara dinamis
axiosInstance.interceptors.request.use(config => {
  // Jika data adalah FormData, hapus Content-Type agar axios mengaturnya secara otomatis
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage atau state management
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (role) {
      config.headers['x-role'] = role;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error global disini
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      // // Redirect berdasarkan current path
      const currentPath = window.location.pathname;
      const redirectPath = currentPath === '/signin' ? '/' : '/signin';
      window.location.href = redirectPath;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
