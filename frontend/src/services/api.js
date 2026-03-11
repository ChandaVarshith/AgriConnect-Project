import axios from 'axios'

// Automatically format the provided VITE_API_URL so it correctly appends /api
let rawUrl = import.meta.env.VITE_API_URL || 'https://agriconnect-project-a44i.onrender.com/api';
if (rawUrl.includes('your-render-app-url')) {
    rawUrl = 'https://agriconnect-project-a44i.onrender.com/api';
}
if (rawUrl.endsWith('/')) rawUrl = rawUrl.slice(0, -1); // remove trailing slash
if (!rawUrl.endsWith('/api')) rawUrl += '/api'; // force /api suffix

const API = axios.create({
    baseURL: rawUrl,
})

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 globally (token expired)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default API
