import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Backend URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
