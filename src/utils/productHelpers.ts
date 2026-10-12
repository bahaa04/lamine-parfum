// Helper to sync admin products with storefront product data
import { useAdminStore } from '../context/adminStore';
import type { Product } from '../types';
import type { AdminProduct } from '../types/admin';

// Convert AdminProduct to legacy Product format for storefront compatibility
export function convertAdminProductToProduct(adminProduct: AdminProduct): Product {
  return {
    id: adminProduct.id,
    slug: adminProduct.slug,
    name: adminProduct.name,
    brand: adminProduct.brand,
    brandSlug: adminProduct.brandSlug,
    description: adminProduct.description,
    gender: adminProduct.gender,
    category: adminProduct.category,
    fragranceFamily: adminProduct.fragranceFamily,
    topNotes: adminProduct.topNotes,
    heartNotes: adminProduct.heartNotes,
    baseNotes: adminProduct.baseNotes,
    concentration: adminProduct.concentration,
    sizes: adminProduct.variants.map(v => ({
      ml: v.ml,
      price: v.price,
      originalPrice: v.originalPrice,
      inStock: v.stock > 0,
    })),
    images: adminProduct.images,
    rating: 4.5, // Default rating
    reviewCount: 0,
    isBestseller: adminProduct.isBestseller,
    isNewArrival: adminProduct.isNewArrival,
    isFeatured: adminProduct.isFeatured,
    stock: adminProduct.variants.reduce((sum, v) => sum + v.stock, 0),
    occasions: adminProduct.occasions,
    longevity: adminProduct.longevity,
    projection: adminProduct.projection,
    seasons: adminProduct.seasons,
  };
}

// Get all published products for storefront
export function getPublishedProducts(): Product[] {
  const adminProducts = useAdminStore.getState().products;
  return adminProducts
    .filter(p => p.isPublished)
    .map(convertAdminProductToProduct);
}

// Get product by ID (checks both admin store and legacy data)
export function getProductById(id: string): Product | undefined {
  const adminProduct = useAdminStore.getState().products.find(p => p.id === id);
  if (adminProduct) {
    return convertAdminProductToProduct(adminProduct);
  }
  // Fallback to legacy data if needed
  return undefined;
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  const adminProduct = useAdminStore.getState().products.find(p => p.slug === slug);
  if (adminProduct && adminProduct.isPublished) {
    return convertAdminProductToProduct(adminProduct);
  }
  return undefined;
}

// Check variant stock availability
export function checkVariantStock(productId: string, sizeInMl: number, requestedQuantity: number): { available: boolean; currentStock: number } {
  const adminProduct = useAdminStore.getState().products.find(p => p.id === productId);
  if (!adminProduct) {
    return { available: false, currentStock: 0 };
  }

  const variant = adminProduct.variants.find(v => v.ml === sizeInMl);
  if (!variant) {
    return { available: false, currentStock: 0 };
  }

  return {
    available: variant.stock >= requestedQuantity,
    currentStock: variant.stock,
  };
}
