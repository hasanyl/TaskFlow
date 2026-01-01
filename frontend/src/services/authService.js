import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    if (response.data && response.data.token) {
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  register: async (fullname, email, password) => {
    const response = await api.post('/auth/register', {
      fullname,
      email,
      password,
      role: 'employee'
    });
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile', userData);

    if (response.data && response.data.user) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response.data;
  }
};