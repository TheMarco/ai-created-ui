'use client';

import { type ReactNode } from 'react';
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
  /** When true, the confirm button uses the destructive (primary/red) style */
  destructive?: boolean;
  loading?: boolean;
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
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <ModalOverlay onClose={onCancel}>
      <ModalPanel size="sm">
        <ModalHeader heading={title} onClose={onCancel} />
        {description && (
          <ModalBody>
            <p className="text-sm text-text2">{description}</p>
          </ModalBody>
        )}
        <ModalFooter className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'primary' : 'secondary'}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting\u2026' : confirmLabel}
          </Button>
        </ModalFooter>
      </ModalPanel>
    </ModalOverlay>
  );
}
