import api from './axios';

export const notificationsAPI = {
  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data.data;
  },
  markAllAsRead: async () => {
    const { data } = await api.patch('/notifications/mark-all-read');
    return data;
  },
  deleteAllNotifications: async () => {
    const { data } = await api.delete('/notifications/delete-all');
    return data;
  },
  markAsRead: async (id) => {
    const { data } = await api.patch(`/notifications/${id}`);
    return data;
  },
  deleteNotification: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};
