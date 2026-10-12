import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="section-padding text-center max-w-2xl mx-auto py-16">
        <div className="mb-8">
          <h1 className="font-serif text-[120px] leading-none text-gold mb-4">404</h1>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            {t('page.notFound.title')}
          </h2>
          <p className="text-white/80 text-lg">
            {t('page.notFound.message')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home size={20} />
            {t('common.goHome')}
          </Link>
          <Link to="/search" className="btn-secondary flex items-center justify-center gap-2">
            <Search size={20} />
            {t('common.search')}
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <p className="text-sm text-white/80 mb-4">{t('common.explore')}:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/shop" className="text-gold hover:text-ivory hover:text-ivory transition-colors">
              {t('common.shopAll')}
            </Link>
            <Link to="/collections/men" className="text-gold hover:text-ivory hover:text-ivory transition-colors">
              {t('nav.men')}
            </Link>
            <Link to="/collections/women" className="text-gold hover:text-ivory hover:text-ivory transition-colors">
              {t('nav.women')}
            </Link>
            <Link to="/brands" className="text-gold hover:text-ivory hover:text-ivory transition-colors">
              {t('nav.brands')}
            </Link>
            <Link to="/about" className="text-gold hover:text-ivory hover:text-ivory transition-colors">
              {t('nav.about')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
