import { forwardRef, useId } from 'react';
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
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex min-h-[44px] items-center gap-2.5 cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px]',
          disabled && 'cursor-not-allowed opacity-50',
          checked
            ? 'border-red-solid bg-red-solid'
            : 'border-border-strong bg-surface2 hover:border-text3'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[25px]' : 'translate-x-[3px]'
          )}
        />
      </button>
      <span
        className={cn(
          'select-none text-xs text-text2',
          disabled && 'opacity-50'
        )}
      >
        {label}
      </span>
    </label>
  );
});

export default Toggle;
