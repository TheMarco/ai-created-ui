import { expect, test as base, type Page } from '@playwright/test';

type BrowserFixtures = {
  browserErrors: string[];
};

export const test = base.extend<BrowserFixtures>({
  browserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];

      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });

      await use(errors);
      expect(errors, 'The playground should not emit browser errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';

async function applyTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((initialTheme) => {
    localStorage.clear();
    localStorage.setItem('theme', initialTheme);
  }, theme);
}

/** The overview route. */
export async function gotoPlayground(page: Page, theme: 'dark' | 'light' = 'dark') {
  await applyTheme(page, theme);
  await page.goto('/');
  await page.locator('html[data-playground-hydrated="true"]').waitFor();
  await expect(page.getByRole('heading', { name: 'Design once. Build without drift.', level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

/** The canonical foundation reference: tokens, color, typography, spacing, motion, themes. */
export async function gotoFoundations(page: Page, theme: 'dark' | 'light' = 'dark') {
  await applyTheme(page, theme);
  await page.goto('/foundations');
  await expect(
    page.getByRole('heading', { name: 'The decisions every surface inherits.', level: 1 }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

/** The component directory and its live specimen overview. */
export async function gotoComponents(page: Page, theme: 'dark' | 'light' = 'dark') {
  await applyTheme(page, theme);
  await page.goto('/components');
  await expect(page.getByRole('heading', { name: 'Build from documented contracts.', level: 1 })).toBeVisible();
  await page.locator('[data-visual="component-directory"][data-hydrated="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

export async function stabilizeVisuals(page: Page) {
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 1ms !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
      [data-demo="semantic-feedback"] {
        box-sizing: border-box !important;
        min-height: 683px !important;
      }
    `,
  });
}
