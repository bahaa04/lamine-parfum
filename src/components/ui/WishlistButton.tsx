import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../../context/wishlistStore';
import { useToastStore } from '../../context/toastStore';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({
  productId,
  size = 'md',
  className = '',
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem(productId);

    if (inWishlist) {
      addToast('info', 'Removed from wishlist');
    } else {
      addToast('success', 'Added to wishlist');
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      className={`transition-colors ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all ${
          inWishlist
            ? 'fill-red-500 text-red-500'
            : 'text-white/70 hover:text-gold'
        }`}
      />
    </motion.button>
  );
}
