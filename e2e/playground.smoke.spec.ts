import { expect, gotoPlayground, stabilizeVisuals, test } from './fixtures';
import type { Locator } from '@playwright/test';

async function center(locator: Locator) {
  await locator.evaluate((element: Element) => element.scrollIntoView({ block: 'center' }));
}

async function expectCloseGlyphAlignedWithHeaderInset(dialog: Locator, headingName: string) {
  const closeButton = dialog.getByRole('button', { name: 'Close dialog' });
  const [headingBounds, iconBounds, panelBounds] = await Promise.all([
    dialog.getByRole('heading', { name: headingName }).boundingBox(),
    closeButton.locator('svg').boundingBox(),
    closeButton.locator('..').locator('..').boundingBox(),
  ]);

  expect(headingBounds).not.toBeNull();
  expect(iconBounds).not.toBeNull();
  expect(panelBounds).not.toBeNull();

  const headingInset = headingBounds!.x - panelBounds!.x;
  const closeGlyphInset = panelBounds!.x + panelBounds!.width - iconBounds!.x - iconBounds!.width;
  expect(Math.abs(headingInset - closeGlyphInset)).toBeLessThanOrEqual(1);
}

test('loads, switches theme, navigates sections, and shows focus', async ({ page }, testInfo) => {
  await gotoPlayground(page);
  await stabilizeVisuals(page);

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS('outline-style', 'solid');

  await expect(page.locator('html')).not.toHaveClass(/\blight\b/);
  const header = page.getByRole('banner');
  const themeToggle = header.getByRole('button', { name: 'Switch to light mode' });
  await themeToggle.click();
  await expect(page.locator('html')).toHaveClass(/\blight\b/);
  await expect(header.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();

  const navigationName = testInfo.project.name === 'mobile-chromium'
    ? 'Mobile section navigation'
    : 'Design system sections';
  const navigation = page.getByRole('navigation', { name: navigationName });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'Components', exact: true }).click();
  await expect(page.locator('#components')).toBeInViewport();

  await navigation.getByRole('link', { name: 'API Reference', exact: true }).click();
  await expect(page.locator('#reference')).toBeInViewport();
  const buttonReference = page.locator('[data-component-doc="button"]');
  await center(buttonReference);
  await buttonReference.locator('summary').click();
  await expect(buttonReference.getByRole('columnheader', { name: 'Prop' })).toBeVisible();
  await expect(buttonReference.getByRole('cell', { name: 'variant', exact: true })).toBeVisible();
});

test('switches and persists the accent scheme', async ({ page }) => {
  await page.goto('/');
  await page.locator('html[data-playground-hydrated="true"]').waitFor();
  await expect(page.getByRole('heading', { name: 'Design once. Build without drift.', level: 1 })).toBeVisible();

  const accentPicker = page.getByRole('banner').getByRole('button', { name: /Accent color/ });
  await expect(accentPicker).toContainText('Red');
  await accentPicker.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();

  const stacking = await listbox.evaluate((element) => {
    const header = document.querySelector('header');
    if (!(header instanceof HTMLElement)) {
      return { overlapHeight: 0, listboxIsOnTop: false };
    }

    const listboxBounds = element.getBoundingClientRect();
    const headerBounds = header.getBoundingClientRect();
    const overlapTop = Math.max(listboxBounds.top, headerBounds.top);
    const overlapBottom = Math.min(listboxBounds.bottom, headerBounds.bottom);
    const overlapHeight = Math.max(0, overlapBottom - overlapTop);
    const sampleX = listboxBounds.left + listboxBounds.width / 2;
    const sampleY = overlapTop + overlapHeight / 2;
    const topElement = document.elementFromPoint(sampleX, sampleY);

    return {
      overlapHeight,
      listboxIsOnTop: overlapHeight > 0 && topElement !== null && element.contains(topElement),
    };
  });

  expect(stacking.overlapHeight).toBeGreaterThan(0);
  expect(stacking.listboxIsOnTop).toBe(true);
  await page.getByRole('option', { name: 'Blue' }).click();
  await expect(accentPicker).toContainText('Blue');
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('accent'))).toBe('blue');
  await expect.poll(() => page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--color-accent)';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  })).toBe('rgb(38, 140, 254)');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');
  await expect(
    page.getByRole('banner').getByRole('button', { name: /Accent color/ })
  ).toContainText('Blue');
});

