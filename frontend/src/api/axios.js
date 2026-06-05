import axios from 'axios';

const api = axios.create({
baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const isAuthRoute =
      err.config?.url?.includes('/auth/login') ||
      err.config?.url?.includes('/auth/register');

    if ((status === 401 || status === 403) && !isAuthRoute) {
      localStorage.removeItem('mn_token');
      const path = window.location.pathname;
      const isPublic =
        path === '/' ||
        path.startsWith('/products') ||
        path === '/login' ||
        path === '/signup';

      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
