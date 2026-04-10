'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { cn } from '../lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
  }>;
  className?: string;
}

export default function Tooltip({
  content,
  position = 'top',
  delay = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  const tooltipId = `${id}-tooltip`;

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!visible) return;

    function handleOutsideTouch(e: TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }

    document.addEventListener('touchstart', handleOutsideTouch);
    return () => document.removeEventListener('touchstart', handleOutsideTouch);
  }, [visible]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onTouchStart={handleTouchStart}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </span>

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text2 shadow-lg',
            'whitespace-normal break-words w-max max-w-[240px]',
            'animate-in fade-in duration-150',
            positionClasses[position],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
