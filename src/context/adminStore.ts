import { create } from 'zustand';
import type {
  AdminProduct,
  Category,
  Collection,
  AdminBrand,
  StockMovement,
  Coupon,
  AdminOrder,
  ReturnRequest,
  ActivityLog,
  StoreSettings,
  TrackingConfig,
  OrderStatus,
  PaymentStatus,
} from '../types/admin';
import { getFromStorage, setToStorage } from '../utils/helpers';
import { products as initialProducts } from '../data/products';
import { brands as initialBrands } from '../data/brands';

const ADMIN_STORAGE_KEY = 'lamine-parfume-admin';

interface AdminState {
  products: AdminProduct[];
  categories: Category[];
  collections: Collection[];
  brands: AdminBrand[];
  stockMovements: StockMovement[];
  coupons: Coupon[];
  orders: AdminOrder[];
  returns: ReturnRequest[];
  activityLogs: ActivityLog[];
  settings: StoreSettings;
  trackingConfig: TrackingConfig;

  // Products
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => AdminProduct | undefined;
  publishProduct: (id: string, published: boolean) => void;

  // Variants & Stock
  updateVariantStock: (productId: string, variantId: string, newStock: number, reason?: string) => void;
  getVariantStock: (productId: string, variantId: string) => number;
  recordStockMovement: (movement: StockMovement) => void;

  // Categories
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Collections
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // Brands
  addBrand: (brand: AdminBrand) => void;
  updateBrand: (id: string, updates: Partial<AdminBrand>) => void;
  deleteBrand: (id: string) => void;

