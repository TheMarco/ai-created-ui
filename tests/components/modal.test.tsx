import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
} from '../../src/components/Modal';

function ModalHarness({ closeOnBackdrop = true }: { closeOnBackdrop?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open settings</button>
      {open ? (
        <ModalOverlay onClose={() => setOpen(false)} closeOnBackdrop={closeOnBackdrop}>
          <ModalPanel>
            <ModalHeader
              heading="Settings"
              description="Manage your account preferences."
              onClose={() => setOpen(false)}
            />
            <ModalBody>
              <button type="button">Save settings</button>
            </ModalBody>
          </ModalPanel>
        </ModalOverlay>
      ) : null}
    </>
  );
}

describe('Modal', () => {
  it('labels the dialog, traps focus, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const trigger = screen.getByRole('button', { name: 'Open settings' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAccessibleDescription('Manage your account preferences.');
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveClass(
      'h-11',
      'w-11',
      '-me-3.5'
    );
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    for (let index = 0; index < 4; index += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('honors the closeOnBackdrop contract', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ModalHarness closeOnBackdrop={false} />);

    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    let dialog = await screen.findByRole('dialog', { name: 'Settings' });
    let backdrop = dialog.querySelector('.bg-overlay');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);
    expect(dialog).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    rerender(<ModalHarness />);
    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    dialog = await screen.findByRole('dialog', { name: 'Settings' });
    backdrop = dialog.querySelector('.bg-overlay');
    fireEvent.click(backdrop as Element);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes only the top layer when dialogs are nested', async () => {
    const user = userEvent.setup();

    function NestedHarness() {
      const [outerOpen, setOuterOpen] = useState(false);
      const [innerOpen, setInnerOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOuterOpen(true)}>Open outer</button>
          {outerOpen ? (
            <ModalOverlay onClose={() => setOuterOpen(false)}>
              <ModalPanel>
                <ModalHeader heading="Outer dialog" />
                <ModalBody>
                  <button type="button" onClick={() => setInnerOpen(true)}>Open inner</button>
                </ModalBody>
              </ModalPanel>
              {innerOpen ? (
                <ModalOverlay onClose={() => setInnerOpen(false)}>
                  <ModalPanel>
                    <ModalHeader heading="Inner dialog" />
                    <ModalBody><button type="button">Inner action</button></ModalBody>
                  </ModalPanel>
                </ModalOverlay>
              ) : null}
            </ModalOverlay>
          ) : null}
        </>
      );
    }

    render(<NestedHarness />);
    await user.click(screen.getByRole('button', { name: 'Open outer' }));
    await user.click(await screen.findByRole('button', { name: 'Open inner' }));
    expect(await screen.findByRole('dialog', { name: 'Inner dialog' })).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Inner dialog' })).not.toBeInTheDocument());
    expect(screen.getByRole('dialog', { name: 'Outer dialog' })).toBeVisible();
  });
});
