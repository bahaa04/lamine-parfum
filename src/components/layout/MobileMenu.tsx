import { Link } from 'react-router-dom';
import { X, Heart, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWishlistStore } from '../../context/wishlistStore';
import { useLocale } from '../../context/LocaleContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { to: string; label: string }[];
}

const socialLinks = [
  { name: 'Instagram', href: '#', label: 'Instagram' },
  { name: 'Facebook', href: '#', label: 'Facebook' },
  { name: 'X', href: '#', label: 'X (Twitter)' },
];

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const wishlistCount = useWishlistStore((s) => s.getItemCount());
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-obsidian/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-obsidian z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
              <span className="font-serif text-lg font-semibold tracking-[0.08em] text-ivory">
                LAMINE PARFUM
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-ivory hover:text-gold transition-colors duration-300"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="block py-3 text-sm font-medium tracking-[0.12em] uppercase text-ivory hover:text-gold transition-colors duration-300 border-b border-gold/10"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Account & Wishlist */}
              <div className="mt-8 pt-6 border-t border-gold/20 space-y-1">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 text-sm font-medium tracking-[0.1em] uppercase text-ivory hover:text-gold transition-colors duration-300"
                  >
                    <User className="w-4 h-4" />
                    {t('nav.account')}
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 text-sm font-medium tracking-[0.1em] uppercase text-ivory hover:text-gold transition-colors duration-300"
                  >
                    <Heart className="w-4 h-4" />
                    {t('nav.wishlist')}
                    {wishlistCount > 0 && (
                      <span className="ml-auto w-5 h-5 bg-gold text-ivory text-[10px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>
            </nav>

            {/* Social Links */}
            <div className="px-6 py-5 border-t border-gold/20">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-ivory/50 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ivory hover:text-gold transition-colors duration-300 text-xs font-semibold"
                    aria-label={social.label}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
