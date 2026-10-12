// Extended types for admin functionality

export interface ProductVariant {
  id: string;
  sku: string;
  ml: number;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  description: string;
  gender: 'men' | 'women' | 'unisex';
  category: string;
  collections: string[];
  fragranceFamily: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  concentration: string;
  variants: ProductVariant[];
  images: string[];
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  occasions: string[];
  longevity: string;
  projection: string;
  seasons: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productIds: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  featured: boolean;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId: string;
  type: 'adjustment' | 'sale' | 'return' | 'restock';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  orderId?: string;
  createdAt: string;
  createdBy: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  items: AdminOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  contactEmail: string;
  contactPhone: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  sku: string;
  size: number;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  items: ReturnItem[];
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
  processedAt?: string;
  refundAmount: number;
  refundStatus: 'pending' | 'processed' | 'rejected';
  restockStatus: 'pending' | 'restocked' | 'damaged';
  notes?: string;
}

export interface ReturnItem {
  orderItemId: string;
  productId: string;
  variantId: string;
  name: string;
  size: number;
  quantity: number;
  price: number;
}

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  details?: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  lowStockThreshold: number;
  orderPrefix: string;
  enabledPaymentMethods: string[];
}

export interface TrackingConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
  pinterestTagId?: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: string;
}
