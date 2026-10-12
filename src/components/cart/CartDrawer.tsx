import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '../../context/cartStore';
import { getProductById } from '../../data/products';
import { formatPrice } from '../../utils/helpers';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const subtotal = getSubtotal();
  const isEmpty = items.length === 0;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-obsidian/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-obsidian z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ivory">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-ivory" />
                <h2 className="font-serif text-lg font-semibold text-ivory tracking-wide">
                  Your Cart
                </h2>
                {!isEmpty && (
                  <span className="text-xs text-white/70 font-medium">
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-ivory hover:text-gold transition-colors duration-300"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-white/70/40 mb-4" />
                  <p className="font-serif text-lg text-ivory mb-2">Your cart is empty</p>
                  <p className="text-sm text-white/70 mb-6">
                    Discover our collection and find your signature scent.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Explore Fragrances
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ivory">
                  {items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;

                    return (
                      <motion.li
                        key={`${item.productId}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="px-6 py-4"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-espresso flex-shrink-0 overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGN0YzRUMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNBNzlBODkiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxMiI+UGFyZnVtPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/70 mb-0.5">
                              {product.brand}
                            </p>
                            <p className="text-sm font-medium text-ivory truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">
                              {item.selectedSize} ml
                            </p>

                            <div className="flex items-center justify-between mt-2.5">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-ivory">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.selectedSize,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-ivory hover:text-gold transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-ivory border-x border-ivory">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.selectedSize,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-ivory hover:text-gold transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <p className="text-sm font-semibold text-ivory">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.productId, item.selectedSize)}
                            className="self-start p-1 text-white/70 hover:text-red-500 transition-colors duration-300"
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="border-t border-ivory px-6 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Subtotal</span>
                  <span className="text-base font-semibold text-ivory">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-white/70">
                  Shipping and taxes calculated at checkout
                </p>

                {/* CTA Buttons */}
                <div className="space-y-2.5">
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-gold w-full text-center block"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="btn-secondary w-full text-center block"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
