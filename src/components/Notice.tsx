import Surface from './Surface';
import { cn } from '../lib/utils';

export type NoticeVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

const textClasses: Record<NoticeVariant, string> = {
  default: 'text-text',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

function NoticeIcon({ variant }: { variant: NoticeVariant }) {
  if (variant === 'default') return null;

  if (variant === 'success') {
    return (
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (variant === 'warning') {
    return (
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.67 18h16.66a1 1 0 00.88-1.5l-7.5-13a1 1 0 00-1.76 0z" />
      </svg>
    );
  }

  if (variant === 'error') {
    return (
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title?: string;
  centered?: boolean;
  hideIcon?: boolean;
}

export default function Notice({
  variant = 'default',
  title,
  centered = false,
  hideIcon = false,
  className,
  role,
  children,
  ...props
}: NoticeProps) {
  const surfaceVariant = variant === 'default' ? 'default' : variant;
  const resolvedRole = role ?? (variant === 'error' ? 'alert' : 'status');
  const ariaLive = props['aria-live'] ?? (resolvedRole === 'alert' ? 'assertive' : 'polite');

  return (
    <Surface
      variant={surfaceVariant}
      padding="md"
      role={resolvedRole}
      aria-live={ariaLive}
      className={cn(centered && 'text-center', className)}
      {...props}
    >
      <div className={cn('flex gap-4', centered ? 'flex-col items-center' : 'items-start')}>
        {!hideIcon && <NoticeIcon variant={variant} />}
        <div className="min-w-0">
          {title && (
            <p className={cn('text-sm font-medium', textClasses[variant], !children && 'mb-0')}>
              {title}
            </p>
          )}
          {children && (
            <div className={cn('text-sm leading-relaxed text-text2', title && 'mt-2')}>
              {children}
            </div>
          )}
        </div>
      </div>
    </Surface>
  );
}
