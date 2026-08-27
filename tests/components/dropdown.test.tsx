import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Dropdown from '../../src/components/Dropdown';

function DropdownHarness({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState('alpha');
  return (
    <Dropdown
      label="Project"
      value={value}
      onChange={setValue}
      disabled={disabled}
      options={[
        { value: 'alpha', label: 'Alpha' },
        { value: 'beta', label: 'Beta' },
        { value: 'gamma', label: 'Gamma', disabled: true },
      ]}
    />
  );
}

describe('Dropdown', () => {
  it('selects an option through pointer interaction', async () => {
    const user = userEvent.setup();
    render(<DropdownHarness />);

    const trigger = screen.getByRole('button', { name: /Project/ });
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(trigger).toHaveTextContent('Beta');
  });

  it('opens and selects with the keyboard', async () => {
    const user = userEvent.setup();
    render(<DropdownHarness />);

    const trigger = screen.getByRole('button', { name: /Project/ });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeVisible();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(trigger).toHaveTextContent('Beta');
  });

  it('cannot open while disabled', async () => {
    const user = userEvent.setup();
    render(<DropdownHarness disabled />);

    const trigger = screen.getByRole('button', { name: /Project/ });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
