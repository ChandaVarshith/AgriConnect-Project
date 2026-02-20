import API from './api'

export const loanService = {
    getLoans: (params) => API.get('/loans', { params }),
    getLoanById: (id) => API.get(`/loans/${id}`),
    addLoan: (data) => API.post('/loans', data),
    updateLoan: (id, d) => API.put(`/loans/${id}`, d),
    deleteLoan: (id) => API.delete(`/loans/${id}`),

    applyForLoan: (data) => API.post('/loans/apply', data),
    getApplications: () => API.get('/loans/applications'),
    getMyApplications: () => API.get('/loans/applications/mine'),
    updateApplicationStatus: (id, status) => API.patch(`/loans/applications/${id}`, { status }),
}

export default loanService
