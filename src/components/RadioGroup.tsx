import { forwardRef, useId } from 'react';
import { cn } from '../lib/utils';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  legend: string;
  name?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function RadioGroupInner<T extends string>(
  {
    options,
    value,
    onChange,
    legend,
    name,
    disabled = false,
    orientation = 'vertical',
    className,
  }: RadioGroupProps<T>,
  ref: React.ForwardedRef<HTMLFieldSetElement>
) {
  const groupId = useId();
  const groupName = name ?? groupId;

  return (
    <fieldset
      ref={ref}
      className={cn('border-none p-0 m-0', className)}
      disabled={disabled}
    >
      <legend className="mb-3 block text-xs font-mono uppercase tracking-wider text-text2">
        {legend}
      </legend>

      <div
        role="radiogroup"
        aria-label={legend}
        className={cn(
          orientation === 'horizontal'
            ? 'flex flex-wrap items-center gap-4'
            : 'flex flex-col gap-2.5'
        )}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'group flex min-h-[44px] items-center gap-2.5 cursor-pointer',
                isDisabled && 'cursor-not-allowed'
              )}
            >
              <span className="relative flex items-center justify-center">
                <input
                  id={optionId}
                  type="radio"
                  name={groupName}
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange(option.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-focus-visible:outline-offset-[3px]',
                    isDisabled && 'cursor-not-allowed opacity-50',
                    isSelected
                      ? 'border-action-primary bg-action-primary'
                      : 'border-control-border bg-transparent group-hover:border-control-border-strong'
                  )}
                >
                  {isSelected && (
                    <span className="h-[0.6rem] w-[0.6rem] rounded-full bg-on-action" />
                  )}
                </span>
              </span>
              <span
                className={cn(
                  'select-none text-xs text-text2',
                  isDisabled && 'opacity-50'
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const RadioGroup = forwardRef(RadioGroupInner) as <T extends string>(
  props: RadioGroupProps<T> & { ref?: React.ForwardedRef<HTMLFieldSetElement> }
) => React.ReactElement;

export default RadioGroup;
