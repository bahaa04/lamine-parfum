import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, type Toast } from '../../context/toastStore';

const iconMap: Record<Toast['type'], typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap: Record<Toast['type'], { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    icon: 'text-sky-600',
  },
};

export default function ToastNotifications() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const colors = colorMap[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 border shadow-lg ${colors.bg} ${colors.border}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
              <p className="flex-1 text-sm text-ivory leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-0.5 text-white/70 hover:text-ivory transition-colors duration-200"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
