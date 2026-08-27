import { expect, gotoPlayground, stabilizeVisuals, test } from './fixtures';

test.beforeEach(({ browserName }, testInfo) => {
  test.skip(
    browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium',
    'Visual baselines use desktop Chromium only.'
  );
});

for (const theme of ['dark', 'light'] as const) {
  test(`captures the ${theme} theme hero`, async ({ page }) => {
    await gotoPlayground(page, theme);
    await stabilizeVisuals(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page).toHaveScreenshot(`hero-${theme}.png`);
  });

  test(`captures ${theme} color and component contracts`, async ({ page }) => {
    await gotoPlayground(page, theme);
    await stabilizeVisuals(page);

    const colorComparison = page.locator('[data-visual="color-theme-comparison"]');
    await colorComparison.scrollIntoViewIfNeeded();
    await expect(colorComparison).toHaveScreenshot(`color-theme-comparison-${theme}.png`);

    for (const demoId of ['buttons-links', 'form-controls', 'semantic-feedback']) {
      const demo = page.locator(`[data-demo="${demoId}"]`);
      await demo.scrollIntoViewIfNeeded();
      await expect(demo).toHaveScreenshot(`${demoId}-${theme}.png`);
    }
  });
}

test('captures typography and spacing contracts', async ({ page }) => {
  await gotoPlayground(page);
  await stabilizeVisuals(page);

  for (const family of ['instrument-serif', 'space-grotesk']) {
    const typography = page.locator(`[data-visual="font-family-${family}"]`);
    await typography.scrollIntoViewIfNeeded();
    await expect(typography).toHaveScreenshot(`font-family-${family}-dark.png`, {
      maxDiffPixelRatio: 0.04,
    });
  }

  for (const contract of ['spacing-scale', 'border-radius']) {
    const spacing = page.locator(`[data-visual="${contract}"]`);
    await spacing.scrollIntoViewIfNeeded();
    await expect(spacing).toHaveScreenshot(`${contract}-dark.png`);
  }
});

test('captures open Dialog and Modal states', async ({ page }) => {
  await gotoPlayground(page);
  await stabilizeVisuals(page);

  const dialogDemo = page.locator('[data-demo="dialog"]');
  await dialogDemo.scrollIntoViewIfNeeded();
  await dialogDemo.getByRole('button', { name: 'Open Dialog' }).click();
  await expect(page).toHaveScreenshot('dialog-open-dark.png');
  await page.keyboard.press('Escape');

  const modalDemo = page.locator('[data-demo="modal"]');
  await modalDemo.scrollIntoViewIfNeeded();
  await modalDemo.getByRole('button', { name: 'Open Modal' }).click();
  await expect(page).toHaveScreenshot('modal-open-dark.png');
});
