import type { Locator } from '@playwright/test';
import { expect, gotoComponents, test } from './fixtures';

async function primaryFieldMetrics(root: Locator) {
  return root.evaluate((element) => {
    const labels = element.querySelectorAll('label');
    const input = element.querySelector('input');
    const button = element.querySelector('button[id^="headlessui-listbox-button"]');
    const hint = element.querySelector('p');

    if (labels.length !== 2 || !input || !button || !hint) {
      throw new Error('Primary Field/Dropdown spacing specimen is incomplete.');
    }

    const fieldLabel = labels[0].getBoundingClientRect();
    const dropdownLabel = labels[1].getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const hintRect = hint.getBoundingClientRect();

    return {
      rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
      fieldLabelHeight: fieldLabel.height,
      dropdownLabelHeight: dropdownLabel.height,
      fieldLabelToInput: inputRect.top - fieldLabel.bottom,
      dropdownLabelToTrigger: buttonRect.top - dropdownLabel.bottom,
      inputToHint: hintRect.top - inputRect.bottom,
      inputTop: inputRect.top,
      dropdownTop: buttonRect.top,
      inputHeight: inputRect.height,
      dropdownHeight: buttonRect.height,
    };
  });
}

async function textareaMetrics(root: Locator) {
  return root.evaluate((element) => {
    const label = element.querySelector('label');
    const textarea = element.querySelector('textarea');
    const hint = element.querySelector('p');

    if (!label || !textarea || !hint) {
      throw new Error('TextArea spacing specimen is incomplete.');
    }

    const labelRect = label.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();
    const hintRect = hint.getBoundingClientRect();

    return {
      labelToTextarea: textareaRect.top - labelRect.bottom,
      textareaToHint: hintRect.top - textareaRect.bottom,
    };
  });
}

async function wrappedFieldMetrics(root: Locator) {
  return root.evaluate((element) => {
    const labels = element.querySelectorAll('label');
    const input = element.querySelector('input');
    const button = element.querySelector('button[id^="headlessui-listbox-button"]');

    if (labels.length !== 2 || !input || !button) {
      throw new Error('Wrapped-label spacing specimen is incomplete.');
    }

    const fieldLabel = labels[0].getBoundingClientRect();
    const dropdownLabel = labels[1].getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    return {
      fieldLabelHeight: fieldLabel.height,
      dropdownLabelHeight: dropdownLabel.height,
      inputTop: inputRect.top,
      dropdownTop: buttonRect.top,
    };
  });
}

async function horizontalOverflowDiagnostics(root: Locator) {
  return root.evaluate((element) => {
    const rootRect = element.getBoundingClientRect();
    const diagnostics = Array.from(element.querySelectorAll<HTMLElement>('*'))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName.toLowerCase(),
          id: node.id,
          className: node.getAttribute('class') ?? '',
          text: node.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
          left: rect.left,
          right: rect.right,
          excessLeft: Math.max(0, rootRect.left - rect.left),
          excessRight: Math.max(0, rect.right - rootRect.right),
          internalOverflow: Math.max(0, node.scrollWidth - node.clientWidth),
        };
      })
      .filter(
        ({ excessLeft, excessRight, internalOverflow }) =>
          excessLeft > 0.5 || excessRight > 0.5 || internalOverflow > 0,
      )
      .sort(
        (left, right) =>
          Math.max(right.excessLeft, right.excessRight, right.internalOverflow) -
          Math.max(left.excessLeft, left.excessRight, left.internalOverflow),
      )
      .slice(0, 12);

    return {
      overflow: element.scrollWidth - element.clientWidth,
      root: {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        left: rootRect.left,
        right: rootRect.right,
        width: rootRect.width,
      },
      diagnostics,
    };
  });
}

