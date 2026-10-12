import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  max = 10,
  min = 1,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isMinDisabled = value <= min;
  const isMaxDisabled = value >= max;

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrement}
        disabled={isMinDisabled}
        className={`w-8 h-8 flex items-center justify-center border border-gold/30 rounded-l transition-colors ${
          isMinDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-gold hover:bg-gold/5'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gold/30 text-sm font-medium">
        {value}
      </div>
      <button
        onClick={handleIncrement}
        disabled={isMaxDisabled}
        className={`w-8 h-8 flex items-center justify-center border border-gold/30 rounded-r transition-colors ${
          isMaxDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-gold hover:bg-gold/5'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
