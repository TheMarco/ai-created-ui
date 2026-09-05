import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { rootFontSizeFromCss, squareClaims, squareSizesFromSource } from '../../scripts/lib/component-geometry.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const playgroundRequire = createRequire(path.join(root, 'playground/package.json'));
const resolveTailwindConfig = playgroundRequire('tailwindcss/resolveConfig');
const geometryContext = {
  spacing: resolveTailwindConfig(playgroundRequire('./tailwind.config.js')).theme.spacing,
  rootFontPx: rootFontSizeFromCss(readFileSync(path.join(root, 'playground/src/app/globals.css'), 'utf8')),
};

interface ManifestComponent {
  id: string;
  sourcePath?: string;
  anatomy?: Array<{ description?: string }>;
  visualSpec?: { measurements?: Array<{ property: string; value: string; notes?: string }> };
  construction?: { resizing?: { notes?: string[] } };
}

const manifest = JSON.parse(
  readFileSync(path.join(root, 'design-system.manifest.json'), 'utf8'),
) as { components: ManifestComponent[] };

describe('component API parity', () => {
  it('resolves rem and fractional spacing at the authored root while preserving literal pixels', () => {
    expect(geometryContext.rootFontPx).toBe(20);
    expect([...squareSizesFromSource('h-11 w-11 h-[44px] w-[44px] h-[0.6rem] w-[0.6rem] h-2.5 w-2.5', geometryContext)])
      .toEqual([55, 44, 12, 12.5]);
    expect([...squareSizesFromSource('h-11 w-11 h-[44px] w-[44px]', { ...geometryContext, rootFontPx: 16 })])
      .toEqual([44]);
    expect([...squareSizesFromSource('h-4 w-5', geometryContext)]).toEqual([]);
    expect(squareClaims('12.5 × 12.5px; 44px square; 20 × 30px')).toEqual([12.5, 44]);
  });

  it('resolves documented API rows, imports, and select controls against public TypeScript', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/verify-component-api-parity.mjs', '--json'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(JSON.parse(output)).toMatchObject({
      ok: true,
      components: 22,
      geometryReferenceRootPx: 20,
    });
  }, 15_000);

  it('states one icon-only square target for Button across playground reference rendering, source, specification, and construction', () => {
    const button = manifest.components.find((component) => component.id === 'button');
    expect(button).toBeDefined();

    const source = readFileSync(path.join(root, button!.sourcePath!), 'utf8');
    expect([...squareSizesFromSource(source, geometryContext)]).toEqual([55]);

    const target = button!.visualSpec?.measurements?.find(
      (measurement) => measurement.property === 'Icon-only target',
    );
    expect(target?.value).toBe('55 × 55px');
    expect(button!.construction?.resizing?.notes?.join(' ')).toContain('55px square');
    expect(button!.construction?.resizing?.notes?.join(' ')).not.toContain('36px square');
  });

  it('keeps every documented square control size equal to its playground reference rendering', () => {
    const mismatches: string[] = [];

    for (const component of manifest.components) {
      if (!component.sourcePath) continue;
      const sizes = squareSizesFromSource(readFileSync(path.join(root, component.sourcePath), 'utf8'), geometryContext);
      if (sizes.size === 0) continue;

      const documented = [
        ...(component.visualSpec?.measurements ?? []).map(
          (measurement) => `${measurement.property} ${measurement.value} ${measurement.notes ?? ''}`,
        ),
        ...(component.anatomy ?? []).map((part) => part.description ?? ''),
        ...(component.construction?.resizing?.notes ?? []),
      ].join('\n');

      for (const claim of new Set(squareClaims(documented))) {
        if (!sizes.has(claim)) mismatches.push(`${component.id}: documents ${claim}px, source declares ${[...sizes].join('/')}px`);
      }
    }

    expect(mismatches).toEqual([]);
  });
});
