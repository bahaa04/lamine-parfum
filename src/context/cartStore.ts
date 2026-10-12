import { create } from 'zustand';
import type { CartItem } from '../types';
import { getFromStorage, setToStorage } from '../utils/helpers';
import { useAdminStore } from './adminStore';

const STORAGE_KEY = 'maison-parfum-cart';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string | null;
  discount: number;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string, subtotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;

  getSubtotal: () => number;
  getItemCount: () => number;
  getShipping: (subtotal: number) => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: getFromStorage<CartItem[]>(STORAGE_KEY, []),
  isCartOpen: false,
  couponCode: null,
  discount: 0,

  addItem: (item: CartItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.selectedSize === item.selectedSize
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((i, index) =>
          index === existingIndex
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }

      setToStorage(STORAGE_KEY, newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId: string, size: number) => {
    set((state) => {
      const newItems = state.items.filter(
        (i) => !(i.productId === productId && i.selectedSize === size)
      );
      setToStorage(STORAGE_KEY, newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId: string, size: number, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter(
          (i) => !(i.productId === productId && i.selectedSize === size)
        );
        setToStorage(STORAGE_KEY, newItems);
        return { items: newItems };
      }

      const newItems = state.items.map((i) =>
        i.productId === productId && i.selectedSize === size
          ? { ...i, quantity }
          : i
      );
      setToStorage(STORAGE_KEY, newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    setToStorage(STORAGE_KEY, []);
    set({ items: [], couponCode: null, discount: 0 });
  },

  toggleCart: () => {
    set((state) => ({ isCartOpen: !state.isCartOpen }));
  },

  openCart: () => {
    set({ isCartOpen: true });
  },

  closeCart: () => {
    set({ isCartOpen: false });
  },

  applyCoupon: (code: string, subtotal: number) => {
    const adminStore = useAdminStore.getState();
    const result = adminStore.validateCoupon(code, subtotal);

    if (!result.valid) {
      return { success: false, message: result.message || 'Invalid coupon code' };
    }

    set({ couponCode: code.toUpperCase(), discount: result.discount });

    return {
      success: true,
      message: `Coupon applied! You save ${result.discount.toLocaleString('ar-DZ')} دج`,
    };
  },

  removeCoupon: () => {
    set({ couponCode: null, discount: 0 });
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  getShipping: (subtotal: number) => {
    const adminStore = useAdminStore.getState();
    const { freeShippingThreshold, shippingFee } = adminStore.settings;
    return subtotal >= freeShippingThreshold ? 0 : shippingFee;
  },

  getTotal: () => {
    const { discount } = get();
    const subtotal = get().getSubtotal();
    const shipping = get().getShipping(subtotal);
    return Math.max(0, subtotal - discount + shipping);
  },
}));
