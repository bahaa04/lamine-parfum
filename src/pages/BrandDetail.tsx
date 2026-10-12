import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getBrandBySlug } from '../data/brands';
import { getProductsByBrand } from '../data/products';
import type { FilterState } from '../types';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import SortDropdown from '../components/product/SortDropdown';
import ErrorState from '../components/common/ErrorState';
import { Filter } from 'lucide-react';
import { brands } from '../data/brands';

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    gender: [],
    fragranceFamily: [],
    brand: [],
    concentration: [],
    priceRange: [0, 1000],
    availability: null,
    sort: 'featured',
  });

  const brand = slug ? getBrandBySlug(slug) : undefined;
  const allBrandProducts = slug ? getProductsByBrand(slug) : [];

  const availableBrands = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.name))).sort();
  }, []);

  if (!slug || !brand) {
    return (
      <div className="section-padding container-luxury py-16">
        <ErrorState
          title="Brand not found"
          message="The brand you're looking for doesn't exist."
          onRetry={() => navigate('/brands')}
        />
      </div>
    );
  }

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...allBrandProducts];

    if (filters.gender.length > 0) {
      result = result.filter(p => filters.gender.includes(p.gender));
    }

    if (filters.fragranceFamily.length > 0) {
      result = result.filter(p => filters.fragranceFamily.includes(p.fragranceFamily));
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
  }, [allBrandProducts, filters]);

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <div className="bg-obsidian border-b border-gold/20">
        <div className="section-padding container-luxury py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Brands', href: '/brands' },
              { label: brand.name },
            ]}
          />
          <div className="mt-8">
            <h1 className="font-serif text-4xl md:text-5xl text-ivory mb-4">{brand.name}</h1>
            {brand.description && (
              <p className="text-white/80 text-lg max-w-3xl leading-relaxed">{brand.description}</p>
            )}
            {brand.country && (
              <p className="text-sm text-white/80 mt-4">Origin: {brand.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section-padding container-luxury py-8">
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
              <SortDropdown
                value={filters.sort}
                onChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
              />
            </div>

            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={3} />
            ) : (
              <div className="text-center py-16">
                <p className="text-white/80">No products found for this brand.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
