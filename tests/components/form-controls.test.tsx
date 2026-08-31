import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button, { buttonStyles } from '../../src/components/Button';
import Checkbox from '../../src/components/Checkbox';
import RadioGroup from '../../src/components/RadioGroup';
import Slider from '../../src/components/Slider';
import Toggle from '../../src/components/Toggle';

describe('Button', () => {
  it('preserves native button behavior and forwards its ref', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <Button ref={ref} onClick={onClick}>
        Save changes
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(button);

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not respond when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save changes</Button>);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('allows consumers to opt into native submit behavior', () => {
    render(<Button type="submit">Create project</Button>);
    expect(screen.getByRole('button', { name: 'Create project' })).toHaveAttribute('type', 'submit');
  });

  it('keeps primary and destructive actions on distinct semantic treatments', () => {
    expect(buttonStyles({ variant: 'primary' })).toContain('bg-action-primary');
    expect(buttonStyles({ variant: 'destructive' })).toContain('bg-action-destructive');
    expect(buttonStyles({ variant: 'primary' })).not.toBe(buttonStyles({ variant: 'destructive' }));
    expect(buttonStyles({ variant: 'icon', size: 'icon' })).toContain('h-11');
  });
});

describe('Checkbox', () => {
  it('reports its next checked state through the native input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Email updates" />);

    await user.click(screen.getByRole('checkbox', { name: 'Email updates' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not change when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Email updates" disabled />);

    await user.click(screen.getByRole('checkbox', { name: 'Email updates' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Toggle', () => {
  it('exposes switch semantics and toggles with the keyboard', async () => {
    const user = userEvent.setup();

    function ToggleHarness() {
      const [checked, setChecked] = useState(false);
      return <Toggle checked={checked} onChange={setChecked} label="Public profile" />;
    }

    render(<ToggleHarness />);
    const toggle = screen.getByRole('switch', { name: 'Public profile' });

    expect(toggle).toHaveAttribute('aria-checked', 'false');
    toggle.focus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByText('Public profile'));
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('forwards its button ref and respects disabled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <Toggle
        ref={ref}
        checked={false}
        onChange={onChange}
        label="Public profile"
        disabled
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Public profile' });
    expect(ref.current).toBe(toggle);
    await user.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  it('updates selection and respects disabled options', async () => {
    const user = userEvent.setup();

    function RadioHarness() {
      const [value, setValue] = useState('daily');
      return (
        <RadioGroup
          legend="Digest frequency"
          value={value}
          onChange={setValue}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'never', label: 'Never', disabled: true },
          ]}
        />
      );
    }

    render(<RadioHarness />);
    const weekly = screen.getByRole('radio', { name: 'Weekly' });
    const never = screen.getByRole('radio', { name: 'Never' });

    await user.click(weekly);
    expect(weekly).toBeChecked();
    expect(never).toBeDisabled();
  });
});

describe('Slider', () => {
  it('keeps native range semantics and formats its value', () => {
    const onChange = vi.fn();
    render(
      <Slider
        label="Confidence"
        value={40}
        min={0}
        max={100}
        onChange={onChange}
        formatValue={(value) => `${value}%`}
      />
    );

    const slider = screen.getByRole('slider', { name: 'Confidence' });
    expect(slider).toHaveAttribute('aria-valuetext', '40%');

    fireEvent.change(slider, { target: { value: '65' } });
    expect(onChange).toHaveBeenCalledWith(65);
  });

  it('keeps its progress style finite for a zero-width range', () => {
    render(<Slider label="Fixed value" value={5} min={5} max={5} onChange={vi.fn()} />);

    const slider = screen.getByRole('slider', { name: 'Fixed value' });
    expect(slider.style.getPropertyValue('--slider-progress')).toBe('0%');
  });
});
