import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useOrdersStore } from '../context/ordersStore';
import { useAdminStore } from '../context/adminStore';
import { useLocale } from '../context/LocaleContext';
import { formatPriceSimple, generateOrderId } from '../utils/helpers';
import type { Order } from '../types';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useToastStore } from '../context/toastStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const discount = useCartStore(state => state.discount);
  const couponCode = useCartStore(state => state.couponCode);
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const removeCoupon = useCartStore(state => state.removeCoupon);
  const clearCart = useCartStore(state => state.clearCart);
  const addOrder = useOrdersStore(state => state.addOrder);
  const addToast = useToastStore(state => state.addToast);
  const products = useAdminStore(state => state.products);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput, subtotal);
    if (result.success) {
      addToast('success', result.message);
      setCouponInput('');
    } else {
      addToast('error', result.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    addToast('success', t('checkout.removeCoupon'));
  };

  const validateForm = (): boolean => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      addToast('error', t('checkout.validation.name'));
      return false;
    }

    if (trimmedName.length < 2) {
      addToast('error', t('checkout.validation.nameMin'));
      return false;
    }

    if (!formData.phone.trim()) {
      addToast('error', t('checkout.validation.phone'));
      return false;
    }

    if (!formData.address.trim()) {
      addToast('error', t('checkout.validation.address'));
      return false;
    }

    if (!formData.city.trim()) {
      addToast('error', t('checkout.validation.city'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (items.length === 0) {
      addToast('error', t('checkout.error.emptyCart'));
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      const orderId = generateOrderId();

      const order: Order = {
        id: orderId,
        items: items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            name: product?.name || 'Unknown Product',
            brand: product?.brand || 'Unknown Brand',
            size: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
            image: product?.images[0] || '',
          };
        }),
        subtotal,
        shipping: 0, // Delivery fee not included
        discount,
        total,
        status: 'pending',
        date: new Date().toISOString(),
        shippingAddress: {
          firstName: formData.name.trim(),
          lastName: '',
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: '',
          country: 'Algeria',
          phone: formData.phone.trim(),
        },
        contactEmail: '',
      };

      addOrder(order);
      clearCart();
      addToast('success', t('checkout.success'));
      navigate(`/order-confirmation/${orderId}`);
    }, 1000);
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <div className="bg-obsidian border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('nav.cart'), href: '/cart' },
              { label: t('checkout.title') },
            ]}
          />
          <h1 className="font-serif text-4xl mt-6">{t('checkout.title')}</h1>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="section-padding container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer & Delivery Information */}
            <div className="bg-obsidian rounded-lg p-6 space-y-6">
              <h2 className="font-serif text-2xl mb-4">{t('checkout.deliveryInfo')}</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('checkout.name')} *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  placeholder={t('checkout.name.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('checkout.phone')} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  placeholder={t('checkout.phone.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  {t('checkout.address')} *
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  placeholder={t('checkout.address.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  {t('checkout.city')} *
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  placeholder={t('checkout.city.placeholder')}
                />
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-obsidian rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-2xl mb-6">{t('checkout.orderSummary')}</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gold/20">
                {items.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-obsidian flex-shrink-0">
                        {product?.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-ivory text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ivory truncate">
                          {product?.name}
                        </p>
                        <p className="text-xs text-white/80">
                          {item.selectedSize}ml
                        </p>
                        <p className="text-sm font-medium text-ivory mt-1">
                          {formatPriceSimple(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-gold/20">
                <label className="block text-sm font-medium mb-2">{t('checkout.coupon')}</label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">{couponCode}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      {t('checkout.removeCoupon')}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder={t('checkout.coupon.placeholder')}
                      className="flex-1 px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-obsidian text-white rounded hover:bg-obsidian/90 transition-colors"
                    >
                      {t('checkout.applyCoupon')}
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">{t('common.subtotal')}</span>
                  <span className="text-ivory font-medium">{formatPriceSimple(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{t('common.discount')}</span>
                    <span className="text-green-600 font-medium">-{formatPriceSimple(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gold/20">
                  <span className="text-ivory">{t('common.total')}</span>
                  <span className="text-ivory">{formatPriceSimple(total)}</span>
                </div>
              </div>

              {/* Delivery Notice */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900 leading-relaxed">
                  {t('checkout.deliveryNotice')}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
