export const msalConfig = {
    auth: {
        clientId: 'YOUR_CLIENT_ID_GUID', // Replace with Azure AD App ID
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with Tenant ID
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'sessionStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ["User.Read"]
};
