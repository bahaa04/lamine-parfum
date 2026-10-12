import { useLocale, type Language } from '../../context/LocaleContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-obsidian/80 rounded-lg transition-colors"
        aria-label="Select language"
      >
        <Globe size={20} className="text-ivory" />
        <span className="text-sm font-medium text-ivory hidden sm:inline">
          {currentLanguage?.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-obsidian border border-gold/20 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-obsidian/80 transition-colors ${
                language === lang.code
                  ? 'text-gold font-semibold bg-gold/10'
                  : 'text-ivory'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
