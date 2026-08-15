import api from './axios';

export const userAPI = {
  updateProfile: async (profileData) => {
    const { data } = await api.patch('/users/updateMe', profileData);

    return data;
  },
  updatePassword: async (password) => {
    const { data } = await api.patch('/users/updatePassword', password);

    return data;
  },
  updateEmail: async (updatedEmail) => {
    const { data } = await api.patch('/users/updateEmail', updatedEmail);

    return data;
  },
  verifyEmail: async (otp) => {
    const { data } = await api.post('/users/updateEmail/verify-otp', otp);

    return data;
  },
  resendOtp: async () => {
    const { data } = await api.post('/users/updateEmail/resend-otp');

    return data;
  },
};
