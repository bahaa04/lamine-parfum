import { formatPrice } from '../../utils/helpers';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className="flex items-center gap-2">
      {hasDiscount ? (
        <>
          <span className={`font-semibold text-red-600 ${sizeClasses[size]}`}>
            {formatPrice(price)}
          </span>
          <span className={`line-through text-white/70 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
            {formatPrice(originalPrice)}
          </span>
        </>
      ) : (
        <span className={`font-semibold text-ivory ${sizeClasses[size]}`}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}
