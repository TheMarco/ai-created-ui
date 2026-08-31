import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorReport from '../../src/components/ErrorReport';

describe('ErrorReport', () => {
  it('uses a non-submitting disclosure with explicit expanded state', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <ErrorReport message="Request failed" details="Status 500" />
      </form>
    );

    const disclosure = screen.getByRole('button', { name: 'Debug info' });
    expect(disclosure).toHaveAttribute('type', 'button');
    expect(disclosure).toHaveAttribute('aria-expanded', 'false');

    await user.click(disclosure);
    expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Details: Status 500/)).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('reports clipboard denial instead of creating an unhandled rejection', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<ErrorReport message="Request failed" details="Status 500" />);
    await user.click(screen.getByRole('button', { name: 'Debug info' }));
    await user.click(screen.getByRole('button', { name: 'Copy debug info' }));

    expect(writeText).toHaveBeenCalledOnce();
    expect(await screen.findByRole('button', { name: 'Copy failed' })).toBeVisible();
  });
});
