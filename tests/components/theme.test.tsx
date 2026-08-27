import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '../../src/components/ThemeProvider';
import ThemeToggle from '../../src/components/ThemeToggle';

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" onClick={toggleTheme}>Current theme: {theme}</button>;
}

describe('ThemeProvider', () => {
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

  it('persists user-initiated changes', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);

    await user.click(screen.getByRole('button', { name: 'Current theme: dark' }));
    expect(screen.getByRole('button', { name: 'Current theme: light' })).toBeVisible();
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement).toHaveClass('light', 'theme-transitioning');
  });
});
