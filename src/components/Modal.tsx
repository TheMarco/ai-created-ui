'use client';

import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { surfaceStyles } from './Surface';
import Button from './Button';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

export function ModalOverlay({
  onClose,
  closeOnBackdrop = true,
  className,
  children,
  ...props
}: ModalOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 overflow-y-auto',
        className
      )}
      {...props}
    >
      <div
        className="flex min-h-full items-start sm:items-center justify-center bg-overlay p-4 pt-16 sm:pt-4 backdrop-blur-md md:p-6"
        onClick={(event) => {
          if (!closeOnBackdrop || event.target !== event.currentTarget) return;
          onClose?.();
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface ModalPanelProps extends HTMLAttributes<HTMLDivElement> {
  size?: ModalSize;
}

export function ModalPanel({
  size = 'lg',
  className,
  children,
  ...props
}: ModalPanelProps) {
  return (
    <div
      className={cn(
        surfaceStyles({ variant: 'default', padding: 'none' }),
        'flex max-h-[calc(100dvh-3rem)] w-full flex-col overflow-hidden md:max-h-[calc(100dvh-4rem)]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  heading: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  onClose?: () => void;
}

export function ModalHeader({
  heading,
  description,
  eyebrow,
  onClose,
  className,
  children,
  ...props
}: ModalHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-6', className)}
      {...props}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow}
        <h2 className="font-heading text-xl text-text">{heading}</h2>
        {description ? <p className="text-sm text-text2">{description}</p> : null}
        {children}
      </div>
      {onClose ? (
        <Button variant="icon" size="icon" onClick={onClose} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  scroll?: boolean;
}

export function ModalBody({
  scroll = true,
  className,
  children,
  ...props
}: ModalBodyProps) {
  return (
    <div
      className={cn(
        'px-5 py-4 md:px-6',
        scroll && 'flex-1 overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-border px-5 py-4 md:px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
