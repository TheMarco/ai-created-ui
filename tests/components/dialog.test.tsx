import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Dialog from '../../src/components/Dialog';

function DialogHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Delete project</button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete project?"
        description="This action cannot be undone."
      >
        <button type="button">Confirm deletion</button>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('is labelled, moves focus inside, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription('This action cannot be undone.');
    const closeButton = screen.getByRole('button', { name: 'Close dialog' });
    expect(closeButton).toHaveClass(
      'absolute',
      'end-[6px]',
      'top-[6px]',
      'h-[44px]',
      'w-[44px]',
      'hover:text-text',
      'focus-visible:outline'
    );
    expect(closeButton).not.toHaveClass('border', 'hover:border-control-border-strong');
    expect(closeButton.parentElement).toHaveClass('relative', 'py-[12px]', 'pe-[56px]');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('keeps forward and reverse tab navigation inside the dialog', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('dialog', { name: 'Delete project?' });

    for (let index = 0; index < 4; index += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }

    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });
});
