import { create } from 'zustand';
import type { WishlistItem } from '../types';
import { getFromStorage, setToStorage } from '../utils/helpers';

const STORAGE_KEY = 'maison-parfum-wishlist';

interface WishlistStore {
  items: WishlistItem[];

  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: getFromStorage<WishlistItem[]>(STORAGE_KEY, []),

  addItem: (productId: string) => {
    set((state) => {
      if (state.items.some((i) => i.productId === productId)) {
        return state;
      }
      const newItems = [...state.items, { productId }];
      setToStorage(STORAGE_KEY, newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.productId !== productId);
      setToStorage(STORAGE_KEY, newItems);
      return { items: newItems };
    });
  },

  toggleItem: (productId: string) => {
    const { items } = get();
    if (items.some((i) => i.productId === productId)) {
      get().removeItem(productId);
    } else {
      get().addItem(productId);
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((i) => i.productId === productId);
  },

  getItemCount: () => {
    return get().items.length;
  },
}));
