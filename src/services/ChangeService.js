import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';

// Configuration - Move to .env in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Bearer token
// Note: In a real app with MSAL, you might need to acquireTokenSilent here if standard flow
// For now, we assume the token is stored or handled via a wrapper.
// Given the requirement "adjuntar el Bearer Token", we'll simulate retrieving it from sessionStorage or similar 
// if using simple auth, BUT specifically with MSAL-React, the recommended way is slightly different.
// However, to keep ChangeService independent, we can allow setting the token or use an async interceptor.

api.interceptors.request.use(async (config) => {
    // Basic placeholder logic for token injection. 
    // In full implementation, this should interact with msal instance.
    const token = sessionStorage.getItem('msal_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const ChangeService = {
    getAll: async () => {
        const response = await api.get('/changes');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/changes/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/changes', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/changes/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status, comment) => {
        const response = await api.patch(`/changes/${id}/status`, { status, comment });
        return response.data;
    },

    uploadAttachment: async (id, file, hash) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hash', hash);
        const response = await api.post(`/changes/${id}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }
};

export default ChangeService;
export { api };
