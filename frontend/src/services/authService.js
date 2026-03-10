import api from './api'

const endpoints = {
    farmer: '/auth/login/farmer',
    expert: '/auth/login/expert',
    admin: '/auth/login/admin',
    financier: '/auth/login/financier',
    public: '/auth/login/public',
}

const authService = {
    login: (role, identifier, password) => {
        const url = endpoints[role]
        if (!url) throw new Error(`Unknown role: ${role}`)
        return api.post(url, { identifier, password })
    },

    registerFarmer: (data) => api.post('/auth/register/farmer', data),
    registerExpert: (data) => api.post('/auth/register/expert', data),
    registerFinancier: (data) => api.post('/auth/register/financier', data),
    registerPublic: (name, email, password) => api.post('/auth/register/public', { name, email, password }),

    sendOTP: (data) => api.post('/auth/send-otp', data),
    verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
}

export default authService
