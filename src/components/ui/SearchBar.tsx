import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/helpers';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search fragrances...',
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Debounced search callback
  useEffect(() => {
    if (!onSearch) return;

    const handleSearch = (q: string) => {
      onSearch(q);
    };

    const debouncedSearch = debounce(handleSearch, 300);
    debouncedSearch(query);
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2 border border-gold/30 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-ivory transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