test('browses and inspects a detailed component specification', async ({ page }) => {
  await page.goto('/components');

  await expect(page.getByRole('heading', { level: 1, name: 'Build from documented contracts.' })).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Search components' });
  await search.fill('button focus');
  await expect(page.getByRole('status')).toContainText('1 of 22 match');

  const searchResults = page.getByRole('region', { name: 'Search results' });
  await expect(searchResults.getByRole('link')).toHaveCount(1);
  const buttonResult = searchResults.getByRole('link', { name: /Button \/ buttonStyles/ });
  await expect(buttonResult).toBeVisible();
  await expect(buttonResult).toBeInViewport();

  await Promise.all([
    page.waitForURL(/\/components\/button$/),
    buttonResult.click(),
  ]);
  await expect(page.getByRole('heading', { level: 1, name: 'Button / buttonStyles' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Component workbench' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Anatomy' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Construction and authoring' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Accessibility contract' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Implementation' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Testing contract' })).toBeVisible();

  const workbench = page.locator('[data-workbench="button"]');
  const previewTab = workbench.getByRole('tab', { name: 'Preview' });
  await previewTab.focus();
  await previewTab.press('ArrowRight');
  await expect(workbench.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
  await workbench.getByRole('tab', { name: 'Code' }).press('ArrowLeft');
  await expect(previewTab).toHaveAttribute('aria-selected', 'true');

  await workbench.getByLabel('Variant').selectOption('secondary');
  await workbench.getByLabel('Size').selectOption('lg');
  await workbench.getByLabel('Label').fill('Publish changes');
  await expect(workbench.getByRole('button', { name: 'Publish changes' })).toBeVisible();

  const compactCanvas = page.getByRole('button', { name: 'Compact' });
  await compactCanvas.click();
  await expect(compactCanvas).toHaveAttribute('aria-pressed', 'true');

  await workbench.getByRole('tab', { name: 'Code' }).click();
  const codePanel = workbench.getByRole('tabpanel', { name: 'Code' });
  await expect(codePanel).toContainText('secondary');
  await expect(codePanel).toContainText('lg');
  await expect(codePanel).toContainText('Publish changes');

  await workbench.getByRole('button', { name: 'Reset' }).click();
  await expect(workbench.getByLabel('Variant')).toHaveValue('primary');
  await expect(workbench.getByLabel('Size')).toHaveValue('md');
  await expect(workbench.getByLabel('Label')).toHaveValue('Save changes');

  await workbench.getByLabel('Variant').selectOption('secondary');
  await expect(page).toHaveURL(/\/components\/button\?arg\.variant=secondary$/);
  await page.reload();
  await expect(page.locator('[data-workbench="button"]').getByLabel('Variant')).toHaveValue('secondary');

  await page.locator('[data-workbench="button"]').getByRole('tab', { name: 'Setup' }).click();
  await expect(page.getByRole('heading', { name: 'Install from a reviewed release' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Load semantic tokens' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="api-heading"]').getByRole('cell', { name: 'variant', exact: true })).toBeVisible();

  const construction = page.locator('[data-component-construction="button"]');
  await expect(construction.getByText('Components/Actions/Button', { exact: true })).toBeVisible();
  await expect(construction.getByRole('heading', { name: 'Exposed design properties' })).toBeVisible();
  await expect(construction.getByText('Design systems action primitive owner', { exact: true })).toBeVisible();
});

test('browses the principal specification and its reusable assets', async ({ page }) => {
  await page.goto('/guidelines');
  await expect(page.getByRole('heading', { level: 1, name: 'One system. Every decision.' })).toBeVisible();

  const directory = page.locator('[data-visual="guideline-directory"]');
  await expect(directory.getByRole('link')).toHaveCount(7);
  await Promise.all([
    page.waitForURL(/\/guidelines\/foundations$/),
    directory.getByRole('link', { name: /Foundations/ }).click(),
  ]);
  await expect(page.getByRole('heading', { level: 1, name: 'Foundations' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Token architecture' })).toBeVisible();
  await expect(page.getByText('styles/tokens.css and tailwind-preset.js', { exact: true })).toBeVisible();

  await page.goto('/guidelines/governance');
  await expect(page.getByRole('heading', { level: 1, name: 'Governance and contribution' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Maturity and ownership' })).toBeVisible();

  await page.goto('/guidelines/assets');
  await expect(page.getByRole('heading', { level: 1, name: 'Assets and distribution' })).toBeVisible();
  const tokenDownload = page.getByRole('link', { name: /Design tokens JSON/ });
  await expect(tokenDownload).toHaveAttribute('href', '/design-system/tokens.json');
  const tokenResponse = await page.request.get('/design-system/tokens.json');
  expect(tokenResponse.ok()).toBe(true);
  const tokenArtifact = await tokenResponse.json();
  expect(tokenArtifact).toHaveProperty('$extensions');
});

test('exercises the major form, selection, overlay, and disclosure flows', async ({ page }) => {
  await gotoPlayground(page);
  await stabilizeVisuals(page);
  await page.locator('#components').scrollIntoViewIfNeeded();

  const tabsDemo = page.locator('[data-demo="tabs"]');
  const overviewTab = tabsDemo.getByRole('tab', { name: 'Overview' });
  const detailsTab = tabsDemo.getByRole('tab', { name: 'Details' });
  await overviewTab.focus();
  await overviewTab.press('ArrowRight');
  await expect(detailsTab).toBeFocused();
  await expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  await expect(tabsDemo.getByRole('tabpanel', { name: 'Details' })).toContainText('Details panel content');

  const checkbox = page.locator('[data-demo="checkbox"]').getByRole('checkbox', { name: 'Unchecked by default' });
  await center(checkbox);
  await page.locator('[data-demo="checkbox"]').getByText('Unchecked by default', { exact: true }).click();
  await expect(checkbox).toBeChecked();

  const dropdownDemo = page.locator('[data-demo="dropdown"]');
  const dropdown = dropdownDemo.getByRole('button', { name: /Framework/ });
  await dropdown.click();
  await page.getByRole('option', { name: 'React' }).click();
  await expect(dropdown).toContainText('React');

  const categoryGroup = page.locator('[data-demo="radio-group"]').getByRole('radiogroup', { name: 'Category' });
  const appsRadio = categoryGroup.getByRole('radio', { name: 'Apps' });
  await center(appsRadio);
  await categoryGroup.getByText('Apps', { exact: true }).click();
  await expect(appsRadio).toBeChecked();

  const slider = page.locator('[data-demo="slider"]').getByRole('slider', { name: 'Volume' });
  const initialSliderValue = Number(await slider.getAttribute('aria-valuenow'));
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', String(initialSliderValue + 1));

  const toggle = page.locator('[data-demo="toggle"]').getByRole('switch', { name: 'Dark mode' });
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');

  const dialogTrigger = page.locator('[data-demo="dialog"]').getByRole('button', { name: 'Open Dialog' });
  await dialogTrigger.click();
  const dialog = page.getByRole('dialog', { name: 'Confirm action' });
  await expect(dialog.getByText('Confirm action')).toBeVisible();
  await expectCloseGlyphAlignedWithHeaderInset(dialog, 'Confirm action');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(dialogTrigger).toBeFocused();

  const modalTrigger = page.locator('[data-demo="modal"]').getByRole('button', { name: 'Open Modal' });
  await modalTrigger.click();
  const modal = page.getByRole('dialog', { name: 'Create workspace' });
  await expect(modal.getByRole('heading', { name: 'Create workspace' })).toBeVisible();
  await expectCloseGlyphAlignedWithHeaderInset(modal, 'Create workspace');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(modal).toHaveCount(0);

  const confirmDemo = page.locator('[data-demo="confirm-dialog"]');
  await confirmDemo.getByRole('button', { name: 'Open confirmation' }).click();
  const confirmDialog = page.getByRole('alertdialog', { name: 'Archive this project?' });
  await expect(confirmDialog.getByText('Archive this project?')).toBeVisible();
  await expectCloseGlyphAlignedWithHeaderInset(confirmDialog, 'Archive this project?');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(confirmDemo.getByRole('status')).toContainText('Archive cancelled');

  const errorDemo = page.locator('[data-demo="error-report"]');
  const disclosure = errorDemo.getByRole('button', { name: 'Debug info', exact: true });
  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  await expect(errorDemo.getByText(/status 503/i)).toBeVisible();

  const tooltipTrigger = page.locator('[data-demo="tooltip"]').getByRole('button', { name: 'Top' });
  await tooltipTrigger.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toHaveText('Tooltip on top');
  await expect(tooltip).toHaveCSS('position', 'fixed');
  await tooltip.hover();
  await page.waitForTimeout(150);
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
});
