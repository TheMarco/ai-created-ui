import { describe, expect, it } from 'vitest';
import {
  getGuidelineSpec,
  guidelineSpecs,
} from '../../playground/src/components/design-system/principal-spec';

describe('principal design-system guidelines', () => {
  it('publishes the complete seven-part specification in a stable order', () => {
    expect(guidelineSpecs.map((spec) => spec.slug)).toEqual([
      'foundations',
      'construction',
      'patterns',
      'content',
      'accessibility',
      'governance',
      'assets',
    ]);
    expect(new Set(guidelineSpecs.map((spec) => spec.index)).size).toBe(7);
  });

  it('gives every guideline an operational owner and complete chapters', () => {
    for (const spec of guidelineSpecs) {
      expect(getGuidelineSpec(spec.slug)).toBe(spec);
      expect(spec.owner.trim()).not.toBe('');
      expect(spec.lastReviewed).toMatch(/2026/);
      expect(spec.reviewCycle.trim()).not.toBe('');
      expect(spec.sourceOfTruth.trim()).not.toBe('');
      expect(spec.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(spec.sections.length).toBeGreaterThanOrEqual(4);
      expect(new Set(spec.sections.map((section) => section.id)).size).toBe(spec.sections.length);

      for (const section of spec.sections) {
        expect(section.title.trim()).not.toBe('');
        expect(section.summary.trim()).not.toBe('');
        expect(section.blocks.length).toBeGreaterThan(0);
        for (const block of section.blocks) {
          expect(block.title.trim()).not.toBe('');
          if (block.type === 'table') {
            expect(block.columns.length).toBeGreaterThanOrEqual(2);
            expect(block.rows.length).toBeGreaterThan(0);
            for (const row of block.rows) expect(row).toHaveLength(block.columns.length);
          } else if (block.type === 'checklist') {
            expect(block.groups.every((group) => group.items.length > 0)).toBe(true);
          } else if (block.type === 'process') {
            expect(block.steps.every((step) => step.owner && step.output && step.gate)).toBe(true);
          } else if (block.type === 'code') {
            expect(block.code.trim()).not.toBe('');
          } else {
            expect(block.items.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('keeps visible guideline copy free from dash glyphs that break editorial consistency', () => {
    expect(JSON.stringify(guidelineSpecs)).not.toMatch(/[–—]/);
  });
});
