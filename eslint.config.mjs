import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      'coverage/**',
      'playwright-report/**',
    ],
  },
  {
    files: [
      'src/**/*.{ts,tsx}',
      'tests/**/*.{ts,tsx}',
      'e2e/**/*.{ts,tsx}',
      'playground/src/**/*.{ts,tsx}',
      'playwright.config.ts',
      'vitest.config.mts',
    ],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // TypeScript already provides the more accurate undefined-name check.
      'no-undef': 'off',
      // These mount-time state synchronizations are valid client hydration guards.
      'react-hooks/set-state-in-effect': 'off',
      // A horizontally scrollable region must be reachable by keyboard (WCAG 2.1.1).
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel', 'region'] }],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  }
);
