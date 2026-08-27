'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'ghost'
  | 'filter'
  | 'filter-active'
  | 'icon';

export type ButtonSize = 'inline' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-red-solid text-white hover:bg-red-solid-hover',
  destructive: 'bg-red-solid text-white hover:bg-red-solid-hover',
  secondary: 'border border-border bg-transparent text-text2 hover:text-text hover:border-border-strong',
  ghost: 'text-text2 hover:text-text',
  filter: 'border border-border bg-surface text-text2 hover:text-text hover:border-border-strong',
  'filter-active': 'border border-red-border bg-surface2 text-text',
  icon: 'border border-transparent text-text2 hover:text-text hover:border-border-strong',
};

const sizeClasses: Record<ButtonSize, string> = {
  inline: 'p-0 text-sm',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
  xl: 'px-8 py-3 text-sm',
  icon: 'h-9 w-9 text-sm',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleOptions {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, className, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    />
  );
});

export default Button;
