import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Attempt token refresh on 401 when using Cognito, retry request once.
// Never log out on 400, 403, 404, 422, 429, or 500 errors.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { cognitoGetCurrentToken } = await import('../lib/cognito');
        const freshToken = await cognitoGetCurrentToken();
        if (freshToken) {
          localStorage.setItem('token', freshToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          }
          return client(originalRequest);
        }
      } catch (refreshErr) {
        console.debug('Silent token refresh failed:', refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