  // Coupons
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message?: string };
  incrementCouponUsage: (code: string) => void;

  // Orders
  addOrder: (order: AdminOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  updateOrderTracking: (id: string, trackingNumber: string) => void;
  addOrderNote: (id: string, note: string) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => AdminOrder | undefined;

  // Returns
  addReturn: (returnRequest: ReturnRequest) => void;
  updateReturn: (id: string, updates: Partial<ReturnRequest>) => void;
  approveReturn: (id: string) => void;
  rejectReturn: (id: string, reason: string) => void;
  processRefund: (id: string, amount: number) => void;
  restockReturn: (id: string) => void;

  // Activity Logs
  logActivity: (action: string, entityType: string, entityId: string, entityName?: string, details?: string) => void;

  // Settings
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updateTrackingConfig: (updates: Partial<TrackingConfig>) => void;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

// Convert legacy products to AdminProduct format
function convertToAdminProducts(legacyProducts: any[]): AdminProduct[] {
  return legacyProducts.map(p => ({
    ...p,
    collections: [],
    variants: p.sizes.map((size: any, index: number) => ({
      id: `${p.id}-variant-${index}`,
      sku: `${p.slug.toUpperCase()}-${size.ml}ML`,
      ml: size.ml,
      price: size.price,
      originalPrice: size.originalPrice,
      stock: size.inStock ? Math.floor(Math.random() * 50) + 10 : 0,
    })),
    isPublished: true,
    seoTitle: p.name,
    seoDescription: p.description.substring(0, 160),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Convert legacy brands to AdminBrand format
function convertToAdminBrands(legacyBrands: any[]): AdminBrand[] {
  return legacyBrands.map(b => ({
    ...b,
    isActive: true,
    createdAt: new Date().toISOString(),
  }));
}

const defaultSettings: StoreSettings = {
  storeName: 'Lamine Parfum',
  storeEmail: 'contact@lamineparfum.dz',
  storePhone: '+213 582 545 518',
  currency: 'DZD',
  shippingFee: 800,
  freeShippingThreshold: 15000,
  taxRate: 0,
  lowStockThreshold: 10,
  orderPrefix: 'MP-',
  enabledPaymentMethods: ['cash', 'card'],
};

const defaultTrackingConfig: TrackingConfig = {
  googleAnalyticsId: '',
  googleTagManagerId: '',
  metaPixelId: '',
  tiktokPixelId: '',
  pinterestTagId: '',
};

export const useAdminStore = create<AdminState>((set, get) => {
  // Load initial state
  const stored = getFromStorage<any>(ADMIN_STORAGE_KEY, null);

  const initialState = stored || {
    products: convertToAdminProducts(initialProducts),
    categories: [
      {
        id: 'cat-1',
        name: 'Eau de Parfum',
        slug: 'eau-de-parfum',
        description: 'Premium concentration perfumes',
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cat-2',
        name: 'Eau de Toilette',
        slug: 'eau-de-toilette',
        description: 'Light and fresh fragrances',
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    collections: [
      {
        id: 'col-1',
        name: 'Best Sellers',
        slug: 'best-sellers',
        description: 'Our most popular fragrances',
        productIds: [],
        isActive: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
    ],
    brands: convertToAdminBrands(initialBrands),
    stockMovements: [],
    coupons: [
      {
        id: 'coupon-1',
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off',
        type: 'percentage',
        value: 10,
        minOrderAmount: 5000,
        usageLimit: 1000,
        usageCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [],
    returns: [],
    activityLogs: [],
    settings: defaultSettings,
    trackingConfig: defaultTrackingConfig,
  };

  return {
    ...initialState,

    // Products
    addProduct: (product) => {
      const state = get();
      const newProducts = [...state.products, product];
      set({ products: newProducts });
      get().logActivity('create', 'product', product.id, product.name);
      get().saveToStorage();
    },

    updateProduct: (id, updates) => {
      const state = get();
      const newProducts = state.products.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      set({ products: newProducts });
      const product = newProducts.find(p => p.id === id);
      get().logActivity('update', 'product', id, product?.name);
      get().saveToStorage();
    },

    deleteProduct: (id) => {
      const state = get();
      const product = state.products.find(p => p.id === id);
      const newProducts = state.products.filter(p => p.id !== id);
      set({ products: newProducts });
      get().logActivity('delete', 'product', id, product?.name);
      get().saveToStorage();
    },

    getProductById: (id) => {
      return get().products.find(p => p.id === id);
    },

    publishProduct: (id, published) => {
      get().updateProduct(id, { isPublished: published });
      get().logActivity(published ? 'publish' : 'unpublish', 'product', id);
    },

    // Variants & Stock
    updateVariantStock: (productId, variantId, newStock, reason) => {
      const state = get();
      const product = state.products.find(p => p.id === productId);
      if (!product) return;

      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) return;

      const previousStock = variant.stock;
      const updatedVariants = product.variants.map(v =>
        v.id === variantId ? { ...v, stock: newStock } : v
      );

      get().updateProduct(productId, { variants: updatedVariants });

      // Record stock movement
      const movement: StockMovement = {
        id: `stock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        productId,
        variantId,
        type: 'adjustment',
        quantity: newStock - previousStock,
        previousStock,
        newStock,
        reason,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
      };
      get().recordStockMovement(movement);
      get().logActivity('stock-adjustment', 'product', productId, product.name, `${variant.ml}ml: ${previousStock} → ${newStock}`);
    },

    getVariantStock: (productId, variantId) => {
      const product = get().products.find(p => p.id === productId);
      const variant = product?.variants.find(v => v.id === variantId);
      return variant?.stock || 0;
    },

    recordStockMovement: (movement) => {
      const state = get();
      set({ stockMovements: [...state.stockMovements, movement] });
      get().saveToStorage();
    },

    // Categories
    addCategory: (category) => {
      const state = get();
      set({ categories: [...state.categories, category] });
      get().logActivity('create', 'category', category.id, category.name);
      get().saveToStorage();
    },

    updateCategory: (id, updates) => {
      const state = get();
      const newCategories = state.categories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      set({ categories: newCategories });
      const category = newCategories.find(c => c.id === id);
      get().logActivity('update', 'category', id, category?.name);
      get().saveToStorage();
    },

    deleteCategory: (id) => {
      const state = get();
      const category = state.categories.find(c => c.id === id);
      set({ categories: state.categories.filter(c => c.id !== id) });
      get().logActivity('delete', 'category', id, category?.name);
      get().saveToStorage();
    },

    // Collections
    addCollection: (collection) => {
      const state = get();
      set({ collections: [...state.collections, collection] });
      get().logActivity('create', 'collection', collection.id, collection.name);
      get().saveToStorage();
    },

    updateCollection: (id, updates) => {
      const state = get();
      const newCollections = state.collections.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      set({ collections: newCollections });
      const collection = newCollections.find(c => c.id === id);
      get().logActivity('update', 'collection', id, collection?.name);
      get().saveToStorage();
    },

    deleteCollection: (id) => {
      const state = get();
      const collection = state.collections.find(c => c.id === id);
      set({ collections: state.collections.filter(c => c.id !== id) });
      get().logActivity('delete', 'collection', id, collection?.name);
      get().saveToStorage();
    },

    // Brands
    addBrand: (brand) => {
      const state = get();
      set({ brands: [...state.brands, brand] });
      get().logActivity('create', 'brand', brand.id, brand.name);
      get().saveToStorage();
    },

    updateBrand: (id, updates) => {
      const state = get();
      const newBrands = state.brands.map(b =>
        b.id === id ? { ...b, ...updates } : b
      );
      set({ brands: newBrands });
      const brand = newBrands.find(b => b.id === id);
      get().logActivity('update', 'brand', id, brand?.name);
      get().saveToStorage();
    },

    deleteBrand: (id) => {
      const state = get();
      const brand = state.brands.find(b => b.id === id);
      set({ brands: state.brands.filter(b => b.id !== id) });
      get().logActivity('delete', 'brand', id, brand?.name);
      get().saveToStorage();
    },

    // Coupons
    addCoupon: (coupon) => {
      const state = get();
      set({ coupons: [...state.coupons, coupon] });
      get().logActivity('create', 'coupon', coupon.id, coupon.code);
      get().saveToStorage();
    },

    updateCoupon: (id, updates) => {
      const state = get();
      const newCoupons = state.coupons.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      set({ coupons: newCoupons });
      const coupon = newCoupons.find(c => c.id === id);
      get().logActivity('update', 'coupon', id, coupon?.code);
      get().saveToStorage();
    },

    deleteCoupon: (id) => {
      const state = get();
      const coupon = state.coupons.find(c => c.id === id);
      set({ coupons: state.coupons.filter(c => c.id !== id) });
      get().logActivity('delete', 'coupon', id, coupon?.code);
      get().saveToStorage();
    },

    validateCoupon: (code, orderTotal) => {
      const coupon = get().coupons.find(c => c.code.toLowerCase() === code.toLowerCase());

      if (!coupon) {
        return { valid: false, discount: 0, message: 'Invalid coupon code' };
      }

      if (!coupon.isActive) {
        return { valid: false, discount: 0, message: 'This coupon is no longer active' };
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return { valid: false, discount: 0, message: 'This coupon has expired' };
      }

      if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
        return { valid: false, discount: 0, message: 'This coupon is not yet active' };
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
      }

      if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        return { valid: false, discount: 0, message: `Minimum order amount of ${coupon.minOrderAmount} DZD required` };
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = Math.round(orderTotal * (coupon.value / 100));
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }

      return { valid: true, discount };
    },

    incrementCouponUsage: (code) => {
      const state = get();
      const newCoupons = state.coupons.map(c =>
        c.code.toLowerCase() === code.toLowerCase()
          ? { ...c, usageCount: c.usageCount + 1 }
          : c
      );
      set({ coupons: newCoupons });
      get().saveToStorage();
    },

    // Orders
    addOrder: (order) => {
      const state = get();
      set({ orders: [...state.orders, order] });

      // Reduce stock for each item
      order.items.forEach(item => {
        const currentStock = get().getVariantStock(item.productId, item.variantId);
        const newStock = Math.max(0, currentStock - item.quantity);

        const product = get().products.find(p => p.id === item.productId);
        if (!product) return;

        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) return;

        const updatedVariants = product.variants.map(v =>
          v.id === item.variantId ? { ...v, stock: newStock } : v
        );
        get().updateProduct(item.productId, { variants: updatedVariants });

        // Record stock movement
        const movement: StockMovement = {
          id: `stock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          productId: item.productId,
          variantId: item.variantId,
          type: 'sale',
          quantity: -item.quantity,
          previousStock: currentStock,
          newStock,
          orderId: order.id,
          createdAt: new Date().toISOString(),
          createdBy: 'system',
        };
        get().recordStockMovement(movement);
      });

      get().logActivity('create', 'order', order.id, order.orderNumber);
      get().saveToStorage();
    },

    updateOrderStatus: (id, status) => {
      const state = get();
      const newOrders = state.orders.map(o =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      set({ orders: newOrders });
      const order = newOrders.find(o => o.id === id);
      get().logActivity('update-status', 'order', id, order?.orderNumber, `Status: ${status}`);
      get().saveToStorage();
    },

    updatePaymentStatus: (id, status) => {
      const state = get();
      const newOrders = state.orders.map(o =>
        o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o
      );
      set({ orders: newOrders });
      get().saveToStorage();
    },

    updateOrderTracking: (id, trackingNumber) => {
      const state = get();
      const newOrders = state.orders.map(o =>
        o.id === id ? { ...o, trackingNumber, updatedAt: new Date().toISOString() } : o
      );
      set({ orders: newOrders });
      get().logActivity('update-tracking', 'order', id, undefined, `Tracking: ${trackingNumber}`);
      get().saveToStorage();
    },

    addOrderNote: (id, note) => {
      const state = get();
      const order = state.orders.find(o => o.id === id);
      if (!order) return;

      const existingNotes = order.notes || '';
      const timestamp = new Date().toISOString();
      const newNote = `[${timestamp}] ${note}`;
      const updatedNotes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;

      const newOrders = state.orders.map(o =>
        o.id === id ? { ...o, notes: updatedNotes, updatedAt: new Date().toISOString() } : o
      );
      set({ orders: newOrders });
      get().saveToStorage();
    },

    cancelOrder: (id) => {
      const state = get();
      const order = state.orders.find(o => o.id === id);
      if (!order || order.status === 'cancelled') return;

      // Restore stock for each item
      order.items.forEach(item => {
        const currentStock = get().getVariantStock(item.productId, item.variantId);
        const newStock = currentStock + item.quantity;

        const product = get().products.find(p => p.id === item.productId);
        if (!product) return;

        const updatedVariants = product.variants.map(v =>
          v.id === item.variantId ? { ...v, stock: newStock } : v
        );
        get().updateProduct(item.productId, { variants: updatedVariants });

        // Record stock movement
        const movement: StockMovement = {
          id: `stock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          productId: item.productId,
          variantId: item.variantId,
          type: 'return',
          quantity: item.quantity,
          previousStock: currentStock,
          newStock,
          orderId: order.id,
          reason: 'Order cancelled',
          createdAt: new Date().toISOString(),
          createdBy: 'admin',
        };
        get().recordStockMovement(movement);
      });

      get().updateOrderStatus(id, 'cancelled');
      get().logActivity('cancel', 'order', id, order.orderNumber);
    },

    getOrderById: (id) => {
      return get().orders.find(o => o.id === id);
    },

    // Returns
    addReturn: (returnRequest) => {
      const state = get();
      set({ returns: [...state.returns, returnRequest] });
      get().logActivity('create', 'return', returnRequest.id, returnRequest.orderNumber);
      get().saveToStorage();
    },

    updateReturn: (id, updates) => {
      const state = get();
      const newReturns = state.returns.map(r =>
        r.id === id ? { ...r, ...updates } : r
      );
      set({ returns: newReturns });
      get().saveToStorage();
    },

    approveReturn: (id) => {
      get().updateReturn(id, { status: 'approved', processedAt: new Date().toISOString() });
      get().logActivity('approve', 'return', id);
    },

    rejectReturn: (id, reason) => {
      get().updateReturn(id, {
        status: 'rejected',
        processedAt: new Date().toISOString(),
        notes: reason,
      });
      get().logActivity('reject', 'return', id, undefined, reason);
    },

    processRefund: (id, amount) => {
      get().updateReturn(id, { refundStatus: 'processed', refundAmount: amount });
      get().logActivity('refund', 'return', id, undefined, `Amount: ${amount} DZD`);
      get().saveToStorage();
    },

    restockReturn: (id) => {
      const returnRequest = get().returns.find(r => r.id === id);
      if (!returnRequest || returnRequest.restockStatus === 'restocked') return;

      // Restore stock for returned items
      returnRequest.items.forEach(item => {
        const currentStock = get().getVariantStock(item.productId, item.variantId);
        const newStock = currentStock + item.quantity;

        const product = get().products.find(p => p.id === item.productId);
        if (!product) return;

        const updatedVariants = product.variants.map(v =>
          v.id === item.variantId ? { ...v, stock: newStock } : v
        );
        get().updateProduct(item.productId, { variants: updatedVariants });

        // Record stock movement
        const movement: StockMovement = {
          id: `stock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          productId: item.productId,
          variantId: item.variantId,
          type: 'restock',
          quantity: item.quantity,
          previousStock: currentStock,
          newStock,
          reason: 'Return restocked',
          createdAt: new Date().toISOString(),
          createdBy: 'admin',
        };
        get().recordStockMovement(movement);
      });

      get().updateReturn(id, { restockStatus: 'restocked', status: 'completed' });
      get().logActivity('restock', 'return', id);
    },

    // Activity Logs
    logActivity: (action, entityType, entityId, entityName, details) => {
      const state = get();
      const log: ActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        action,
        entityType,
        entityId,
        entityName,
        details,
        userId: 'admin',
        userName: 'Admin',
        timestamp: new Date().toISOString(),
      };
      set({ activityLogs: [...state.activityLogs, log] });
      get().saveToStorage();
    },

    // Settings
    updateSettings: (updates) => {
      const state = get();
      set({ settings: { ...state.settings, ...updates } });
      get().logActivity('update', 'settings', 'store-settings', 'Store Settings');
      get().saveToStorage();
    },

    updateTrackingConfig: (updates) => {
      const state = get();
      set({ trackingConfig: { ...state.trackingConfig, ...updates } });
      get().logActivity('update', 'settings', 'tracking-config', 'Tracking Configuration');
      get().saveToStorage();
    },

    // Persistence
    saveToStorage: () => {
      const state = get();
      setToStorage(ADMIN_STORAGE_KEY, {
        products: state.products,
        categories: state.categories,
        collections: state.collections,
        brands: state.brands,
        stockMovements: state.stockMovements,
        coupons: state.coupons,
        orders: state.orders,
        returns: state.returns,
        activityLogs: state.activityLogs,
        settings: state.settings,
        trackingConfig: state.trackingConfig,
      });
    },

    loadFromStorage: () => {
      const stored = getFromStorage<any>(ADMIN_STORAGE_KEY, null);
      if (stored) {
        set(stored);
      }
    },
  };
});
