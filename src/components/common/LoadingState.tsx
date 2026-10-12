interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && (
        <p className="text-white/70 text-sm">{message}</p>
      )}
    </div>
  );
}
