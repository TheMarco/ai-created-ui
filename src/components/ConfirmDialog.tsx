'use client';

import { type ReactNode } from 'react';
import { Description } from '@headlessui/react';
import { ModalOverlay, ModalPanel, ModalHeader, ModalBody, ModalFooter } from './Modal';
import Button from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When true, the confirm button uses the destructive action style. */
  destructive?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  loadingLabel = 'Working…',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <ModalOverlay
      role="alertdialog"
      onClose={loading ? undefined : onCancel}
      closeOnBackdrop={!loading}
    >
      <ModalPanel size="sm">
        <ModalHeader heading={title} onClose={loading ? undefined : onCancel} />
        {description && (
          <ModalBody>
            <Description className="text-sm text-text2">{description}</Description>
          </ModalBody>
        )}
        <ModalFooter className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  );
}
