import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type BadgeVariant =
  | 'default'
  | 'muted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-border bg-surface2 text-text',
  muted: 'border-border bg-surface text-text2',
  success: 'border-success-border bg-success-surface text-success',
  warning: 'border-warning-border bg-warning-surface text-warning',
  error: 'border-error-border bg-error-surface text-error',
  info: 'border-info-border bg-info-surface text-info',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', className, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

export default Badge;
