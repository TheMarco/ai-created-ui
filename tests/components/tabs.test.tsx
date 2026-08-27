import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tabs from '../../src/components/Tabs';

function TabsHarness() {
  const [active, setActive] = useState('overview');
  return (
    <Tabs
      label="Project sections"
      active={active}
      onChange={setActive}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'activity', label: 'Activity' },
        { key: 'settings', label: 'Settings' },
      ]}
    />
  );
}

describe('Tabs', () => {
  it('activates a clicked tab and maintains roving tabindex', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const activity = screen.getByRole('tab', { name: 'Activity' });

    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(activity).toHaveAttribute('tabindex', '-1');

    await user.click(activity);
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(activity).toHaveAttribute('tabindex', '0');
    expect(overview).toHaveAttribute('tabindex', '-1');
  });

  it('supports arrow, Home, and End keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const activity = screen.getByRole('tab', { name: 'Activity' });
    const settings = screen.getByRole('tab', { name: 'Settings' });

    overview.focus();
    await user.keyboard('{ArrowRight}');
    expect(activity).toHaveFocus();
    expect(activity).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{End}');
    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(settings).toHaveFocus();
  });

  it('ignores navigation keys when no tabs are available', () => {
    const onChange = vi.fn();

    render(
      <Tabs
        label="Empty sections"
        active=""
        onChange={onChange}
        tabs={[]}
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Empty sections' });
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
