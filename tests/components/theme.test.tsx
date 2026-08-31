import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { accentNames, ThemeProvider, useTheme } from '../../src/components/ThemeProvider';
import ThemeToggle from '../../src/components/ThemeToggle';

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" onClick={toggleTheme}>Current theme: {theme}</button>;
}

function AccentConsumer() {
  const { accent, setAccent } = useTheme();

  return (
    <div>
      <span>Current accent: {accent}</span>
      <button type="button" onClick={() => setAccent('blue')}>Use blue accent</button>
      <button type="button" onClick={() => setAccent('teal')}>Use teal accent</button>
    </div>
  );
}

afterEach(() => {
  vi.useRealTimers();
  delete document.documentElement.dataset.accent;
});

describe('ThemeProvider', () => {
  it('exposes the supported accents in their canonical order', () => {
    expect(accentNames).toEqual([
      'red',
      'green',
      'blue',
      'orange',
      'yellow',
      'purple',
      'teal',
      'pink',
      'magenta',
    ]);
  });

  it('renders the theme switch as a visible control at rest', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveClass(
      'h-11',
      'w-11',
      'border-control-border',
      'bg-surface',
      'text-text',
    );
  });

  it('synchronizes saved theme state with the document', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    });
    expect(document.documentElement).toHaveClass('light');
  });

  it('uses an existing pre-hydration class when no saved preference exists', async () => {
    document.documentElement.classList.add('light');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Current theme: light' })).toBeVisible();
    });
  });

  it('uses red by default and writes the current accent to the document', async () => {
    render(<ThemeProvider><AccentConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByText('Current accent: red')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'red');
    });
  });

  it('supports a custom default accent', async () => {
    render(<ThemeProvider defaultAccent="purple"><AccentConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByText('Current accent: purple')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'purple');
    });
  });

  it('prefers a saved accent over the document attribute and default', async () => {
    localStorage.setItem('accent', 'green');
    document.documentElement.dataset.accent = 'orange';

    render(<ThemeProvider defaultAccent="blue"><AccentConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByText('Current accent: green')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'green');
    });
  });

  it('uses a controlled accent instead of saved, document, or default values', async () => {
    localStorage.setItem('accent', 'green');
    document.documentElement.dataset.accent = 'orange';

    render(
      <ThemeProvider accent="blue" defaultAccent="purple">
        <AccentConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Current accent: blue')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'blue');
    });
    expect(localStorage.getItem('accent')).toBe('green');
  });

  it('keeps a fixed controlled accent unchanged when setAccent is called', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider accent="purple">
        <AccentConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Use blue accent' }));

    expect(screen.getByText('Current accent: purple')).toBeVisible();
    expect(document.documentElement).toHaveAttribute('data-accent', 'purple');
    expect(localStorage.getItem('accent')).toBeNull();
    expect(document.documentElement).not.toHaveClass('theme-transitioning');
  });

  it('reports controlled accent changes without taking ownership or persisting them', async () => {
    const user = userEvent.setup();
    const onAccentChange = vi.fn();
    const { rerender } = render(
      <ThemeProvider accent="purple" onAccentChange={onAccentChange}>
        <AccentConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Use blue accent' }));

    expect(onAccentChange).toHaveBeenCalledWith('blue');
    expect(screen.getByText('Current accent: purple')).toBeVisible();
    expect(document.documentElement).toHaveAttribute('data-accent', 'purple');
    expect(localStorage.getItem('accent')).toBeNull();

    rerender(
      <ThemeProvider accent="blue" onAccentChange={onAccentChange}>
        <AccentConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Current accent: blue')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'blue');
    });
  });

  it('uses a valid document accent when the saved value is invalid', async () => {
    localStorage.setItem('accent', 'chartreuse');
    document.documentElement.dataset.accent = 'teal';

    render(<ThemeProvider defaultAccent="red"><AccentConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByText('Current accent: teal')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'teal');
    });
  });

  it('uses the default accent when saved and document values are invalid', async () => {
    localStorage.setItem('accent', 'chartreuse');
    document.documentElement.dataset.accent = 'ultraviolet';

    render(<ThemeProvider defaultAccent="yellow"><AccentConsumer /></ThemeProvider>);

    await waitFor(() => {
      expect(screen.getByText('Current accent: yellow')).toBeVisible();
      expect(document.documentElement).toHaveAttribute('data-accent', 'yellow');
    });
  });

  it('sets and persists a user-selected accent', async () => {
    const user = userEvent.setup();
    const onAccentChange = vi.fn();
    render(
      <ThemeProvider onAccentChange={onAccentChange}>
        <AccentConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Use blue accent' }));

    expect(onAccentChange).toHaveBeenCalledWith('blue');
    expect(screen.getByText('Current accent: blue')).toBeVisible();
    expect(localStorage.getItem('accent')).toBe('blue');
    expect(document.documentElement).toHaveAttribute('data-accent', 'blue');
    expect(document.documentElement).toHaveClass('theme-transitioning');
  });

  it('persists user-initiated changes', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    await user.click(screen.getByRole('button', { name: 'Current theme: dark' }));
    expect(screen.getByRole('button', { name: 'Current theme: light' })).toBeVisible();
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement).toHaveClass('light', 'theme-transitioning');
  });

  it('removes the transition class 500ms after a user toggle', () => {
    vi.useFakeTimers();
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Current theme: dark' }));
    expect(document.documentElement).toHaveClass('theme-transitioning');

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(document.documentElement).toHaveClass('theme-transitioning');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.documentElement).not.toHaveClass('theme-transitioning');
  });

  it('restarts the transition timer when the theme is toggled again', () => {
    vi.useFakeTimers();
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Current theme: dark' }));
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Current theme: light' }));

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(document.documentElement).toHaveClass('theme-transitioning');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.documentElement).not.toHaveClass('theme-transitioning');
  });

  it('uses and restarts the appearance transition for accent changes', () => {
    vi.useFakeTimers();
    render(<ThemeProvider><AccentConsumer /></ThemeProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Use blue accent' }));
    expect(document.documentElement).toHaveClass('theme-transitioning');

    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Use teal accent' }));

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(document.documentElement).toHaveClass('theme-transitioning');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.documentElement).not.toHaveClass('theme-transitioning');
  });

  it('clears the transition class when the provider unmounts', () => {
    vi.useFakeTimers();
    const { unmount } = render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Current theme: dark' }));
    expect(document.documentElement).toHaveClass('theme-transitioning');

    unmount();
    expect(document.documentElement).not.toHaveClass('theme-transitioning');

    act(() => {
      vi.runAllTimers();
    });
    expect(document.documentElement).not.toHaveClass('theme-transitioning');
  });
});
