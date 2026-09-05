import { expect, test } from './fixtures';

for (const control of [
  { path: 'checkbox', role: 'checkbox' as const },
  { path: 'radio-group', role: 'radio' as const },
  { path: 'toggle', role: 'switch' as const },
]) {
  test(`${control.path} shows keyboard focus on its visible indicator`, async ({ page }) => {
    await page.goto(`/components/${control.path}`);
    const input = page.getByRole(control.role).first();
    await input.focus();
    await expect(input).toBeFocused();

    const indicator = control.role === 'switch'
      ? input.locator(':scope > span[aria-hidden="true"]')
      : input.locator('..').locator(':scope > span[aria-hidden="true"]');
    await expect(indicator).toHaveCSS('outline-style', 'solid');
    await expect(indicator).toHaveCSS('outline-width', '2px');
    await expect(indicator).toHaveCSS('outline-offset', '3px');
    const focusColor = await input.evaluate((node) =>
      getComputedStyle(node).getPropertyValue('--color-focus').trim(),
    );
    const resolvedFocus = await input.evaluate((node, color) => {
      const probe = document.createElement('span');
      probe.style.color = color;
      node.parentElement!.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    }, focusColor);
    await expect(indicator).toHaveCSS('outline-color', resolvedFocus);
    if (control.role === 'switch') {
      await expect(input).toHaveCSS('outline-style', 'none');
    }
  });
}
