import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Tooltip from '../../src/components/Tooltip';

describe('Tooltip', () => {
  it('appears for keyboard focus and disappears on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Copies the share link" delay={0}>
          <button type="button">Copy link</button>
        </Tooltip>
        <button type="button">Next control</button>
      </>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Copies the share link');

    await user.tab();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });
});
