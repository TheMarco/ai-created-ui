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
import { OverlayHeaderFrame } from './OverlayHeader';

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
                <OverlayHeaderFrame onClose={onClose}>
                  <div className="min-w-0 space-y-1.5">
                    {title && (
                      <DialogTitle className="font-heading text-xl text-text">
                        {title}
                      </DialogTitle>
                    )}
                    {description && (
                      <Description className="text-sm text-text2">
                        {description}
                      </Description>
                    )}
                  </div>
                </OverlayHeaderFrame>
              )}

              <div className="px-6 py-5">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
