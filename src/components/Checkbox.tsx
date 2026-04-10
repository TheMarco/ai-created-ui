import { forwardRef, useId } from 'react';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, onChange, label, disabled = false, className },
  ref
) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-2.5 cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span className="relative flex items-center justify-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-200',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-focus-visible:outline-offset-[3px]',
            disabled && 'cursor-not-allowed opacity-50',
            checked
              ? 'border-red-solid bg-red-solid'
              : 'border-border-strong bg-transparent hover:border-text3',
            !disabled && !checked && 'group-hover:border-text3'
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
      </span>
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

export default Checkbox;
