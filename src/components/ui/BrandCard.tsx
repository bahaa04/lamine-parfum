import { Link } from 'react-router-dom';

interface BrandCardProps {
  brand: {
    name: string;
    slug: string;
    description?: string;
    featured?: boolean;
  };
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="group relative block bg-obsidian border border-gold/20 rounded-lg p-8 transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-lg"
    >
      {brand.featured && (
        <span className="absolute top-3 right-3 bg-gold text-ivory px-2 py-1 text-xs font-semibold uppercase tracking-wider">
          Featured
        </span>
      )}

      <div className="flex flex-col items-center justify-center min-h-[140px] text-center">
        <h3 className="font-serif text-xl md:text-2xl text-ivory group-hover:text-gold transition-colors mb-2">
          {brand.name}
        </h3>
        {brand.description && (
          <p className="text-sm text-white/70 line-clamp-2">
            {brand.description}
          </p>
        )}
      </div>
    </Link>
  );
}
