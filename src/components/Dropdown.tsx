'use client';

import { forwardRef } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { cn } from '../lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function DropdownInner<T extends string>(
  {
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    disabled = false,
    className,
  }: DropdownProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={cn('relative min-w-0', className)}>
        <ListboxLabel className="mb-2 block text-sm font-medium text-text2">
          {label}
        </ListboxLabel>

        <ListboxButton
          ref={ref}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            event.currentTarget.click();
          }}
          className={cn(
            'relative min-w-0 w-full rounded-md border border-border bg-surface2 py-3 pl-4 pr-10 text-left text-sm transition-colors duration-200',
            'hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px]',
            disabled && 'cursor-not-allowed opacity-50',
            selected ? 'text-text' : 'text-text3'
          )}
        >
          <span className="block truncate">
            {selected ? selected.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-text3" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          className={cn(
            'z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-md border border-border bg-surface py-1 text-sm shadow-lg focus:outline-none',
            'transition duration-100 ease-in data-[leave]:opacity-0'
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={({ active, selected: isSelected }) =>
                cn(
                  'relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors duration-200',
                  active && 'bg-surface2',
                  isSelected ? 'text-text font-medium' : 'text-text2',
                  option.disabled && 'cursor-not-allowed opacity-50'
                )
              }
            >
              {({ selected: isSelected }) => (
                <>
                  <span className={cn('block truncate', isSelected && 'font-medium')}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

const Dropdown = forwardRef(DropdownInner) as <T extends string>(
  props: DropdownProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) => React.ReactElement;

export default Dropdown;
