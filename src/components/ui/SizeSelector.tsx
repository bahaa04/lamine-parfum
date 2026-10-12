import type { ProductSize } from '../../types';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selectedSize: number;
  onSelect: (ml: number) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = size.ml === selectedSize;
        const isDisabled = !size.inStock;

        return (
          <button
            key={size.ml}
            onClick={() => !isDisabled && onSelect(size.ml)}
            disabled={isDisabled}
            className={`px-4 py-2 border rounded transition-all ${
              isSelected
                ? 'border-gold bg-gold/10 text-ivory'
                : isDisabled
                ? 'border-gold/30 text-white/70/50 opacity-50 line-through cursor-not-allowed'
                : 'border-gold/30 text-ivory hover:border-gold'
            }`}
          >
            {size.ml} ml
          </button>
        );
      })}
    </div>
  );
}
