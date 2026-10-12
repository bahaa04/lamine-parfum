import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { announcements } from '../../data/siteData';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextAnnouncement = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(nextAnnouncement, 5000);
    return () => clearInterval(interval);
  }, [isVisible, nextAnnouncement]);

  if (!isVisible) return null;

  const current = announcements[currentIndex];

  return (
    <div className="relative bg-obsidian text-gold py-2.5 px-4 text-center overflow-hidden">
      <div className="container-luxury flex items-center justify-center min-h-[20px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-xs sm:text-sm font-medium tracking-wider uppercase"
          >
            {current.text}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300 p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-1">
        {announcements.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-gold w-3' : 'bg-taupe/40'
            }`}
            aria-label={`Go to announcement ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
