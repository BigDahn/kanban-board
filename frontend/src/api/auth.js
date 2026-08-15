import api from './axios';

export const authAPI = {
  login: async (credentials) => {
    const { data } = await api.post('/users/login', credentials);
    return data;
  },

  register: async (credentials) => {
    const { data } = await api.post('/users/signup', credentials);
    return data;
  },
  forgotPassword: async (credentials) => {
    const { data } = await api.post('/users/forgotPassword', credentials);
    return data;
  },
  resetPassword: async ({ data: credentials, token }) => {
    const { data } = await api.patch(
      `/users/resetPassword/${token}`,
      credentials,
    );

    return data;
  },
  logout: async () => {
    const { data } = await api.post('/users/logout');
    return data;
  },
  getCurrentUser: async () => {
    const {
      data: { data },
    } = await api.get('/users/getMe');

    return data.user;
  },
  deleteUser: async (credentials) => {
    const { data } = await api.delete('/users/deleteMe', {
      data: credentials,
    });

    return data;
  },
};
