import { create } from 'zustand';
import { authAPI } from '../api/services';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { accessToken, email: userEmail, roles } = response.data.data;
      const user = { email: userEmail, roles };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
