'use client';

import { Fragment } from 'react';
import {
  Dialog as HeadlessDialog,
  Description,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { cn } from '../lib/utils';
import { overlaySizeClasses, type OverlaySize } from '../lib/overlay';
import { X } from 'lucide-react';

export type DialogSize = OverlaySize;

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: DialogSize;
  children: React.ReactNode;
  className?: string;
}

export default function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  className,
}: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-modal">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-overlay" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={cn(
                'w-full rounded-md border border-border bg-surface shadow-elevation-high',
                overlaySizeClasses[size],
                className
              )}
            >
              {(title || description) && (
                <div className="flex items-start justify-between border-b border-border px-6 py-4">
                  <div>
                    {title && (
                      <DialogTitle className="text-base font-heading font-medium text-text">
                        {title}
                      </DialogTitle>
                    )}
                    {description && (
                      <Description className="mt-1 text-sm text-text2">
                        {description}
                      </Description>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="-me-3.5 ms-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text3 transition-colors duration-200 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px]"
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="px-6 py-5">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
