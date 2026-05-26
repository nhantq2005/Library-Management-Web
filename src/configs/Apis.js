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
    'buy-stats': '/stats/secure/buys',
    'buy': '/secure/buys',
    'documents': '/documents',
    'categories': '/categories',
    'secure-categories': '/secure/categories',
    'delete-document': (documentId) => `/documents/${documentId}`,
    "secure-borrows": "/secure/borrows",
    'secure-buy': '/secure/buy',
    'document-details': (docId) => `/documents/${docId}`,
    'increase-view': (docId) => `/documents/${docId}/views`,
    'latest-docs': '/documents/latest',
    'trend-docs': '/documents/trend',
    'my-buys': '/secure/buy',
    'my-borrows': '/secure/borrows',
    'tags': '/tags',
    'authors': '/authors',
    'add-tag': '/secure/tags',
    'add-author': '/secure/authors',
    'reviews': (docId) => `/documents/${docId}/reviews`,
    'add-review': (docId) => `/secure/documents/${docId}/reviews`
}

export const authApi = (token) => {
    return axios.create({
        baseURL: 'http://localhost:8080/eLibrary/api/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: 'http://localhost:8080/eLibrary/api/'
})