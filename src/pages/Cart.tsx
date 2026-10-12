import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../context/cartStore';
import { getProductById } from '../data/products';
import { formatPrice } from '../utils/helpers';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/common/EmptyState';
import { useState } from 'react';
import { useToastStore } from '../context/toastStore';

export default function Cart() {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getShipping = useCartStore(state => state.getShipping);
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const removeCoupon = useCartStore(state => state.removeCoupon);
  const couponCode = useCartStore(state => state.couponCode);
  const discount = useCartStore(state => state.discount);
  const getTotal = useCartStore(state => state.getTotal);
  const addToast = useToastStore(state => state.addToast);

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getSubtotal();
  const shipping = getShipping(subtotal);
  const total = getTotal();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput.trim(), subtotal);
    if (result.success) {
      addToast('success', result.message);
      setCouponInput('');
    } else {
      addToast('error', result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    addToast('info', 'Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="bg-obsidian min-h-screen">
        <div className="section-padding container-luxury py-16">
          <EmptyState
            icon={<ShoppingBag size={48} strokeWidth={1.5} />}
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet"
            action={{ label: 'Start Shopping', href: '/shop' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <div className="bg-obsidian border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shopping Cart' }]} />
          <h1 className="font-serif text-4xl mt-6">Shopping Cart</h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="section-padding container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              const maxQuantity = Math.min(product.stock, 10);

              return (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="bg-obsidian rounded-lg p-6 flex gap-6"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.slug}`}
                    className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-espresso rounded overflow-hidden"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4 mb-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/80 mb-1">
                          {product.brand}
                        </p>
                        <Link
                          to={`/product/${product.slug}`}
                          className="font-serif text-lg text-ivory hover:text-gold transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-white/80 mt-1">
                          Size: {item.selectedSize}ml
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.selectedSize)}
                        className="text-white/80 hover:text-red-600 transition-colors h-fit"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.productId, item.selectedSize, qty)}
                        max={maxQuantity}
                      />
                      <p className="font-semibold text-lg text-ivory">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-obsidian rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Discount Code</label>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                    <span className="text-sm font-medium text-green-700">{couponCode}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-900 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gold/30 rounded text-sm focus:outline-none focus:border-gold"
                    />
                    <button onClick={handleApplyCoupon} className="btn-secondary">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Subtotal</span>
                  <span className="text-ivory">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Discount</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Shipping</span>
                  <span className="text-ivory">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <p className="text-xs text-green-600">
                    You qualify for free shipping!
                  </p>
                )}

                {subtotal < 100 && subtotal > 0 && (
                  <p className="text-xs text-white/80">
                    Add {formatPrice(100 - subtotal)} more for free shipping
                  </p>
                )}

                <div className="border-t border-gold/20 pt-3 flex justify-between">
                  <span className="font-semibold text-ivory">Total</span>
                  <span className="font-semibold text-xl text-ivory">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="btn-secondary w-full text-center block mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
