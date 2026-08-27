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

export async function gotoPlayground(page: Page, theme: 'dark' | 'light' = 'dark') {
  await page.addInitScript((initialTheme) => {
    localStorage.clear();
    localStorage.setItem('theme', initialTheme);
  }, theme);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Design System', level: 1 })).toBeVisible();
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
    `,
  });
}
