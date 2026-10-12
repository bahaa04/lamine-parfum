import { create } from 'zustand';
import { getFromStorage, setToStorage } from '../utils/helpers';

const ADMIN_PASSWORD = '123456';
const ADMIN_SESSION_KEY = 'maison-parfum-admin-session';

interface AdminAuthStore {
  isAuthenticated: boolean;
  login: (password: string) => { success: boolean; error?: string };
  logout: () => void;
  checkSession: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  isAuthenticated: getFromStorage<boolean>(ADMIN_SESSION_KEY, false),

  login: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setToStorage(ADMIN_SESSION_KEY, true);
      set({ isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: 'Incorrect password' };
  },

  logout: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    set({ isAuthenticated: false });
  },

  checkSession: () => {
    const isAuth = getFromStorage<boolean>(ADMIN_SESSION_KEY, false);
    set({ isAuthenticated: isAuth });
    return isAuth;
  },
}));
