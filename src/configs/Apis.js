import axios from "axios";

export const endpoints = {
    'login': '/login',
    'register': '/users',
    'current-user': '/secure/profile',
    'categories': '/categories',
    'documents': '/documents',
    "secure-borrows": "/secure/borrows",
    'secure-buy': '/secure/buy',
    'document-details': (docId) => `/documents/${docId}`,
    'increase-view': (docId) => `/documents/${docId}/views`,
    'latest-docs': '/documents/latest',
    'trend-docs': '/documents/trend',
    'my-buys': '/secure/buy',
    'my-borrows': '/secure/borrows',
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