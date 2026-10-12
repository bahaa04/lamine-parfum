import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../context/cartStore';
import { useToastStore } from '../../context/toastStore';
import { useLocale } from '../../context/LocaleContext';
import WishlistButton from '../ui/WishlistButton';
import PriceDisplay from '../ui/PriceDisplay';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();
  const { t } = useLocale();

  const firstAvailableSize = product.sizes.find((size) => size.inStock);
  const isOutOfStock = product.stock === 0 || !firstAvailableSize;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || !firstAvailableSize) {
      addToast('error', 'Product is out of stock');
      return;
    }

    addItem({
      productId: product.id,
      selectedSize: firstAvailableSize.ml,
      quantity: 1,
      price: firstAvailableSize.price,
    });

    addToast('success', 'Added to cart');
    openCart();
  };

  const getBadges = () => {
    const badges = [];
    if (product.isBestseller) {
      badges.push({ label: t('page.home.bestsellers'), className: 'bg-gold text-white' });
    }
    if (product.isNewArrival) {
      badges.push({ label: t('page.home.newArrivals'), className: 'bg-obsidian text-white' });
    }
    if (firstAvailableSize?.originalPrice && firstAvailableSize.originalPrice > firstAvailableSize.price) {
      badges.push({ label: 'Sale', className: 'bg-red-500 text-white' });
    }
    return badges;
  };

  const badges = getBadges();

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-espresso rounded-lg mb-4">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Second Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-10 h-10 bg-obsidian/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-obsidian transition-colors">
            <WishlistButton productId={product.id} size="sm" />
          </div>
        </div>

        {/* Quick Add to Cart Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered && !isOutOfStock
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full bg-obsidian text-white py-3 rounded flex items-center justify-center gap-2 hover:bg-espresso transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">{t('product.addToCart')}</span>
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center">
            <span className="bg-obsidian px-4 py-2 rounded text-sm font-medium text-ivory">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wider text-white/70 font-medium">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="font-serif text-lg text-ivory group-hover:text-gold transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Concentration */}
        <p className="text-sm text-white/70">{product.concentration}</p>

        {/* Price */}
        <div className="pt-1">
          {firstAvailableSize && (
            <PriceDisplay
              price={firstAvailableSize.price}
              originalPrice={firstAvailableSize.originalPrice}
              size="md"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
