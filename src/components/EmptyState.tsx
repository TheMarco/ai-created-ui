import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';
import Surface from './Surface';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Surface
      variant="muted"
      padding="responsive"
      className={cn('text-center', className)}
      {...props}
    >
      {Icon && <Icon className="mx-auto mb-4 h-12 w-12 text-text3" />}

      <div className={cn('mx-auto space-y-2', Icon ? 'max-w-md' : '')}>
        <p className="text-text2 font-medium">{title}</p>
        {description && (
          <p className="text-sm text-text3">
            {description}
          </p>
        )}
      </div>

      {children && <div className="mt-6">{children}</div>}
    </Surface>
  );
}
