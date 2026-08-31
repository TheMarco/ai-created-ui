'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MotionConfig } from 'framer-motion';

export type Theme = 'dark' | 'light';

export const accentNames = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow',
  'purple',
  'teal',
  'pink',
  'magenta',
] as const;

export type Accent = (typeof accentNames)[number];

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  accent?: Accent;
  defaultAccent?: Accent;
  onAccentChange?: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  accent: 'red',
  setAccent: () => {},
});

function isAccent(value: string | null | undefined): value is Accent {
  return accentNames.includes(value as Accent);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  accent: controlledAccent,
  defaultAccent = 'red',
  onAccentChange,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [uncontrolledAccent, setAccentState] = useState<Accent>(defaultAccent);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accent = controlledAccent ?? uncontrolledAccent;

  const startAppearanceTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      clearTimeout(transitionTimerRef.current);
    }

    document.documentElement.classList.add('theme-transitioning');
    transitionTimerRef.current = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      transitionTimerRef.current = null;
    }, 500);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const resolvedTheme = saved === 'dark' || saved === 'light'
      ? saved
      : document.documentElement.classList.contains('light')
        ? 'light'
        : 'dark';

    document.documentElement.classList.toggle('light', resolvedTheme === 'light');
    setTheme(resolvedTheme);

    return () => {
      if (transitionTimerRef.current !== null) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      document.documentElement.classList.remove('theme-transitioning');
    };
  }, []);

  useEffect(() => {
    if (controlledAccent !== undefined) {
      document.documentElement.dataset.accent = controlledAccent;
      return;
    }

    const savedAccent = localStorage.getItem('accent');
    const documentAccent = document.documentElement.dataset.accent;
    const resolvedAccent = isAccent(savedAccent)
      ? savedAccent
      : isAccent(documentAccent)
        ? documentAccent
        : defaultAccent;

    document.documentElement.dataset.accent = resolvedAccent;
    setAccentState(resolvedAccent);
  }, [controlledAccent, defaultAccent]);

  const toggleTheme = useCallback(() => {
    startAppearanceTransition();

    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('light', next === 'light');
      return next;
    });
  }, [startAppearanceTransition]);

  const setAccent = useCallback((nextAccent: Accent) => {
    if (controlledAccent !== undefined) {
      if (onAccentChange === undefined) return;
      startAppearanceTransition();
      onAccentChange(nextAccent);
      return;
    }

    startAppearanceTransition();
    localStorage.setItem('accent', nextAccent);
    document.documentElement.dataset.accent = nextAccent;
    setAccentState(nextAccent);
    onAccentChange?.(nextAccent);
  }, [controlledAccent, onAccentChange, startAppearanceTransition]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
}
