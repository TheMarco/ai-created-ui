import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type SurfaceVariant =
  | 'default'
  | 'muted'
  | 'accent'
  | 'inset'
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
export type SurfaceInteraction = 'none' | 'group' | 'within';

export interface SurfaceStyleOptions {
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  interaction?: SurfaceInteraction;
  className?: string;
}

const variantClasses: Record<SurfaceVariant, string> = {
  default: 'bg-surface border-border',
  muted: 'bg-surface2 border-border',
  accent: 'bg-surface border-accent-border',
  inset: 'bg-bg border-border',
  success: 'bg-success-surface border-success-border',
  warning: 'bg-warning-surface border-warning-border',
  info: 'bg-info-surface border-info-border',
  error: 'bg-error-surface border-error-border',
};

const paddingClasses: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
  responsive: 'p-8 md:p-12',
};

const defaultInteractionClasses: Record<Exclude<SurfaceInteraction, 'none'>, string> = {
  group: 'transition-colors duration-200 group-hover:border-border-strong group-focus-visible:border-border-strong',
  within: 'transition-colors duration-200 hover:border-border-strong focus-within:border-border-strong',
};

const accentInteractionClasses: Record<Exclude<SurfaceInteraction, 'none'>, string> = {
  group: 'transition-colors duration-200 group-hover:border-red2 group-focus-visible:border-red2',
  within: 'transition-colors duration-200 hover:border-red2 focus-within:border-red2',
};

export function surfaceStyles({
  variant = 'default',
  padding = 'none',
  interaction = 'none',
  className,
}: SurfaceStyleOptions = {}) {
  const interactionClasses =
    interaction === 'none'
      ? ''
      : variant === 'accent'
        ? accentInteractionClasses[interaction]
        : defaultInteractionClasses[interaction];

  return cn(
    'rounded-md border',
    variantClasses[variant],
    paddingClasses[padding],
    interactionClasses,
    className
  );
}

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement>, SurfaceStyleOptions {}

const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { variant = 'default', padding = 'none', interaction = 'none', className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={surfaceStyles({ variant, padding, interaction, className })}
      {...props}
    />
  );
});

export default Surface;
