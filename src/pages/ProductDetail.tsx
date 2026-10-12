import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, RefreshCw } from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { getReviewsByProduct } from '../data/reviews';
import { useCartStore } from '../context/cartStore';
import { useRecentlyViewedStore } from '../context/recentlyViewedStore';
import { useToastStore } from '../context/toastStore';
import ProductGallery from '../components/product/ProductGallery';
import SizeSelector from '../components/ui/SizeSelector';
import QuantitySelector from '../components/ui/QuantitySelector';
import WishlistButton from '../components/ui/WishlistButton';
import PriceDisplay from '../components/ui/PriceDisplay';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';
import ErrorState from '../components/common/ErrorState';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'details'>('description');

  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);
  const addToast = useToastStore(state => state.addToast);
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addProduct);
  const recentlyViewedIds = useRecentlyViewedStore(state => state.productIds);

  const product = slug ? getProductBySlug(slug) : undefined;
  const reviews = product ? getReviewsByProduct(product.id) : [];

  // Set default size on load
  useEffect(() => {
    if (product && !selectedSize) {
      const firstAvailable = product.sizes.find(s => s.inStock);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.ml);
      }
    }
  }, [product, selectedSize]);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  if (!slug) {
    return <ErrorState title="Invalid product" />;
  }

  if (!product) {
    return (
      <div className="section-padding container-luxury py-16">
        <ErrorState
          title="Product not found"
          message="The product you're looking for doesn't exist or has been removed."
          onRetry={() => navigate('/shop')}
        />
      </div>
    );
  }

  const selectedSizeData = product.sizes.find(s => s.ml === selectedSize);
  const currentPrice = selectedSizeData?.price || product.sizes[0].price;
  const originalPrice = selectedSizeData?.originalPrice;
  const isInStock = selectedSizeData?.inStock && product.stock > 0;
  const maxQuantity = Math.min(product.stock, 10);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedSizeData) {
      addToast('error', 'Please select a size');
      return;
    }

    if (!isInStock) {
      addToast('error', 'This product is out of stock');
      return;
    }

    addItem({
      productId: product.id,
      selectedSize: selectedSize,
      quantity: quantity,
      price: currentPrice,
    });

    addToast('success', `${product.name} added to cart`);
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/checkout'), 500);
  };

  // Related products (same brand or fragrance family)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.brand === product.brand || p.fragranceFamily === product.fragranceFamily))
    .slice(0, 4);

  // Recently viewed products (excluding current)
  const recentlyViewedProducts = recentlyViewedIds
    .filter(id => id !== product.id)
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => p !== undefined)
    .slice(0, 4);

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Breadcrumbs */}
      <div className="section-padding container-luxury py-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: product.brand, href: `/brands/${product.brandSlug}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Product Main Section */}
      <div className="section-padding container-luxury pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div>
              <Link
                to={`/brands/${product.brandSlug}`}
                className="text-sm uppercase tracking-widest text-gold hover:text-ivory transition-colors"
              >
                {product.brand}
              </Link>
            </div>

            {/* Product Name */}
            <h1 className="font-serif text-4xl md:text-5xl text-ivory">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-white/80/30'}
                  />
                ))}
              </div>
              <span className="text-sm text-white/80">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div>
              <PriceDisplay price={currentPrice} originalPrice={originalPrice} size="lg" />
            </div>

            {/* Short Description */}
            <p className="text-white/80 leading-relaxed">
              {product.description}
            </p>

            {/* Fragrance Family & Concentration */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-white/80">Family:</span>
                <span className="ml-2 text-ivory font-medium">{product.fragranceFamily}</span>
              </div>
              <div>
                <span className="text-white/80">Type:</span>
                <span className="ml-2 text-ivory font-medium">{product.concentration}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-sm font-semibold text-ivory mb-3">
                Select Size
              </label>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize || 0}
                onSelect={setSelectedSize}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-ivory mb-3">
                Quantity
              </label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={maxQuantity}
                min={1}
              />
            </div>

            {/* Stock Status */}
            <div>
              {isInStock ? (
                <p className="text-sm text-green-600 font-medium">In Stock</p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <WishlistButton productId={product.id} size="lg" className="btn-secondary !p-4" />
            </div>

            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            {/* Shipping & Returns Info */}
            <div className="border-t border-gold/20 pt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Truck size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ivory">Free Delivery</p>
                  <p className="text-white/80">On orders over €100</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <RefreshCw size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ivory">Easy Returns</p>
                  <p className="text-white/80">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-obsidian">
        <div className="section-padding container-luxury py-12">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gold/20 mb-8">
            {(['description', 'reviews', 'details'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? 'text-ivory font-semibold'
                    : 'text-white/80 hover:text-ivory'
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'reviews' && `Reviews (${reviews.length})`}
                {tab === 'details' && 'Details'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl mb-3">Fragrance Description</h3>
                  <p className="text-white/80 leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-ivory mb-3">Fragrance Notes</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-ivory">Top Notes:</span>
                      <p className="text-white/80">{product.topNotes.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-ivory">Heart Notes:</span>
                      <p className="text-white/80">{product.heartNotes.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-ivory">Base Notes:</span>
                      <p className="text-white/80">{product.baseNotes.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-ivory mb-3">Recommended For</h4>
                  <p className="text-white/80">{product.occasions.join(', ')}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gold/20 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-ivory">{review.author}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'fill-gold text-gold' : 'text-white/80/30'}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-white/80">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h5 className="font-medium text-ivory mb-2">{review.title}</h5>
                      <p className="text-white/80 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/80">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/80">Brand:</span>
                    <p className="text-ivory font-medium">{product.brand}</p>
                  </div>
                  <div>
                    <span className="text-white/80">Concentration:</span>
                    <p className="text-ivory font-medium">{product.concentration}</p>
                  </div>
                  <div>
                    <span className="text-white/80">Fragrance Family:</span>
                    <p className="text-ivory font-medium">{product.fragranceFamily}</p>
                  </div>
                  <div>
                    <span className="text-white/80">Gender:</span>
                    <p className="text-ivory font-medium capitalize">{product.gender}</p>
                  </div>
                  <div>
                    <span className="text-white/80">Longevity:</span>
                    <p className="text-ivory font-medium">{product.longevity}</p>
                  </div>
                  <div>
                    <span className="text-white/80">Projection:</span>
                    <p className="text-ivory font-medium">{product.projection}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/80">Best Seasons:</span>
                    <p className="text-ivory font-medium">{product.seasons.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="section-padding container-luxury py-16">
          <SectionHeading title="You May Also Like" align="center" />
          <div className="mt-8">
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="bg-espresso section-padding py-16">
          <div className="container-luxury">
            <SectionHeading title="Recently Viewed" align="center" />
            <div className="mt-8">
              <ProductGrid products={recentlyViewedProducts} columns={4} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
