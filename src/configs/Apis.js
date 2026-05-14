import axios from "axios";

export const endpoints = {
    'login': '/login',
    'register': '/users',
    'current-user': '/secure/profile',
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