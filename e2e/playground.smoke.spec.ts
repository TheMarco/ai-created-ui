import { expect, gotoPlayground, stabilizeVisuals, test } from './fixtures';
import type { Locator } from '@playwright/test';

async function center(locator: Locator) {
  await locator.evaluate((element: Element) => element.scrollIntoView({ block: 'center' }));
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
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(dialogTrigger).toBeFocused();

  const modalTrigger = page.locator('[data-demo="modal"]').getByRole('button', { name: 'Open Modal' });
  await modalTrigger.click();
  const modal = page.getByRole('dialog', { name: 'Create workspace' });
  await expect(modal.getByRole('heading', { name: 'Create workspace' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(modal).toHaveCount(0);

  const confirmDemo = page.locator('[data-demo="confirm-dialog"]');
  await confirmDemo.getByRole('button', { name: 'Open confirmation' }).click();
  const confirmDialog = page.getByRole('alertdialog', { name: 'Archive this project?' });
  await expect(confirmDialog.getByText('Archive this project?')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(confirmDemo.getByRole('status')).toContainText('Archive cancelled');

  const errorDemo = page.locator('[data-demo="error-report"]');
  const disclosure = errorDemo.getByRole('button', { name: 'Debug info', exact: true });
  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  await expect(errorDemo.getByText(/status 503/i)).toBeVisible();

  const tooltipTrigger = page.locator('[data-demo="tooltip"]').getByRole('button', { name: 'Top' });
  await tooltipTrigger.hover();
  await expect(page.getByRole('tooltip')).toHaveText('Tooltip on top');
});
