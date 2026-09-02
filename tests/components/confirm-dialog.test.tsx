import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfirmDialog from '../../src/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('exposes alert-dialog semantics and routes each action', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="Delete project?"
        description="This cannot be undone."
      />
    );

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveClass('bg-action-primary');
    const closeButton = screen.getByRole('button', { name: 'Close dialog' });
    expect(closeButton).toHaveClass(
      'absolute',
      'end-[6px]',
      'top-[6px]',
      'h-[44px]',
      'w-[44px]',
      'focus-visible:outline'
    );
    expect(closeButton).not.toHaveClass('border', 'hover:border-control-border-strong');
    expect(closeButton.querySelector('svg')).toHaveClass('h-[24px]', 'w-[24px]');
    expect(closeButton.parentElement).toHaveClass('relative', 'py-[12px]', 'pe-[56px]');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('uses the dedicated destructive action treatment when requested', async () => {
    render(
      <ConfirmDialog
        open
        destructive
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete project?"
      />
    );

    expect(await screen.findByRole('button', { name: 'Confirm' })).toHaveClass(
      'bg-action-destructive'
    );
  });

  it('disables every dismissal path while loading', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        open
        loading
        onCancel={onCancel}
        onConfirm={vi.fn()}
        title="Delete project?"
      />
    );

    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Working…' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(onCancel).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog', { name: 'Delete project?' })).toBeVisible();
  });

  it('supports an explicit loading label', async () => {
    render(
      <ConfirmDialog
        open
        loading
        loadingLabel="Deleting…"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete project?"
      />
    );

    expect(await screen.findByRole('button', { name: 'Deleting…' })).toBeDisabled();
  });
});
