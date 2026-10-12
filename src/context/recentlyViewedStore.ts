import { create } from 'zustand';
import { getFromStorage, setToStorage } from '../utils/helpers';

const STORAGE_KEY = 'maison-parfum-recently-viewed';
const MAX_ITEMS = 8;

interface RecentlyViewedStore {
  productIds: string[];
  addProduct: (productId: string) => void;
  getProducts: () => string[];
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>((set, get) => ({
  productIds: getFromStorage<string[]>(STORAGE_KEY, []),

  addProduct: (productId: string) => {
    set((state) => {
      // Remove existing entry if present, then prepend to front
      const filtered = state.productIds.filter((id) => id !== productId);
      const newIds = [productId, ...filtered].slice(0, MAX_ITEMS);
      setToStorage(STORAGE_KEY, newIds);
      return { productIds: newIds };
    });
  },

  getProducts: () => {
    return get().productIds;
  },

  clear: () => {
    setToStorage(STORAGE_KEY, []);
    set({ productIds: [] });
  },
}));
