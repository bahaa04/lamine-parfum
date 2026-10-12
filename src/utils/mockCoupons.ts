import type { MockCoupon } from '../types';

export const mockCoupons: MockCoupon[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minOrder: 50,
  },
  {
    code: 'LUXURY20',
    discount: 20,
    type: 'percentage',
    minOrder: 150,
  },
  {
    code: 'PARFUM15',
    discount: 15,
    type: 'percentage',
    minOrder: 75,
  },
  {
    code: 'FREE25',
    discount: 25,
    type: 'fixed',
    minOrder: 100,
  },
];

export function validateCoupon(code: string, orderTotal: number): { valid: boolean; coupon?: MockCoupon; error?: string } {
  const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (coupon.minOrder && orderTotal < coupon.minOrder) {
    return { valid: false, error: `Minimum order of ${coupon.minOrder}€ required` };
  }

  return { valid: true, coupon };
}

export function calculateDiscount(coupon: MockCoupon, subtotal: number): number {
  if (coupon.type === 'percentage') {
    return Math.round((subtotal * coupon.discount) / 100 * 100) / 100;
  }
  return Math.min(coupon.discount, subtotal);
}
