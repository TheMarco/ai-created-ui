'use client';

import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  Description,
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { surfaceStyles } from './Surface';
import Button from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

export const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(function ModalOverlay(
  {
    onClose,
    closeOnBackdrop = true,
    className,
    children,
    role = 'dialog',
    ...props
  },
  ref
) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <HeadlessDialog
      ref={ref}
      open
      onClose={() => onClose?.()}
      role={role === 'alertdialog' ? 'alertdialog' : 'dialog'}
      className={cn('relative z-50', className)}
      {...props}
    >
      <HeadlessDialogPanel className="fixed inset-0 overflow-y-auto">
        {/* Backdrop click is a pointer convenience. Modal content provides keyboard-operable close controls. */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="flex min-h-full items-start justify-center bg-overlay p-4 pt-16 backdrop-blur-md sm:items-center sm:pt-4 md:p-6"
          onClick={(event) => {
            if (!closeOnBackdrop || event.target !== event.currentTarget) return;
            onClose?.();
          }}
        >
          {children}
        </div>
      </HeadlessDialogPanel>
    </HeadlessDialog>
  );
});

export interface ModalPanelProps extends HTMLAttributes<HTMLDivElement> {
  size?: ModalSize;
}

export const ModalPanel = forwardRef<HTMLDivElement, ModalPanelProps>(function ModalPanel(
  { size = 'lg', className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
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
});

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  heading: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  onClose?: () => void;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
  { heading, description, eyebrow, onClose, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-6', className)}
      {...props}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow}
        <DialogTitle className="font-heading text-xl text-text">{heading}</DialogTitle>
        {description ? <Description className="text-sm text-text2">{description}</Description> : null}
        {children}
      </div>
      {onClose ? (
        <Button
          variant="icon"
          size="icon"
          onClick={onClose}
          className="shrink-0"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
});

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  scroll?: boolean;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { scroll = true, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
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
});

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('border-t border-border px-5 py-4 md:px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});
