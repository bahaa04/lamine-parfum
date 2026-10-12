import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { products } from '../data/products';
import { brands } from '../data/brands';
import type { FilterState, SortOption } from '../types';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import SortDropdown from '../components/product/SortDropdown';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeading from '../components/ui/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { useLocale } from '../context/LocaleContext';

export default function Shop() {
  const { t } = useLocale();
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

  // Get unique brand names for filter
  const availableBrands = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.name))).sort();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.gender.length > 0) {
      result = result.filter(p => filters.gender.includes(p.gender));
    }

    if (filters.fragranceFamily.length > 0) {
      result = result.filter(p => filters.fragranceFamily.includes(p.fragranceFamily));
    }

    if (filters.brand.length > 0) {
      result = result.filter(p => filters.brand.includes(p.brand));
    }

    if (filters.concentration.length > 0) {
      result = result.filter(p => filters.concentration.includes(p.concentration));
    }

    // Price filter
    result = result.filter(p => {
      const minPrice = Math.min(...p.sizes.map(s => s.price));
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    // Availability filter
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
  }, [filters]);

  const handleSortChange = (sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Header */}
      <div className="bg-obsidian border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.shop') }]} />
          <div className="mt-6">
            <SectionHeading title={t('common.allFragrances')} align="left" />
            <p className="text-white/80 mt-2">
              {t('common.discoverCollection')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-padding container-luxury py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            availableBrands={availableBrands}
            showMobile={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
          />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <Filter size={18} />
                  {t('common.filters')}
                </button>

                <p className="text-sm text-white/80">
                  {t('common.showing', { count: filteredProducts.length })}
                </p>
              </div>

              <SortDropdown value={filters.sort} onChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={3} />
            ) : (
              <EmptyState
                title={t('common.noResults')}
                description={t('filters.clear')}
                action={{ label: t('common.clearAll'), href: '/shop' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
