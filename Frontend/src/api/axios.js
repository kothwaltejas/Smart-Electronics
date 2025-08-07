import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://smart-electronics-ne2p.onrender.com/api", // use your backend base URLbaseURL: "http://localhost:5000/api",
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect on 401 if it's not a login attempt
    if (error.response?.status === 401 && 
        !error.config?.url?.includes('/auth/login') && 
        !error.config?.url?.includes('/auth/register')) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect on login page to avoid refresh loops
      if (!window.location.pathname.includes('/login')) {
        // Use history.pushState to avoid page reload
        window.history.pushState(null, '', '/login');
        // Dispatch a custom event to notify React Router
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
