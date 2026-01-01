import api from './api';

export const employeeService = {
    getMyTasks: async () => {
        const response = await api.get('/tasks/my/tasks');
        return response.data.data || response.data;
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await api.patch(`/tasks/${taskId}/status`, { status });
        return response.data;
    }
};
