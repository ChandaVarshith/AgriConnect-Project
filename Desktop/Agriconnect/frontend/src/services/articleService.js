import API from './api'

export const articleService = {
    getArticles: (params) => API.get('/articles', { params }),
    getArticleById: (id) => API.get(`/articles/${id}`),
    createArticle: (data) => API.post('/articles', data),
    updateArticle: (id, d) => API.put(`/articles/${id}`, d),
    publishArticle: (id) => API.patch(`/articles/${id}/publish`),
    deleteArticle: (id) => API.delete(`/articles/${id}`),
}

export default articleService
