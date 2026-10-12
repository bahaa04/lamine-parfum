import { brands } from '../data/brands';
import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeading from '../components/ui/SectionHeading';
import BrandCard from '../components/ui/BrandCard';
import SearchBar from '../components/ui/SearchBar';
import { useState } from 'react';

export default function Brands() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBrands = filteredBrands.filter(b => b.featured);
  const otherBrands = filteredBrands.filter(b => !b.featured);

  // Group by first letter
  const groupedBrands = otherBrands.reduce((acc, brand) => {
    const letter = brand.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(brand);
    return acc;
  }, {} as Record<string, typeof brands>);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('page.brands.title') }]} />
          <div className="mt-6">
            <SectionHeading
              title={t('page.brands.title')}
              subtitle={t('page.home.featuredBrands')}
              align="left"
            />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="section-padding container-luxury py-8">
        <div className="max-w-md">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder={t('common.search.placeholder')}
          />
        </div>
      </div>

      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <div className="section-padding container-luxury pb-12">
          <h2 className="font-serif text-2xl mb-6">{t('page.home.featuredBrands')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      )}

      {/* All Brands Alphabetically */}
      <div className="section-padding container-luxury pb-16">
        <h2 className="font-serif text-2xl mb-6">{t('page.brands.allBrands')}</h2>

        {Object.keys(groupedBrands).length === 0 ? (
          <p className="text-white/80 text-center py-8">{t('page.brands.noBrands', { query: searchQuery })}</p>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedBrands)
              .sort()
              .map(letter => (
                <div key={letter}>
                  <h3 className="text-xl font-semibold text-gold mb-4">{letter}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedBrands[letter].map(brand => (
                      <BrandCard key={brand.id} brand={brand} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
