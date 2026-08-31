import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Tooltip from '../../src/components/Tooltip';

afterEach(() => {
  vi.useRealTimers();
});

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

  it('dismisses an open tooltip with Escape without moving focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copies the share link" delay={0}>
        <button type="button">Copy link</button>
      </Tooltip>
    );

    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Copy link' });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('remains visible while the pointer moves from the trigger onto the tooltip', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Copies the share link" delay={0}>
        <button type="button">Copy link</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Copy link' });
    fireEvent.mouseEnter(trigger);
    act(() => vi.runOnlyPendingTimers());
    const tooltip = screen.getByRole('tooltip');

    fireEvent.mouseLeave(trigger, { relatedTarget: tooltip });
    fireEvent.mouseEnter(tooltip, { relatedTarget: trigger });
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(tooltip);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
