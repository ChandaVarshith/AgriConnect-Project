import API from './api'

export const queryService = {
    submitQuery: (data) => API.post('/queries', data),
    getMyQueries: () => API.get('/queries/farmer'),
    getAllQueries: () => API.get('/queries/all'),
    getQueryById: (id) => API.get(`/queries/${id}`),
    submitResponse: (id, data) => API.post(`/queries/${id}/respond`, data),
    getQueryResponses: (id) => API.get(`/queries/${id}/responses`),
    markResolved: (id) => API.patch(`/queries/${id}/resolve`),
    getExpertResponses: () => API.get('/queries/expert/responses'),
}

export default queryService
