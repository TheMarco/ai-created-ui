import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  MotionConfig: ({
    children,
    reducedMotion,
  }: {
    children: ReactNode;
    reducedMotion: string;
  }) => <div data-testid="motion-config" data-reduced-motion={reducedMotion}>{children}</div>,
}));

import { ThemeProvider } from '../../src/components/ThemeProvider';

describe('reduced motion', () => {
  it('delegates motion preference to the user setting', () => {
    render(
      <ThemeProvider>
        <span>Content</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId('motion-config')).toHaveAttribute('data-reduced-motion', 'user');
  });
});
