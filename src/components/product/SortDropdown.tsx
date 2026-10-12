import type { SortOption } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useLocale();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: t('sort.featured') },
    { value: 'newest', label: t('sort.newest') },
    { value: 'price-asc', label: t('sort.priceLowHigh') },
    { value: 'price-desc', label: t('sort.priceHighLow') },
    { value: 'rating', label: t('sort.rating') },
  ];

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-medium text-ivory whitespace-nowrap">
        {t('filters.title')}:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-4 py-2 border border-gold/30 rounded text-sm bg-obsidian hover:border-gold focus:outline-none focus:border-gold transition-colors"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
