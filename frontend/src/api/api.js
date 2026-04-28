import axios from 'axios';

// Create an Axios instance pointing to your Node backend
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

// This acts like a middleman: before ANY request leaves your frontend,
// it checks if you have a login token saved, and attaches it to the request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;