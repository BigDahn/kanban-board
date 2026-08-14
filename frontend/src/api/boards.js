import api from './axios';

export const BoardsApi = {
  getAllBoard: async () => {
    const { data } = await api.get('/boards/getAllBoards');

    return data.data;
  },
  getBoard: async (slug) => {
    const { data } = await api.get(`/boards/getBoard/${slug}`);

    return data.data;
  },
  addNewBoard: async (credential) => {
    const { data } = await api.post('/boards/createBoard', credential);
    return data;
  },
  editBoard: async ({ data: credential, slug }) => {
    const { data } = await api.patch(`/boards/editBoard/${slug}`, credential);

    return data;
  },
  addStatus: async ({ column, slug }) => {
    const { data } = await api.post(`/boards/AddNewColumn/${slug}`, { column });

    return data;
  },
  deleteBoard: async (slug) => {
    const { data } = await api.delete(`/boards/deleteCurrentBoard/${slug}`);

    return data;
  },
};
