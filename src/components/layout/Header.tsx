import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '../../context/cartStore';
import { useWishlistStore } from '../../context/wishlistStore';
import { useLocale } from '../../context/LocaleContext';
import LanguageSelector from '../common/LanguageSelector';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLocale();

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistItemCount = useWishlistStore((s) => s.getItemCount());

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/brands', label: t('nav.brands') },
    { to: '/about', label: t('nav.about') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-obsidian/95 backdrop-blur-md shadow-[0_1px_3px_rgba(198,164,106,0.1)]'
            : 'bg-obsidian'
        }`}
      >
        <div className="container-luxury section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile: Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-ivory hover:text-gold transition-colors duration-300"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop: Nav Left */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
              {navLinks.slice(0, 3).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-300 whitespace-nowrap ${
                      isActive
                        ? 'text-gold'
                        : 'text-ivory hover:text-gold'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <h1 className="font-serif text-xl sm:text-2xl lg:text-[1.7rem] font-semibold tracking-[0.08em] text-ivory whitespace-nowrap">
                LAMINE PARFUM
              </h1>
            </Link>

            {/* Desktop: Nav Right */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.slice(3).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-300 whitespace-nowrap ${
                      isActive
                        ? 'text-gold'
                        : 'text-ivory hover:text-gold'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              <LanguageSelector />

              <Link
                to="/search"
                className="p-2 text-ivory hover:text-gold transition-colors duration-300"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>

              <Link
                to="/wishlist"
                className="relative p-2 text-ivory hover:text-gold transition-colors duration-300"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ivory text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 text-ivory hover:text-gold transition-colors duration-300"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ivory text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
