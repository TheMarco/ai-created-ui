import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '../..');

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

function squareSizesFromSource(source: string) {
  const sizes = new Set<number>();
  for (const match of source.matchAll(/\bh-(\d+)\s+w-\1(?![\w.-])/g)) sizes.add(Number(match[1]) * 4);
  for (const match of source.matchAll(/\bh-\[(\d+)px\]\s+w-\[\1px\]/g)) sizes.add(Number(match[1]));
  return sizes;
}

function squareClaims(text: string) {
  const claims: number[] = [];
  for (const match of text.matchAll(/(\d+)\s*(?:×|x)\s*(\d+)\s*px/gu)) {
    if (match[1] === match[2]) claims.push(Number(match[1]));
  }
  for (const match of text.matchAll(/(\d+)px\s+square/gu)) claims.push(Number(match[1]));
  return claims;
}

describe('component API parity', () => {
  it('resolves documented API rows, imports, and select controls against public TypeScript', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/verify-component-api-parity.mjs', '--json'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(JSON.parse(output)).toMatchObject({
      ok: true,
      components: 22,
    });
  }, 15_000);

  it('states one icon-only square target for Button across source, specification, and construction', () => {
    const button = manifest.components.find((component) => component.id === 'button');
    expect(button).toBeDefined();

    const source = readFileSync(path.join(root, button!.sourcePath!), 'utf8');
    expect([...squareSizesFromSource(source)]).toEqual([44]);

    const target = button!.visualSpec?.measurements?.find(
      (measurement) => measurement.property === 'Icon-only target',
    );
    expect(target?.value).toBe('44 × 44px');
    expect(button!.construction?.resizing?.notes?.join(' ')).toContain('44px square');
    expect(button!.construction?.resizing?.notes?.join(' ')).not.toContain('36px square');
  });

  it('keeps every documented square control size equal to its source-declared geometry', () => {
    const mismatches: string[] = [];

    for (const component of manifest.components) {
      if (!component.sourcePath) continue;
      const sizes = squareSizesFromSource(readFileSync(path.join(root, component.sourcePath), 'utf8'));
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
