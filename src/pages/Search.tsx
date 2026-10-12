import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductGrid from '../components/product/ProductGrid';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();

    return products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.fragranceFamily.toLowerCase().includes(searchTerm) ||
        product.concentration.toLowerCase().includes(searchTerm) ||
        product.topNotes.some(note => note.toLowerCase().includes(searchTerm)) ||
        product.heartNotes.some(note => note.toLowerCase().includes(searchTerm)) ||
        product.baseNotes.some(note => note.toLowerCase().includes(searchTerm)) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('page.search.title') }]} />
        </div>
      </div>

      {/* Search Section */}
      <div className="section-padding container-luxury py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-center mb-8">{t('page.search.title')}</h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder={t('common.search.placeholder')}
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="section-padding container-luxury pb-16">
        {query.trim() ? (
          <>
            <div className="mb-8">
              <p className="text-white/80">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "
                <span className="text-ivory font-medium">{query}</span>"
              </p>
            </div>

            {searchResults.length > 0 ? (
              <ProductGrid products={searchResults} columns={4} />
            ) : (
              <EmptyState
                icon={<Search size={48} strokeWidth={1.5} />}
                title="No results found"
                description={`We couldn't find any products matching "${query}". Try different keywords or browse our collections.`}
                action={{ label: 'Browse All Products', href: '/shop' }}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-white/80 mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-ivory mb-2">Start Searching</h3>
            <p className="text-white/80 mb-8">Enter keywords to find your perfect fragrance</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/collections/men" className="btn-secondary">
                Browse Men's
              </Link>
              <Link to="/collections/women" className="btn-secondary">
                Browse Women's
              </Link>
              <Link to="/collections/unisex" className="btn-secondary">
                Browse Unisex
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
