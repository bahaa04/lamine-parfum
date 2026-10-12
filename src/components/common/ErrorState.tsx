import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle size={48} className="text-red-600 mb-4" strokeWidth={1.5} />
      <h3 className="font-serif text-2xl text-ivory mb-2">{title}</h3>
      {message && (
        <p className="text-white/70 max-w-md mb-6">{message}</p>
      )}
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}
