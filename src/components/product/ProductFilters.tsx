import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: string[];
  showMobile: boolean;
  onCloseMobile: () => void;
}

const fragranceFamilies = [
  'Woody', 'Oud', 'Amber', 'Fresh', 'Floral', 'Citrus', 'Oriental', 'Aromatic', 'Spicy', 'Leather'
];

const concentrations = [
  'Eau de Parfum', 'Eau de Toilette', 'Extrait de Parfum', 'Parfum'
];

export default function ProductFilters({
  filters,
  onFilterChange,
  availableBrands,
  showMobile,
  onCloseMobile,
}: ProductFiltersProps) {
  const { t } = useLocale();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: true,
    family: true,
    brand: false,
    concentration: false,
    price: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenderChange = (gender: string) => {
    const newGenders = filters.gender.includes(gender)
      ? filters.gender.filter(g => g !== gender)
      : [...filters.gender, gender];
    onFilterChange({ ...filters, gender: newGenders });
  };

  const handleFamilyChange = (family: string) => {
    const newFamilies = filters.fragranceFamily.includes(family)
      ? filters.fragranceFamily.filter(f => f !== family)
      : [...filters.fragranceFamily, family];
    onFilterChange({ ...filters, fragranceFamily: newFamilies });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand];
    onFilterChange({ ...filters, brand: newBrands });
  };

  const handleConcentrationChange = (conc: string) => {
    const newConcs = filters.concentration.includes(conc)
      ? filters.concentration.filter(c => c !== conc)
      : [...filters.concentration, conc];
    onFilterChange({ ...filters, concentration: newConcs });
  };

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = parseInt(value) || 0;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const clearFilters = () => {
    onFilterChange({
      gender: [],
      fragranceFamily: [],
      brand: [],
      concentration: [],
      priceRange: [0, 1000],
      availability: null,
      sort: filters.sort,
    });
  };

  const activeFilterCount =
    filters.gender.length +
    filters.fragranceFamily.length +
    filters.brand.length +
    filters.concentration.length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-gold hover:text-ivory transition-colors"
        >
          {t('filters.clear')} ({activeFilterCount})
        </button>
      )}

      {/* Gender */}
      <div className="border-b border-gold/20 pb-4">
        <button
          onClick={() => toggleSection('gender')}
          className="w-full flex items-center justify-between text-left font-semibold text-ivory mb-3"
        >
          {t('filters.gender')}
          {expandedSections.gender ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.gender && (
          <div className="space-y-2">
            {['men', 'women', 'unisex'].map(gender => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                  className="w-4 h-4 text-gold focus:ring-gold border-gold/30 rounded"
                />
                <span className="text-sm capitalize">{t(`nav.${gender}`)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fragrance Family */}
      <div className="border-b border-gold/20 pb-4">
        <button
          onClick={() => toggleSection('family')}
          className="w-full flex items-center justify-between text-left font-semibold text-ivory mb-3"
        >
          {t('filters.fragranceFamily')}
          {expandedSections.family ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.family && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fragranceFamilies.map(family => (
              <label key={family} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fragranceFamily.includes(family)}
                  onChange={() => handleFamilyChange(family)}
                  className="w-4 h-4 text-gold focus:ring-gold border-gold/30 rounded"
                />
                <span className="text-sm">{family}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="border-b border-gold/20 pb-4">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between text-left font-semibold text-ivory mb-3"
        >
          {t('filters.brand')}
          {expandedSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 text-gold focus:ring-gold border-gold/30 rounded"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Concentration */}
      <div className="border-b border-gold/20 pb-4">
        <button
          onClick={() => toggleSection('concentration')}
          className="w-full flex items-center justify-between text-left font-semibold text-ivory mb-3"
        >
          {t('product.concentration')}
          {expandedSections.concentration ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.concentration && (
          <div className="space-y-2">
            {concentrations.map(conc => (
              <label key={conc} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.concentration.includes(conc)}
                  onChange={() => handleConcentrationChange(conc)}
                  className="w-4 h-4 text-gold focus:ring-gold border-gold/30 rounded"
                />
                <span className="text-sm">{conc}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gold/20 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left font-semibold text-ivory mb-3"
        >
          {t('filters.price')}
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gold/30 rounded text-sm"
            />
            <span className="text-white/70">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gold/30 rounded text-sm"
            />
          </div>
        )}
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availability === true}
            onChange={(e) => onFilterChange({ ...filters, availability: e.target.checked ? true : null })}
            className="w-4 h-4 text-gold focus:ring-gold border-gold/30 rounded"
          />
          <span className="text-sm font-semibold">{t('filters.availability')}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="font-serif text-2xl mb-6">{t('filters.title')}</h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={onCloseMobile}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-obsidian z-[70] overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl">{t('filters.title')}</h2>
                  <button onClick={onCloseMobile} className="p-2 hover:bg-espresso rounded-full">
                    <X size={24} />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
