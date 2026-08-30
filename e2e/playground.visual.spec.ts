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

test.describe.serial('living specification visuals', () => {
  for (const theme of ['dark', 'light'] as const) {
    test(`captures the ${theme} living specification`, async ({ page }) => {
      await page.addInitScript((initialTheme) => {
        localStorage.clear();
        localStorage.setItem('theme', initialTheme);
      }, theme);

      await page.goto('/components');
      await expect(page.getByRole('heading', { level: 1, name: 'Build from documented contracts.' })).toBeVisible();
      await page.locator('[data-visual="component-directory"][data-hydrated="true"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await stabilizeVisuals(page);
      await page.waitForTimeout(150);
      await page.evaluate(() => window.scrollTo(0, 420));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(420);
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot(`component-directory-${theme}.png`, {
        animations: 'allow',
      });

      await page.goto('/components/button');
      await expect(page.getByRole('heading', { level: 1, name: 'Button / buttonStyles' })).toBeVisible();
      const workbench = page.locator('[data-workbench="button"]');
      await workbench.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await stabilizeVisuals(page);
      await workbench.scrollIntoViewIfNeeded();
      await page.addStyleTag({
        content: 'header { display: none !important; }',
      });
      await workbench.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await expect(workbench).toHaveScreenshot(`component-button-workbench-${theme}.png`, {
        animations: 'allow',
      });
    });
  }
});

test.describe.serial('principal specification visuals', () => {
  for (const theme of ['dark', 'light'] as const) {
    test(`captures the ${theme} principal specification`, async ({ page }) => {
      await page.addInitScript((initialTheme) => {
        localStorage.clear();
        localStorage.setItem('theme', initialTheme);
      }, theme);

      await page.goto('/guidelines');
      await expect(page.getByRole('heading', { level: 1, name: 'One system. Every decision.' })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await stabilizeVisuals(page);
      await expect(page).toHaveScreenshot(`guideline-directory-${theme}.png`);

      await page.goto('/guidelines/foundations');
      await expect(page.getByRole('heading', { level: 1, name: 'Foundations' })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await stabilizeVisuals(page);
      const tokenHierarchy = page
        .getByRole('heading', { name: 'Decision hierarchy' })
        .locator('../..');
      await tokenHierarchy.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      await expect(tokenHierarchy).toHaveScreenshot(`guideline-foundations-tokens-${theme}.png`, {
        maxDiffPixelRatio: 0.04,
      });
    });
  }
});

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

    if (contract === 'border-radius') {
      const box = await spacing.boundingBox();
      if (!box) throw new Error('The border-radius visual contract is not visible.');

      await expect(page).toHaveScreenshot(`${contract}-dark.png`, {
        clip: {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: 870,
          height: 151,
        },
      });
      continue;
    }

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
