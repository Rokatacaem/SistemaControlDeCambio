import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig'; // We will create this next

// Initialize MSAL outside to reuse for token acquisition
export const msalInstance = new PublicClientApplication(msalConfig);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    // Acquire Token Logic for Azure AD
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        try {
            const request = {
                scopes: ["User.Read"],
                account: accounts[0]
            };
            const response = await msalInstance.acquireTokenSilent(request);
            config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
            console.error("Token acquisition failed", error);
            // Fallback to interaction or simple fail
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
