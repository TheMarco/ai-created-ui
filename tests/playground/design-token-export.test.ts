import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const cssPath = path.join(packageRoot, 'styles/tokens.css');
const artifactPath = path.join(
  packageRoot,
  'playground/public/design-system/tokens.json'
);
const extensionKey = 'org.ai-created.ui';

type JsonObject = Record<string, unknown>;

function objectAt(root: JsonObject, pathSegments: string[]) {
  return pathSegments.reduce<JsonObject>((value, segment) => {
    expect(value[segment]).toBeTypeOf('object');
    return value[segment] as JsonObject;
  }, root);
}

function collectTokens(value: unknown): JsonObject[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  const object = value as JsonObject;
  const ownToken = '$value' in object ? [object] : [];

  return [
    ...ownToken,
    ...Object.entries(object)
      .filter(([key]) => key === '$root' || !key.startsWith('$'))
      .flatMap(([, child]) => collectTokens(child)),
  ];
}

describe('design token export', () => {
  const css = readFileSync(cssPath, 'utf8');
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as JsonObject;

  it('is committed, current, and contains every default CSS custom property', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/export-design-tokens.mjs', '--check'], {
        cwd: packageRoot,
        stdio: 'pipe',
      })
    ).not.toThrow();

    const rootBlocks = [...css.matchAll(/(^|\n)\s*:root\s*\{([\s\S]*?)\}/g)];
    const defaultVariables = rootBlocks.flatMap((block) =>
      [...block[2].matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) => match[1])
    );
    const tokens = collectTokens(artifact);

    expect(tokens).toHaveLength(defaultVariables.length);
    expect(
      tokens.map(
        (token) =>
          (token.$extensions as JsonObject)[extensionKey] as JsonObject
      ).map((extension) => extension.cssVariable).sort()
    ).toEqual(defaultVariables.map((name) => `--${name}`).sort());
  });

  it('preserves aliases and explicit light-mode overrides', () => {
    const background = objectAt(artifact, ['color', 'bg']);
    const accent = objectAt(artifact, ['color', 'accent', '$root']);
    const red = objectAt(artifact, ['color', 'red', '$root']);
    const backgroundExtension = objectAt(background, ['$extensions', extensionKey]);

    expect(background.$type).toBe('color');
    expect(background.$value).toBe('{ref.neutral.950}');
    expect(objectAt(backgroundExtension, ['modeValues']).light).toBe(
      '{ref.warm.neutral.100}'
    );
    expect(accent.$value).toBe('{ref.red.500}');
    expect(red.$value).toBe('{color.accent.$root}');
    expect(objectAt(artifact, ['$extensions', extensionKey])).toMatchObject({
      defaultMode: 'dark',
      modes: {
        dark: { selector: ':root' },
        light: { selector: 'html.light' },
      },
    });
  });

  it('infers DTCG token types and structured scalar values', () => {
    expect(objectAt(artifact, ['ref', 'neutral', '50'])).toMatchObject({
      $type: 'color',
      $value: {
        colorSpace: 'srgb',
        alpha: 1,
      },
    });
    expect(objectAt(artifact, ['radius', 'sm'])).toMatchObject({
      $type: 'dimension',
      $value: { value: 4, unit: 'px' },
    });
    expect(objectAt(artifact, ['motion', 'fast'])).toMatchObject({
      $type: 'duration',
      $value: { value: 0.2, unit: 's' },
    });
    expect(objectAt(artifact, ['hero', 'image', 'light', 'opacity'])).toMatchObject({
      $type: 'number',
      $value: 0,
    });
  });
});
