import API from './api'

export const authService = {
    loginFarmer: (data) => API.post('/auth/login/farmer', data),
    loginExpert: (data) => API.post('/auth/login/expert', data),
    loginAdmin: (data) => API.post('/auth/login/admin', data),
    loginFinancier: (data) => API.post('/auth/login/financier', data),

    registerFarmer: (data) => API.post('/auth/register/farmer', data),
    registerExpert: (data) => API.post('/auth/register/expert', data),

    sendOTP: (email) => API.post('/auth/send-otp', { email }),
    verifyOTP: (data) => API.post('/auth/verify-otp', data),
    resetPassword: (data) => API.post('/auth/reset-password', data),
}

export default authService
