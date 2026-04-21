import { create } from 'zustand';
import { authAPI, usersAPI } from '../api/services';

export const getRoleRedirect = (roles = []) => {
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) return '/admin';
  if (roles.includes('ARCHITECT') || roles.includes('PROJECT_MANAGER') || roles.includes('STAFF')) return '/architect';
  if (roles.includes('CLIENT')) return '/client';
  return '/';
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  if (Array.isArray(roles)) return roles;
  if (typeof roles === 'string') return roles.split(',').map(r => r.trim());
  return [];
};

const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u && u.roles) u.roles = normalizeRoles(u.roles);
      return u;
    } catch { return null; }
  })(),
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { accessToken, email: userEmail, roles } = response.data.data;
      const normalizedRoles = normalizeRoles(roles);

      // Temporary user object from login response
      const user = { email: userEmail, fullname: userEmail, roles: normalizedRoles };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });

      // Fetch full user profile immediately after login
      await get().fetchProfile();

      return { success: true, redirect: getRoleRedirect(normalizedRoles) };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchProfile: async () => {
    try {
      // Get all users and find the current one by email
      const currentUser = get().user;
      if (!currentUser?.email) return;

      const res = await usersAPI.getAll();
      const users = res.data?.data || [];
      const found = users.find(u => u.email === currentUser.email);

      if (found) {
        const normalizedRoles = normalizeRoles(found.roles);
        const user = {
          id: found.id,
          email: found.email,
          fullname: found.fullname,
          phone: found.phone,
          roles: normalizedRoles,
          enabled: found.enabled,
          emailVerified: found.emailVerified,
        };
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
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