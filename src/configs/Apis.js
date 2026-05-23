import axios from "axios";

export const endpoints = {
    'login': '/login',
    'register': '/users',
    'current-user': '/secure/profile',
    'overdue-documents': '/stats/secure/overdue-documents',
    'categories-stats': '/stats/secure/categories',
    'user-majors-stats': '/stats/secure/user-majors',
    'authors-stats': '/stats/secure/authors',
    'reviews-stats': '/stats/secure/reviews',
    'buy': '/secure/buys',
    'documents': '/documents',
    'categories': '/categories',
    'secure-categories': '/secure/categories',
    'delete-document': (documentId) => `/documents/${documentId}`,
}

export const authApi = (token) => {
    return axios.create({
        baseURL: 'http://localhost:8080/eLibrary_war/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: 'http://localhost:8080/eLibrary_war/api/'
})