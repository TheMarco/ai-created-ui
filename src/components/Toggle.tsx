import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, onChange, label, disabled = false, className },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'group flex min-h-[44px] items-center gap-2.5 cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-200',
          'group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-focus group-focus-visible:outline-offset-[3px]',
          disabled && 'cursor-not-allowed opacity-50',
          checked
            ? 'border-action-primary bg-action-primary'
            : 'border-control-border bg-surface2 group-hover:border-control-border-strong'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-on-action shadow-elevation-low transition-transform duration-200',
            checked ? 'translate-x-[25px]' : 'translate-x-[3px]'
          )}
        />
      </span>
      <span
        className={cn(
          'select-none text-xs text-text2',
          disabled && 'opacity-50'
        )}
      >
        {label}
      </span>
    </button>
  );
});

export default Toggle;
