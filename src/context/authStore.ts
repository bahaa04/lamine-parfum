import { create } from 'zustand';
import type { User, Order } from '../types';
import { getFromStorage, setToStorage } from '../utils/helpers';

const STORAGE_KEY = 'maison-parfum-auth';
const ORDERS_STORAGE_KEY = 'maison-parfum-orders';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];

  login: (email: string, password: string) => { success: boolean; message: string };
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: getFromStorage<User | null>(STORAGE_KEY, null),
  isAuthenticated: getFromStorage<User | null>(STORAGE_KEY, null) !== null,
  orders: getFromStorage<Order[]>(ORDERS_STORAGE_KEY, []),

  login: (_email: string, _password: string) => {
    const mockUser: User = {
      id: 'user-1',
      email: _email,
      firstName: 'Alexandre',
      lastName: 'Dupont',
      phone: '07 82 54 55 18',
    };

    setToStorage(STORAGE_KEY, mockUser);
    set({ user: mockUser, isAuthenticated: true });

    return { success: true, message: 'Welcome back!' };
  },

  register: (data) => {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return { success: false, error: 'All fields are required' };
    }

    const mockUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    setToStorage(STORAGE_KEY, mockUser);
    set({ user: mockUser, isAuthenticated: true });

    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setToStorage(STORAGE_KEY, updatedUser);
    set({ user: updatedUser });
  },

  addOrder: (order: Order) => {
    const { orders } = get();
    const newOrders = [...orders, order];
    setToStorage(ORDERS_STORAGE_KEY, newOrders);
    set({ orders: newOrders });
  },

  getOrderById: (id: string) => {
    const { orders } = get();
    return orders.find(o => o.id === id);
  },
}));
