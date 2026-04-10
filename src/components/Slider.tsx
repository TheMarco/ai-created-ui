import { forwardRef, useId } from 'react';
import { cn } from '../lib/utils';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    onChange,
    label,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = true,
    formatValue,
    className,
  },
  ref
) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : String(value);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-text2"
        >
          {label}
        </label>
        {showValue && (
          <output
            htmlFor={id}
            className="text-xs font-mono text-text3 tabular-nums"
          >
            {displayValue}
          </output>
        )}
      </div>

      <div className="relative flex min-h-[44px] items-center">
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          className={cn(
            'slider-input w-full appearance-none bg-transparent cursor-pointer',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px] rounded-full',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          style={
            {
              '--slider-progress': `${percentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
});

export default Slider;
