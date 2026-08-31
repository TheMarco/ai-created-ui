import { expect, gotoPlayground, test } from './fixtures';
import type { Page } from '@playwright/test';
import { accentNames, type Accent } from '../src';

type Rgba = [number, number, number, number];

const tokenNames = [
  'bg',
  'surface',
  'surface2',
  'text',
  'control-border',
  'focus',
  'accent',
  'accent-muted',
  'accent-hover',
  'accent-border',
  'action-primary',
  'action-primary-hover',
  'action-destructive',
  'action-destructive-hover',
  'on-action',
  'selection',
  'success',
  'success-surface',
  'warning',
  'warning-surface',
  'info',
  'info-surface',
  'error',
  'error-surface',
] as const;

type TokenName = typeof tokenNames[number];

function composite(foreground: Rgba, background: Rgba): Rgba {
  const alpha = foreground[3] + background[3] * (1 - foreground[3]);
  return [
    (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) / alpha,
    (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) / alpha,
    (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) / alpha,
    alpha,
  ];
}

function luminance(color: Rgba) {
  const [red, green, blue] = color.slice(0, 3).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(first: Rgba, second: Rgba) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

async function computedTokens(page: Page, light: boolean, accent: Accent) {
  await page.locator('html').evaluate((element, appearance) => {
    const { accent: nextAccent, light: lightEnabled } = appearance;
    element.classList.toggle('light', lightEnabled);
    element.classList.remove('theme-transitioning');
    element.setAttribute('data-accent', nextAccent);
  }, { accent, light });

  const values = await page.evaluate((names) => {
    const probe = document.createElement('span');
    probe.style.position = 'fixed';
    probe.style.pointerEvents = 'none';
    document.body.append(probe);
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas color parser is unavailable.');

    const result = Object.fromEntries(names.map((name) => {
      probe.style.color = `var(--color-${name})`;
      const computed = getComputedStyle(probe).color;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = computed;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [name, [red, green, blue, alpha / 255]];
    }));

    probe.remove();
    return result;
  }, tokenNames);

  return values as Record<TokenName, Rgba>;
}

for (const mode of ['dark', 'light'] as const) {
  for (const accent of accentNames) {
    test(`${mode}/${accent} semantic colors meet their contrast contracts`, async ({ page }) => {
      await gotoPlayground(page);
      const colors = await computedTokens(page, mode === 'light', accent);
      const foundations = ['bg', 'surface', 'surface2'] as const;

      for (const foundation of foundations) {
        expect(
          contrast(colors.focus, colors[foundation]),
          `focus ring on ${foundation}`
        ).toBeGreaterThanOrEqual(3);

        for (const token of ['accent', 'accent-muted', 'accent-hover'] as const) {
          expect(
            contrast(colors[token], colors[foundation]),
            `${token} text on ${foundation}`
          ).toBeGreaterThanOrEqual(4.5);
        }

        const renderedAccentBorder = composite(colors['accent-border'], colors[foundation]);
        expect(
          contrast(renderedAccentBorder, colors[foundation]),
          `accent boundary against ${foundation}`
        ).toBeGreaterThanOrEqual(3);

        const renderedSelection = composite(colors.selection, colors[foundation]);
        expect(
          contrast(colors.text, renderedSelection),
          `selected text over ${foundation}`
        ).toBeGreaterThanOrEqual(4.5);

        for (const token of ['action-primary', 'action-primary-hover'] as const) {
          expect(
            contrast(colors[token], colors[foundation]),
            `${token} boundary against ${foundation}`
          ).toBeGreaterThanOrEqual(3);
        }
      }

      for (const status of ['success', 'warning', 'info', 'error'] as const) {
        for (const foundation of foundations) {
          const renderedSurface = composite(colors[`${status}-surface`], colors[foundation]);
          expect(
            contrast(colors[status], renderedSurface),
            `${status} text on its semantic surface over ${foundation}`
          ).toBeGreaterThanOrEqual(4.5);
        }
      }

      const renderedControlBorder = composite(colors['control-border'], colors.surface2);
      for (const foundation of ['bg', 'surface'] as const) {
        expect(
          contrast(renderedControlBorder, colors[foundation]),
          `control boundary against its surrounding ${foundation}`
        ).toBeGreaterThanOrEqual(3);
      }

      for (const token of [
        'action-primary',
        'action-primary-hover',
        'action-destructive',
        'action-destructive-hover',
      ] as const) {
        expect(
          contrast(colors['on-action'], colors[token]),
          `${token} foreground`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
}
