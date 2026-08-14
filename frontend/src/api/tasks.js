import api from './axios';

export const TasksApi = {
  addTask: async ({ data: credential, slug }) => {
    const { data } = await api.post(`/boards/AddNewTask/${slug}`, credential);
    return data;
  },
  editTask: async ({ data: credential, slug, taskId }) => {
    const { data } = await api.patch(
      `/boards/${slug}/editTask/${taskId}`,
      credential,
    );

    return data;
  },
  deleteTask: async ({ slug, taskId }) => {
    const { data } = await api.delete(`/boards/${slug}/deleteTask/${taskId}`);
    return data;
  },
};
