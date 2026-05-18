import { create } from 'zustand';

const STORAGE_KEY = 'araku_auth_user';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  initAuth: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 900));
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === email) {
        set({ user, isAuthenticated: true, isLoading: false });
        return { success: true };
      }
    }
    // Demo: allow any email/password combination
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      phone: '',
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  signup: async ({ name, email, phone, password }) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    const user = {
      id: Date.now().toString(),
      email,
      name,
      phone,
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
