import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useToastStore } from '../../context/toastStore';
import { useLocale } from '../../context/LocaleContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const addToast = useToastStore((s) => s.addToast);
  const { t } = useLocale();

  const shopLinks = [
    { to: '/shop', label: t('nav.shop') },
    { to: '/shop?filter=bestsellers', label: t('page.home.bestsellers') },
    { to: '/shop?filter=new', label: t('page.home.newArrivals') },
    { to: '/shop?gender=men', label: t('nav.men') },
    { to: '/shop?gender=women', label: t('nav.women') },
    { to: '/shop?gender=unisex', label: t('nav.unisex') },
  ];

  const customerCareLinks = [
    { to: '/faq', label: t('nav.faq') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/shipping', label: 'Shipping & Returns' },
    { to: '/order-tracking', label: 'Track Your Order' },
  ];

  const aboutLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/brands', label: t('nav.brands') },
    { to: '/journal', label: 'Fragrance Journal' },
  ];

  const legalLinks = [
    { to: '#', label: 'Privacy Policy' },
    { to: '#', label: 'Terms & Conditions' },
    { to: '#', label: 'Cookie Policy' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#', label: 'Instagram' },
    { name: 'Facebook', href: '#', label: 'Facebook' },
    { name: 'X', href: '#', label: 'X (Twitter)' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast('success', 'Thank you for subscribing! Welcome to LAMINE PARFUM.');
    setEmail('');
  };

  // Mark as used to avoid TS warning
  void handleNewsletterSubmit;

  return (
    <footer className="bg-espresso text-white/80">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
      </div>

      {/* Main Footer Content */}
      <div className="container-luxury section-padding py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:pr-4">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-xl font-semibold tracking-[0.08em] text-white">
                LAMINE PARFUM
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Curating the world's finest fragrances for the modern connoisseur.
              Authenticity guaranteed.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all duration-300 text-xs font-medium"
                  aria-label={social.label}
                >
                  {social.name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              {t('nav.shop')}
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              {customerCareLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-4">
              {t('nav.about')}
            </h4>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}

              {/* Legal sub-section */}
              <li className="pt-3">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/30 mb-2">
                  Legal
                </p>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-white/40 hover:text-gold transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 tracking-wide">
            &copy; 2024 LAMINE PARFUM. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/25 tracking-wider uppercase mr-1">
              We accept
            </span>
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
              <span
                key={method}
                className="text-[10px] font-medium text-white/40 tracking-wider uppercase px-2 py-1 border border-white/10 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
