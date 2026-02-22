import API from './api'

export const authService = {
    // ── Unified login dispatcher ───────────────────────────────────────
    login: (role, identifier, password) => {
        const endpoints = {
            farmer: '/auth/login/farmer',
            expert: '/auth/login/expert',
            admin: '/auth/login/admin',
            financier: '/auth/login/financier',
        }
        const url = endpoints[role]
        if (!url) return Promise.reject(new Error(`Unknown role: ${role}`))
        return API.post(url, { identifier, password })
    },

    // ── Per-role register ──────────────────────────────────────────────
    registerFarmer: (data) => API.post('/auth/register/farmer', data),
    registerExpert: (data) => API.post('/auth/register/expert', data),
    registerFinancier: (data) => API.post('/auth/register/financier', data),

    // ── OTP helpers ───────────────────────────────────────────────────
    sendOTP: (email) => API.post('/auth/send-otp', { email }),
    verifyOTP: (email, otp) => API.post('/auth/verify-otp', { email, otp }),
    resetPassword: (data) => API.post('/auth/reset-password', data),
}

export default authService
