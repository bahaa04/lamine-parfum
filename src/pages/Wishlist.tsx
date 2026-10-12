import { Heart } from 'lucide-react';
import { useWishlistStore } from '../context/wishlistStore';
import { getProductById } from '../data/products';
import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';

export default function Wishlist() {
  const { t } = useLocale();
  const items = useWishlistStore(state => state.items);

  const wishlistProducts = items
    .map(item => getProductById(item.productId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="section-padding container-luxury py-16">
          <EmptyState
            icon={<Heart size={48} strokeWidth={1.5} />}
            title={t('cart.empty')}
            description={t('cart.continueShopping')}
            action={{ label: t('common.shopNow'), href: '/shop' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.wishlist') }]} />
          <div className="mt-6">
            <h1 className="font-serif text-4xl">{t('nav.wishlist')}</h1>
            <p className="text-white/80 mt-2">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? t('product.price') : t('cart.itemsInCart', { count: wishlistProducts.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist Products */}
      <div className="section-padding container-luxury py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
