import { describe, expect, it } from 'vitest';
import { componentDocs } from '../../playground/src/components/design-system/componentDocs';

const expectedEntries = [
  'badge',
  'button',
  'checkbox',
  'cn',
  'confirm-dialog',
  'dialog',
  'dropdown',
  'empty-state',
  'error-report',
  'field',
  'modal',
  'motion-helpers',
  'notice',
  'radio-group',
  'skeleton',
  'slider',
  'surface',
  'tabs',
  'theme',
  'themed-hero-image',
  'toggle',
  'tooltip',
];

describe('playground component reference', () => {
  it('keeps one complete entry for every public component family and helper group', () => {
    const ids = componentDocs.map((entry) => entry.id).sort();

    expect(ids).toEqual(expectedEntries);
    expect(new Set(ids).size).toBe(ids.length);

    for (const entry of componentDocs) {
      expect(entry.purpose).not.toBe('');
      expect(entry.useWhen.length).toBeGreaterThan(0);
      expect(entry.avoidWhen.length).toBeGreaterThan(0);
      expect(entry.api.length).toBeGreaterThan(0);
      expect(entry.states.length).toBeGreaterThan(0);
      expect(entry.accessibility.length).toBeGreaterThan(0);
      expect(entry.composition.length).toBeGreaterThan(0);
      expect(entry.code).not.toBe('');
    }
  });
});
