import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-white/70">
        {icon || <Package size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="font-serif text-2xl text-ivory mb-2">{title}</h3>
      {description && (
        <p className="text-white/70 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Link to={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}
