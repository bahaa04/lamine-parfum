import { create } from 'zustand';
import type { Order } from '../types';
import { getFromStorage, setToStorage } from '../utils/helpers';
import { useAdminStore } from './adminStore';
import type { AdminOrder, AdminOrderItem } from '../types/admin';

const ORDERS_STORAGE_KEY = 'maison-parfum-orders';

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  getAllOrders: () => Order[];
  updateOrderStatus: (id: string, status: string) => void;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: getFromStorage<Order[]>(ORDERS_STORAGE_KEY, []),

  addOrder: (order: Order) => {
    const { orders } = get();
    const newOrders = [...orders, order];
    setToStorage(ORDERS_STORAGE_KEY, newOrders);
    set({ orders: newOrders });

    // Convert to AdminOrder format and add to admin store
    const adminOrder: AdminOrder = {
      id: order.id,
      orderNumber: order.id,
      items: order.items.map((item, index) => {
        // Find the product to get variant info
        const adminStore = useAdminStore.getState();
        const product = adminStore.products.find(p => p.id === item.productId);
        const variant = product?.variants.find(v => v.ml === item.size);

        return {
          id: `${order.id}-item-${index}`,
          productId: item.productId,
          variantId: variant?.id || `variant-${item.size}ml`,
          name: item.name,
          brand: item.brand,
          sku: variant?.sku || `${item.productId}-${item.size}ML`,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        } as AdminOrderItem;
      }),
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      status: order.status as any,
      paymentStatus: 'pending',
      shippingAddress: order.shippingAddress,
      contactEmail: order.contactEmail,
      contactPhone: order.shippingAddress.phone,
      createdAt: order.date,
      updatedAt: order.date,
    };

    // Add to admin store which handles stock deduction
    useAdminStore.getState().addOrder(adminOrder);
  },

  getOrderById: (id: string) => {
    const { orders } = get();
    return orders.find(o => o.id === id);
  },

  getAllOrders: () => {
    return get().orders;
  },

  updateOrderStatus: (id: string, status: string) => {
    const { orders } = get();
    const newOrders = orders.map(o =>
      o.id === id ? { ...o, status } : o
    );
    setToStorage(ORDERS_STORAGE_KEY, newOrders);
    set({ orders: newOrders });

    // Update in admin store as well
    useAdminStore.getState().updateOrderStatus(id, status as any);
  },
}));
