'use client';

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface OverlayCloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label?: string;
}

export const OverlayCloseButton = forwardRef<HTMLButtonElement, OverlayCloseButtonProps>(
  function OverlayCloseButton({ label = 'Close dialog', ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="absolute end-[6px] top-[6px] flex h-[44px] w-[44px] items-center justify-center rounded-md text-text3 transition-colors duration-200 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px]"
        aria-label={label}
        {...props}
      >
        <X className="h-[24px] w-[24px]" aria-hidden="true" />
      </button>
    );
  }
);

interface OverlayHeaderFrameProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export const OverlayHeaderFrame = forwardRef<HTMLDivElement, OverlayHeaderFrameProps>(
  function OverlayHeaderFrame({ onClose, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'relative border-b border-border px-[20px] py-[12px] md:px-[24px]',
          onClose && 'pe-[56px] md:pe-[56px]',
          className
        )}
        {...props}
      >
        {children}
        {onClose ? <OverlayCloseButton onClick={onClose} /> : null}
      </div>
    );
  }
);
