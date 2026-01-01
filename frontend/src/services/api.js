import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

api.interceptors.request.use((config) => {
  // Token'ı her istek atıldığında o anki hafızadan çekiyoruz kanka
  const token = localStorage.getItem('token'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;