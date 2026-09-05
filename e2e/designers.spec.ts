import { expect, stabilizeVisuals, test } from './fixtures';

const communityUrl = 'https://www.figma.com/community/file/1677871391096215128';

test('takes designers from the overview to the public kit and first-mockup guide', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /^Designer Editable Figma components/ }).click();
  await expect(page).toHaveURL(/\/designers$/);
  await expect(page.getByRole('heading', { level: 1, name: 'The whole system. In Figma.' })).toBeVisible();
  const kitLinks = page.getByRole('link', { name: 'Open in Figma', exact: true });
  await expect(kitLinks).toHaveCount(2);
  for (const link of await kitLinks.all()) await expect(link).toHaveAttribute('href', communityUrl);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ui.ai-created.com/designers');
  await page.getByRole('link', { name: 'Make your first mockup' }).click();
  await expect(page).toHaveURL(/#first-mockup$/);
  await expect(page.getByRole('heading', { name: 'Your first mockup.', exact: true })).toBeVisible();
  await expect(page.getByText('It does not receive future updates automatically', { exact: false })).toBeVisible();
});

test('switches complete Figma previews with the documented keyboard tab model', async ({ page }) => {
  await page.goto('/designers');
  const dark = page.getByRole('tab', { name: 'Dark', exact: true });
  const light = page.getByRole('tab', { name: 'Light', exact: true });
  await expect(dark).toHaveAttribute('aria-selected', 'true');
  await dark.focus();
  await page.keyboard.press('ArrowRight');
  await expect(light).toBeFocused();
  await expect(light).toHaveAttribute('aria-selected', 'true');
  const lightPanel = page.getByRole('tabpanel', { name: 'Light', exact: true });
  await expect(lightPanel).toBeVisible();
  await expect.poll(() => lightPanel.getByRole('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(lightPanel.getByRole('img')).toHaveAttribute('width', '1440');
  await expect(page.locator('#figma-theme-preview-panel-dark')).toBeHidden();
  await page.keyboard.press('Home');
  await expect(dark).toBeFocused();
  await expect.poll(() => page.getByRole('tabpanel', { name: 'Dark', exact: true }).getByRole('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('#figma-theme-preview-panel-light')).toBeHidden();
});

test('keeps designer content and actions usable at narrow widths and 200% text zoom', async ({ page }) => {
  for (const [width, rootSize] of [[320, 20], [390, 20], [768, 20], [1024, 20], [640, 40]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/designers');
    await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px`; }, rootSize);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `Horizontal page overflow at ${width}px / ${rootSize}px root`).toBeLessThanOrEqual(1);
    if (width >= 768 && rootSize === 20) {
      const header = page.getByRole('banner');
      const themeControl = await header.getByRole('button', { name: /Switch to (light|dark) mode/ }).boundingBox();
      expect(themeControl!.x + themeControl!.width, 'Theme control remains onscreen at tablet widths').toBeLessThanOrEqual(width);
      const headerBounds = await header.boundingBox();
      const headingBounds = await page.getByRole('heading', { level: 1 }).boundingBox();
      expect(headingBounds!.y, 'Two-row header does not overlap page content').toBeGreaterThan(headerBounds!.height);
    }
    const tabs = page.getByRole('tablist', { name: 'Figma preview theme' });
    await tabs.scrollIntoViewIfNeeded();
    const bounds = await tabs.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await page.getByRole('tab', { name: 'Light', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Light', exact: true })).toBeVisible();
  }
});

for (const theme of ['dark', 'light'] as const) {
  test(`captures the ${theme} designer entry`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'Visual baselines use desktop Chromium.');
    await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
    await page.goto('/designers');
    await page.evaluate(() => document.fonts.ready);
    await stabilizeVisuals(page);
    await expect(page.locator('[data-visual="designers-hero"]')).toHaveScreenshot(`designers-hero-${theme}.png`);
  });
}
