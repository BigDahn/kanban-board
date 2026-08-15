import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes('/users/login') &&
      !error.config.url.includes('/users/forgotPassword') &&
      !error.config.url.includes('/users/signup') &&
      !error.config.url.includes('/users/updatePassword') &&
      !error.config.url.includes('/users/updateEmail') &&
      !error.config.url.includes('/users/deleteMe')
    ) {
      await axios
        .post('/api/v1/users/logout', {}, { withCredentials: true })
        .catch(() => {});
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
