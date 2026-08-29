import { describe, expect, it } from 'vitest';
import {
  componentSpecs,
  getComponentSpec,
  legacyComponentDocs,
} from '../../playground/src/components/design-system/specs';

describe('playground living component specifications', () => {
  it('keeps one detailed, addressable specification for every legacy reference entry', () => {
    const ids = componentSpecs.map((spec) => spec.id);
    const slugs = componentSpecs.map((spec) => spec.slug);

    expect(ids.sort()).toEqual(legacyComponentDocs.map((entry) => entry.id).sort());
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const spec of componentSpecs) {
      expect(getComponentSpec(spec.id)).toBe(spec);
      expect(getComponentSpec(spec.slug)).toBe(spec);
      expect(spec.summary).not.toBe('');
      expect(spec.sourcePath).toMatch(/^src\//);
      expect(spec.packageExports.length).toBeGreaterThan(0);
      expect(spec.anatomy.length).toBeGreaterThan(0);
      expect(spec.visualSpec.measurements.length).toBeGreaterThan(0);
      expect(spec.visualSpec.rules.length).toBeGreaterThan(0);
      expect(spec.designTokens.length).toBeGreaterThan(0);
      expect(spec.stateDefinitions.length).toBeGreaterThan(0);
      expect(spec.accessibilitySpec.semantics).not.toBe('');
      expect(spec.accessibilitySpec.requirements.length).toBeGreaterThan(0);
      expect(spec.implementation.importStatement).not.toBe('');
      expect(spec.implementation.notes.length).toBeGreaterThan(0);
      expect(Object.keys(spec.controls ?? {}).length).toBeGreaterThan(0);
      expect(spec.guidance.dos.length).toBeGreaterThan(0);
      expect(spec.guidance.donts.length).toBeGreaterThan(0);
      expect(spec.testing.unit.length).toBeGreaterThan(0);
      expect(spec.testing.accessibility.length).toBeGreaterThan(0);
      expect(spec.testing.visual.length).toBeGreaterThan(0);

      for (const relatedId of spec.relatedComponents) {
        expect(relatedId).not.toBe(spec.id);
        expect(getComponentSpec(relatedId)).toBeDefined();
      }
    }
  });
});
