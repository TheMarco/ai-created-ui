import { expect, gotoComponents, gotoFoundations, gotoPlayground, stabilizeVisuals, test } from './fixtures';

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

  test(`captures the ${theme} color contract`, async ({ page }) => {
    await gotoFoundations(page, theme);
    await stabilizeVisuals(page);

    const colorComparison = page.locator('[data-visual="color-theme-comparison"]');
    await colorComparison.scrollIntoViewIfNeeded();
    // Dense mono and body text in this specimen renders with measurably different
    // antialiasing on Linux CI than on macOS. The tolerance covers that variance only;
    // any color, geometry, or layout change still exceeds it.
    await expect(colorComparison).toHaveScreenshot(`color-theme-comparison-${theme}.png`, {
      maxDiffPixelRatio: 0.05,
    });
  });

  test(`captures ${theme} component contracts`, async ({ page }) => {
    await gotoComponents(page, theme);
    await stabilizeVisuals(page);

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

test.describe.serial('agents page visuals', () => {
  for (const theme of ['dark', 'light'] as const) {
    test(`captures the ${theme} agents page`, async ({ page }) => {
      await page.addInitScript((initialTheme) => {
        localStorage.clear();
        localStorage.setItem('theme', initialTheme);
      }, theme);

      await page.goto('/agents');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Design once. Agents build without drift.' })
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await stabilizeVisuals(page);
      await expect(page).toHaveScreenshot(`agents-hero-${theme}.png`);
    });
  }
});

test.describe.serial('foundations visuals', () => {
  for (const theme of ['dark', 'light'] as const) {
    test(`captures the ${theme} foundations entry`, async ({ page }) => {
      await gotoFoundations(page, theme);
      await stabilizeVisuals(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page).toHaveScreenshot(`foundations-${theme}.png`);
    });
  }
});

test('captures typography and spacing contracts', async ({ page }) => {
  await gotoFoundations(page);
  await stabilizeVisuals(page);

  for (const family of ['instrument-serif', 'space-grotesk']) {
    const typography = page.locator(`[data-visual="font-family-${family}"]`);
    await typography.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    const box = await typography.boundingBox();
    if (!box) throw new Error(`The ${family} visual contract is not visible.`);

    await expect(page).toHaveScreenshot(`font-family-${family}-dark.png`, {
      clip: {
        x: Math.floor(box.x),
        y: Math.floor(box.y),
        width: 870,
        height: family === 'instrument-serif' ? 397 : 437,
      },
      maxDiffPixelRatio: family === 'space-grotesk' ? 0.08 : 0.04,
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

test('captures the hero-to-overview section boundary', async ({ page }) => {
  await gotoPlayground(page);
  await stabilizeVisuals(page);
  const heroBounds = await page.locator('[data-visual="portal-hero"]').boundingBox();
  if (!heroBounds) throw new Error('The portal hero is not visible.');
  const scrollTarget = Math.round(heroBounds.y + heroBounds.height - 80);
  await page.evaluate((top) => window.scrollTo(0, top), scrollTarget);
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(scrollTarget);
  await expect(page).toHaveScreenshot('overview-section-boundary-dark.png');
});

test('captures open Dialog, Modal, and ConfirmDialog states', async ({ page }) => {
  await gotoComponents(page);
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
  await page.keyboard.press('Escape');

  const confirmDialogDemo = page.locator('[data-demo="confirm-dialog"]');
  await confirmDialogDemo.scrollIntoViewIfNeeded();
  await confirmDialogDemo.getByRole('button', { name: 'Open confirmation' }).click();
  await expect(page).toHaveScreenshot('confirm-dialog-open-dark.png');
});