for (const theme of ['dark', 'light'] as const) {
  test(`keeps Field-family spacing and Dropdown alignment stable in the ${theme} theme`, async ({ page }, testInfo) => {
    await gotoComponents(page, theme);
    const demo = page.locator('[data-demo="form-controls"]');
    await demo.scrollIntoViewIfNeeded();

    const primary = demo.locator('[data-field-spacing-primary]');
    const primaryMetrics = await primaryFieldMetrics(primary);
    const expectedGap = primaryMetrics.rootFontSize * 0.5;

    expect(primaryMetrics.fieldLabelHeight).toBe(primaryMetrics.dropdownLabelHeight);
    expect(primaryMetrics.fieldLabelToInput).toBe(expectedGap);
    expect(primaryMetrics.dropdownLabelToTrigger).toBe(expectedGap);
    expect(primaryMetrics.inputToHint).toBe(expectedGap);
    expect(primaryMetrics.inputHeight).toBe(primaryMetrics.dropdownHeight);

    if (testInfo.project.name === 'desktop-chromium') {
      // Equal-height labels must put the two 46px-at-16px-root controls on the same row.
      expect(primaryMetrics.inputTop).toBe(primaryMetrics.dropdownTop);
    } else {
      expect(primaryMetrics.inputTop).toBeLessThan(primaryMetrics.dropdownTop);
    }

    const states = demo.locator('[data-field-spacing-states]');
    const textArea = states.locator('textarea');
    const textAreaGroup = textArea.locator('xpath=..');
    const textAreaSpacing = await textareaMetrics(textAreaGroup);
    expect(textAreaSpacing.labelToTextarea).toBe(expectedGap);
    expect(textAreaSpacing.textareaToHint).toBe(expectedGap);

    const noHintField = states.locator('[data-field-without-hint]');
    await expect(noHintField.locator('p')).toHaveCount(0);
    await expect(noHintField.locator('input')).toBeDisabled();

    const wrapped = demo.locator('[data-field-spacing-wrapped]');
    const wrappedMetrics = await wrappedFieldMetrics(wrapped);
    expect(wrappedMetrics.fieldLabelHeight).toBe(wrappedMetrics.dropdownLabelHeight);
    if (testInfo.project.name === 'desktop-chromium') {
      expect(wrappedMetrics.inputTop).toBe(wrappedMetrics.dropdownTop);
    }
    await expect(wrapped.locator('input')).toHaveAttribute('aria-invalid', 'true');
    await expect(wrapped.locator('input')).toHaveAccessibleDescription('Choose an owner before release.');
    await expect(wrapped.locator('button[id^="headlessui-listbox-button"]')).toBeDisabled();

    const overflow = await horizontalOverflowDiagnostics(demo);
    expect(overflow.overflow, JSON.stringify(overflow, null, 2)).toBeLessThanOrEqual(1);
  });
}

test('preserves wrapped-label alignment and reflow at 200% text zoom', async ({ page }, testInfo) => {
  await gotoComponents(page);
  await page.evaluate(() => {
    const currentSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize * 2}px`;
  });

  const demo = page.locator('[data-demo="form-controls"]');
  await demo.scrollIntoViewIfNeeded();
  const primaryMetrics = await primaryFieldMetrics(demo.locator('[data-field-spacing-primary]'));
  expect(primaryMetrics.fieldLabelToInput).toBe(primaryMetrics.rootFontSize * 0.5);
  expect(primaryMetrics.dropdownLabelToTrigger).toBe(primaryMetrics.rootFontSize * 0.5);

  const wrappedMetrics = await wrappedFieldMetrics(demo.locator('[data-field-spacing-wrapped]'));
  expect(wrappedMetrics.fieldLabelHeight).toBe(wrappedMetrics.dropdownLabelHeight);
  expect(wrappedMetrics.fieldLabelHeight).toBeGreaterThan(primaryMetrics.fieldLabelHeight);
  if (testInfo.project.name === 'desktop-chromium') {
    expect(primaryMetrics.inputTop - primaryMetrics.dropdownTop).toBe(
      primaryMetrics.fieldLabelHeight - primaryMetrics.dropdownLabelHeight
    );
    expect(wrappedMetrics.inputTop).toBe(wrappedMetrics.dropdownTop);
  }

  const overflow = await horizontalOverflowDiagnostics(demo);
  expect(overflow.overflow, JSON.stringify(overflow, null, 2)).toBeLessThanOrEqual(1);
});
