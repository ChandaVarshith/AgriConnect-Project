import API from './api'

export const marketplaceService = {
    getListings: (params) => API.get('/marketplace', { params }),
    getListingById: (id) => API.get(`/marketplace/${id}`),
    createListing: (data) => API.post('/marketplace', data),
    updateListing: (id, d) => API.put(`/marketplace/${id}`, d),
    deleteListing: (id) => API.delete(`/marketplace/${id}`),
    purchaseProduce: (id, d) => API.post(`/marketplace/${id}/purchase`, d),
    getMyListings: () => API.get('/marketplace/mine'),
}

export default marketplaceService
