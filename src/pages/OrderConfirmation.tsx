import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { useOrdersStore } from '../context/ordersStore';
import { useLocale } from '../context/LocaleContext';
import { formatPriceSimple } from '../utils/helpers';
import type { Order } from '../types';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useLocale();
  const getOrderById = useOrdersStore(state => state.getOrderById);
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, getOrderById]);

  if (!orderId || !order) {
    return (
      <div className="bg-obsidian min-h-screen">
        <div className="section-padding container-luxury py-24 text-center">
          <Package size={64} className="mx-auto text-white/80 mb-6" />
          <h1 className="font-serif text-3xl text-ivory mb-4">
            {t('order.confirmation.title')}
          </h1>
          <p className="text-white/80 mb-8">Order not found.</p>
          <Link to="/" className="btn-primary inline-block">
            {t('order.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const customerName = order.shippingAddress.firstName;

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Success Header */}
      <div className="bg-obsidian border-b border-gold/20">
        <div className="section-padding container-luxury py-12 text-center">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-6" />
          <h1 className="font-serif text-4xl text-ivory mb-3">
            {t('order.confirmation.title')}
          </h1>
          <p className="text-xl text-white/80 mb-2">
            {t('order.confirmation.thanks')}
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            {t('order.confirmation.message')}
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="section-padding container-luxury py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Order Info Card */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-white/80 mb-1">{t('order.number')}</p>
                <p className="font-mono font-semibold text-ivory">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">{t('order.date')}</p>
                <p className="font-medium text-ivory">
                  {new Date(order.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">{t('order.status')}</p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-semibold capitalize">
                  {t(`status.${order.status}`)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-serif text-2xl mb-6">{t('order.customer')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/80 mb-1">Name</p>
                <p className="font-medium text-ivory">{customerName}</p>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">{t('checkout.phone')}</p>
                <p className="font-medium text-ivory">{order.shippingAddress.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-white/80 mb-1">{t('order.deliveryAddress')}</p>
                <p className="font-medium text-ivory">
                  {order.shippingAddress.address}
                </p>
                <p className="font-medium text-ivory">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-obsidian rounded-lg p-6 border border-gold/20">
            <h2 className="font-serif text-2xl mb-6">{t('order.items')}</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gold/10 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded overflow-hidden bg-obsidian flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-white/80" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-ivory mb-1">{item.name}</h3>
                      <p className="text-sm text-white/80">{item.brand}</p>
                      <p className="text-sm text-white/80">
                        {item.size}ml × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-ivory">
                        {formatPriceSimple(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-white/80">
                        {formatPriceSimple(item.price)} {t('product.price')}
                      </p>
                    </div>
                  </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t border-gold/20 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">{t('common.subtotal')}</span>
                <span className="text-ivory font-medium">
                  {formatPriceSimple(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">{t('common.discount')}</span>
                  <span className="text-green-600 font-medium">
                    -{formatPriceSimple(order.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gold/20">
                <span className="text-ivory">{t('common.total')}</span>
                <span className="text-ivory">{formatPriceSimple(order.total)}</span>
              </div>
            </div>

            {/* Delivery Fee Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900 leading-relaxed">
                {t('order.deliveryNotice')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Link to="/" className="btn-primary inline-block">
              {t('order.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
