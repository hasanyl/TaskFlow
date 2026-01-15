import api from './api';

export const taskService = {
  getMyTasks: async () => {
    try {
      const response = await api.get('/tasks/my/tasks'); 
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Görevler getirilemedi.';
    }
  }
};
