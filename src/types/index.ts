export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  description: string;
  gender: 'men' | 'women' | 'unisex';
  category: string;
  fragranceFamily: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  concentration: string;
  sizes: ProductSize[];
  images: string[];
  rating: number;
  reviewCount: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  occasions: string[];
  longevity: string;
  projection: string;
  seasons: string[];
}

export interface ProductSize {
  ml: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  featured: boolean;
  country: string;
}

export interface CartItem {
  productId: string;
  selectedSize: number;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  productId: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  date: string;
  shippingAddress: ShippingAddress;
  contactEmail: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
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

export interface MockCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder?: number;
}

export interface FilterState {
  gender: string[];
  fragranceFamily: string[];
  brand: string[];
  concentration: string[];
  priceRange: [number, number];
  availability: boolean | null;
  sort: SortOption;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AnnouncementMessage {
  id: string;
  text: string;
  link?: string;
}

export interface FragranceFamily {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  product?: string;
}
