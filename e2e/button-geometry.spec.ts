import { buttonStyles } from '../src/components/Button';
import { expect, gotoComponents, test } from './fixtures';

const variants = ['primary', 'secondary', 'destructive', 'ghost', 'filter', 'filter-active', 'icon'] as const;
const sizes = ['inline', 'sm', 'md', 'lg', 'xl', 'icon'] as const;

async function mountButtons(page: Parameters<typeof gotoComponents>[0]) {
  const classes = Object.fromEntries(
    variants.flatMap((variant) =>
      sizes.map((size) => [`${variant}-${size}`, buttonStyles({ variant, size })]),
    ),
  );

  await page.evaluate((buttonClasses) => {
    const fixture = document.createElement('div');
    fixture.dataset.buttonGeometryFixture = 'true';
    fixture.style.cssText = 'display:grid; grid-template-columns:max-content; gap:8px; width:320px; align-items:start; justify-items:start;';
    fixture.innerHTML = Object.entries(buttonClasses)
      .map(
        ([key, className]) =>
          `<button class="${className}" data-button-key="${key}">${key.endsWith('-icon') ? '<span aria-hidden="true">◆</span>' : '<span aria-hidden="true">◆</span><span>Measure</span>'}</button>`,
      )
      .join('');
    const fullWidthContainer = document.createElement('div');
    fullWidthContainer.dataset.fullwidthContainer = 'true';
    fullWidthContainer.style.width = '320px';
    fullWidthContainer.innerHTML = `<button class="${buttonClasses['primary-md']}" data-fullwidth-button="true">Measure</button>`;
    fixture.append(fullWidthContainer);
    document.body.append(fixture);
  }, classes);
}

for (const theme of ['dark', 'light'] as const) {
  for (const rootSize of [16, 20] as const) {
    test(`keeps Button variants geometrically aligned in ${theme} at ${rootSize}px root`, async ({ page }) => {
      await gotoComponents(page, theme);
      await page.evaluate((size) => {
        document.documentElement.style.fontSize = `${size}px`;
      }, rootSize);
      await mountButtons(page);

      const metrics = await page.locator('[data-button-geometry-fixture] button').evaluateAll((buttons) =>
        buttons.map((button) => {
          const rect = button.getBoundingClientRect();
          return { key: button.dataset.buttonKey, width: rect.width, height: rect.height };
        }),
      );

      for (const size of sizes) {
        const group = metrics.filter(({ key }) => key?.endsWith(`-${size}`));
        expect(group).toHaveLength(7);
        const reference = group[0];
        expect(reference).toBeTruthy();
        for (const metric of group.slice(1)) {
          expect(metric.width).toBeCloseTo(reference.width, 1);
          expect(metric.height).toBeCloseTo(reference.height, 1);
        }

        const expectedHeight = size === 'inline'
          ? rootSize * 1.25 + 2
          : size === 'sm' || size === 'md'
            ? rootSize * 2.25 + 2
            : size === 'lg' || size === 'xl'
              ? rootSize * 2.75 + 2
              : rootSize * 2.75;
        expect(reference.height).toBeCloseTo(expectedHeight, 1);
      }

      const icon = metrics.find(({ key }) => key === 'icon-icon');
      expect(icon).toBeTruthy();
      expect(icon!.width).toBeCloseTo(icon!.height, 1);

      const fullWidth = page.locator('[data-fullwidth-button="true"]');
      await fullWidth.evaluate((element, className) => element.className = className, buttonStyles({ variant: 'primary', size: 'md', fullWidth: true }));
      expect(await fullWidth.evaluate((element) => element.getBoundingClientRect().width))
        .toBeCloseTo(320, 1);

      for (const variant of variants) {
        const button = page.locator(`[data-button-key="${variant}-md"]`);
        const dimensions = async () => button.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
        const before = await dimensions();
        await button.evaluate((element) => element.setAttribute('disabled', ''));
        expect(await dimensions()).toEqual(before);
        await button.evaluate((element) => element.removeAttribute('disabled'));
        await button.hover();
        expect(await dimensions()).toEqual(before);
        await button.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await expect(button).toBeFocused();
        expect(await button.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
        expect(await dimensions()).toEqual(before);
      }
    });
  }
}
