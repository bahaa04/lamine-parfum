import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByGender } from '../data/products';
import type { FilterState } from '../types';
import CollectionBanner from '../components/product/CollectionBanner';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ErrorState from '../components/common/ErrorState';
import { useState } from 'react';
import ProductFilters from '../components/product/ProductFilters';
import SortDropdown from '../components/product/SortDropdown';
import { Filter } from 'lucide-react';
import { brands } from '../data/brands';

const collectionData = {
  men: {
    title: 'For Him',
    description: 'Discover sophisticated masculine fragrances crafted for the modern man. From bold and woody to fresh and aquatic.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=1600',
  },
  women: {
    title: 'For Her',
    description: 'Elegant and timeless fragrances that celebrate femininity. Explore floral, oriental, and powdery scents.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600',
  },
  unisex: {
    title: 'Unisex Collection',
    description: 'Gender-neutral fragrances that transcend traditional boundaries. Bold, distinctive, and universally appealing.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=1600',
  },
};

export default function Collection() {
  const { gender } = useParams<{ gender: 'men' | 'women' | 'unisex' }>();
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    gender: gender ? [gender] : [],
    fragranceFamily: [],
    brand: [],
    concentration: [],
    priceRange: [0, 1000],
    availability: null,
    sort: 'featured',
  });

  const availableBrands = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.name))).sort();
  }, []);

  if (!gender || !collectionData[gender]) {
    return (
      <div className="section-padding container-luxury py-16">
        <ErrorState
          title="Collection not found"
          message="The collection you're looking for doesn't exist."
          onRetry={() => navigate('/shop')}
        />
      </div>
    );
  }

  const collection = collectionData[gender];
  const allProducts = getProductsByGender(gender);

  // Apply additional filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (filters.fragranceFamily.length > 0) {
      result = result.filter(p => filters.fragranceFamily.includes(p.fragranceFamily));
    }

    if (filters.brand.length > 0) {
      result = result.filter(p => filters.brand.includes(p.brand));
    }

    if (filters.concentration.length > 0) {
      result = result.filter(p => filters.concentration.includes(p.concentration));
    }

    result = result.filter(p => {
      const minPrice = Math.min(...p.sizes.map(s => s.price));
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    if (filters.availability) {
      result = result.filter(p => p.stock > 0);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result = result.filter(p => p.isNewArrival);
        break;
      case 'price-asc':
        result.sort((a, b) => {
          const aMin = Math.min(...a.sizes.map(s => s.price));
          const bMin = Math.min(...b.sizes.map(s => s.price));
          return aMin - bMin;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const aMin = Math.min(...a.sizes.map(s => s.price));
          const bMin = Math.min(...b.sizes.map(s => s.price));
          return bMin - aMin;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [allProducts, filters]);

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Banner */}
      <CollectionBanner
        title={collection.title}
        description={collection.description}
        image={collection.image}
        overlay="dark"
      />

      {/* Breadcrumbs */}
      <div className="section-padding container-luxury py-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/shop' },
            { label: collection.title },
          ]}
        />
      </div>

      {/* Products */}
      <div className="section-padding container-luxury pb-16">
        <div className="flex gap-8">
          {/* Filters */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            availableBrands={availableBrands}
            showMobile={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <Filter size={18} />
                  Filters
                </button>
                <p className="text-sm text-white/80">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <SortDropdown value={filters.sort} onChange={(sort) => setFilters(prev => ({ ...prev, sort }))} />
            </div>

            <ProductGrid products={filteredProducts} columns={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
