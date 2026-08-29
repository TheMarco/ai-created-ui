import { describe, expect, it } from 'vitest';
import {
  componentConstructionSpecs,
  componentSpecs,
  type DesignAssetKind,
  type DesignPropertyType,
  type GovernanceStatus,
} from '../../playground/src/components/design-system/specs';

const allowedKinds = new Set<DesignAssetKind>([
  'component',
  'provider',
  'utility',
  'helper',
]);
const allowedStatuses = new Set<GovernanceStatus>([
  'stable',
  'beta',
  'deprecated',
]);
const allowedPropertyTypes = new Set<DesignPropertyType>([
  'variant',
  'boolean',
  'text',
  'number',
  'instance-swap',
  'slot',
]);

describe('principal-level component construction specifications', () => {
  it('covers every public specification exactly once', () => {
    expect(Object.keys(componentConstructionSpecs)).toHaveLength(22);
    expect(Object.keys(componentConstructionSpecs).sort()).toEqual(
      componentSpecs.map((spec) => spec.id).sort()
    );
  });

  it('defines complete authoring and governance contracts', () => {
    for (const spec of componentSpecs) {
      const construction = spec.construction;

      expect(construction).toBe(componentConstructionSpecs[spec.id]);
      expect(allowedKinds.has(construction.asset.kind)).toBe(true);
      expect(construction.asset.localName.trim()).not.toBe('');
      expect(construction.asset.canvasApplicability.trim()).not.toBe('');
      expect(construction.exposedProperties.length).toBeGreaterThan(0);
      expect(construction.nestedAssets.length).toBeGreaterThan(0);
      expect(construction.contentLimits.length).toBeGreaterThan(0);
      expect(construction.localization.rtlBehavior.length).toBeGreaterThan(0);
      expect(construction.localization.stressCases.length).toBeGreaterThan(0);
      expect(construction.responsive.strategy.trim()).not.toBe('');
      expect(construction.responsive.breakpoints.length).toBeGreaterThan(0);
      expect(construction.responsive.behavior.length).toBeGreaterThan(0);
      expect(construction.limitations.figma.length).toBeGreaterThan(0);
      expect(construction.limitations.code.length).toBeGreaterThan(0);

      expect(allowedStatuses.has(construction.governance.status)).toBe(true);
      expect(construction.governance.ownerRole.trim()).not.toBe('');
      expect(construction.governance.lastReviewed).toBe('2026-08-29');
      expect(construction.governance.canonicalSource).toBe(spec.sourcePath);
      expect(construction.governance.changePolicy.length).toBeGreaterThanOrEqual(3);
      for (const policy of construction.governance.changePolicy) {
        expect(policy.trim()).not.toBe('');
      }

      for (const exposedProperty of construction.exposedProperties) {
        expect(allowedPropertyTypes.has(exposedProperty.type)).toBe(true);
        expect(exposedProperty.name.trim()).not.toBe('');
        expect(exposedProperty.label.trim()).not.toBe('');
        expect(exposedProperty.codeMapping.trim()).not.toBe('');
        if (exposedProperty.options && exposedProperty.defaultValue !== null) {
          expect(exposedProperty.options).toContain(String(exposedProperty.defaultValue));
        }
      }
    }
  });

  it('keeps canvas applicability and resizing internally consistent', () => {
    for (const construction of Object.values(componentConstructionSpecs)) {
      if (construction.asset.kind === 'component') {
        expect(construction.asset.figmaName?.trim()).not.toBe('');
      } else {
        expect(construction.asset.figmaName).toBeNull();
        expect(construction.limitations.notApplicable.length).toBeGreaterThan(0);
      }

      if (construction.autoLayout.applicable) {
        expect(construction.autoLayout.direction).not.toBe('none');
        expect(construction.autoLayout.gap).not.toMatch(/^Not applicable/i);
        expect(construction.autoLayout.padding).not.toMatch(/^Not applicable/i);
      } else {
        expect(construction.autoLayout.direction).toBe('none');
        expect(construction.autoLayout.gap).toMatch(/^Not applicable/i);
        expect(construction.autoLayout.padding).toMatch(/^Not applicable/i);
      }

      if (construction.resizing.applicable) {
        expect(construction.resizing.width).not.toBe('not-applicable');
        expect(construction.resizing.height).not.toBe('not-applicable');
        expect(construction.resizing.overflow).not.toBe('not-applicable');
        expect(construction.resizing.minWidth.trim()).not.toBe('');
        expect(construction.resizing.maxWidth.trim()).not.toBe('');
        expect(construction.resizing.minHeight.trim()).not.toBe('');
        expect(construction.resizing.maxHeight.trim()).not.toBe('');
      } else {
        expect(construction.resizing.width).toBe('not-applicable');
        expect(construction.resizing.height).toBe('not-applicable');
        expect(construction.resizing.overflow).toBe('not-applicable');
        expect(construction.resizing.minWidth).toMatch(/^Not applicable/i);
        expect(construction.resizing.maxWidth).toMatch(/^Not applicable/i);
      }
    }
  });
});
