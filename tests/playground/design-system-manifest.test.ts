import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const manifestPath = path.join(packageRoot, 'design-system.manifest.json');
const publicManifestPath = path.join(
  packageRoot,
  'playground/public/design-system/manifest.json',
);
const schemaPath = path.join(
  packageRoot,
  'contracts/design-system-manifest.schema.json',
);

type JsonObject = Record<string, unknown>;

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as JsonObject;
const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as JsonObject;

describe('machine-readable design-system manifest', () => {
  it('is deterministic, current, and copied unchanged to the public portal', () => {
    const repositoryMtime = statSync(manifestPath).mtimeMs;
    const publicMtime = statSync(publicManifestPath).mtimeMs;
    expect(() =>
      execFileSync(
        process.execPath,
        ['scripts/export-design-system-manifest.mjs', '--check'],
        { cwd: packageRoot, stdio: 'pipe' },
      ),
    ).not.toThrow();
    expect(statSync(manifestPath).mtimeMs).toBe(repositoryMtime);
    expect(statSync(publicManifestPath).mtimeMs).toBe(publicMtime);
    expect(readFileSync(publicManifestPath, 'utf8')).toBe(
      readFileSync(manifestPath, 'utf8'),
    );
    expect(readFileSync(manifestPath, 'utf8')).not.toMatch(/[–—]/);
  });

  it('publishes the versioned schema and complete registries', () => {
    expect(manifest.$schema).toBe('contracts/design-system-manifest.schema.json');
    expect(manifest.manifestVersion).toBe('1.0.0');
    expect(manifest.schemaVersion).toBe('1.0.0');
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect((schema.properties as JsonObject).manifestVersion).toEqual({
      const: '1.0.0',
    });

    const components = manifest.components as JsonObject[];
    const guidelines = manifest.guidelines as JsonObject[];
    expect(components).toHaveLength(22);
    expect(new Set(components.map(({ id }) => id)).size).toBe(22);
    expect(guidelines.map(({ slug }) => slug)).toEqual([
      'foundations',
      'construction',
      'patterns',
      'content',
      'accessibility',
      'governance',
      'assets',
    ]);

    for (const component of components) {
      const construction = component.construction as JsonObject;
      const governance = construction.governance as JsonObject;
      expect(construction).toHaveProperty('autoLayout');
      expect(construction).toHaveProperty('resizing');
      expect(construction).toHaveProperty('exposedProperties');
      expect(governance.ownerRole).toBeTypeOf('string');
      expect(governance.canonicalSource).toBe(component.sourcePath);
    }
  });

  it('resolves public exports, sources, token artifacts, and blocking commands', () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
    ) as JsonObject;
    expect((manifest.package as JsonObject).version).toBe(packageJson.version);

    const publicApi = manifest.publicApi as JsonObject;
    const publicExports = publicApi.exports as JsonObject[];
    expect(publicExports.length).toBeGreaterThan(80);
    expect(new Set(publicExports.map(({ name }) => name)).size).toBe(
      publicExports.length,
    );
    for (const exportedSymbol of publicExports) {
      expect(['type', 'value']).toContain(exportedSymbol.kind);
      expect(
        existsSync(path.join(packageRoot, String(exportedSymbol.sourcePath))),
      ).toBe(true);
    }

    const artifacts = manifest.artifacts as JsonObject;
    const manifestArtifact = artifacts.manifest as JsonObject;
    const tokens = artifacts.tokens as JsonObject;
    const agentContext = artifacts.agentContext as JsonObject;
    const templates = artifacts.templates as JsonObject;
    const policy = artifacts.policy as JsonObject;
    expect(manifestArtifact.derived).toBe(true);
    expect(manifestArtifact.authority).toMatch(/never overrides canonical sources/i);
    expect(tokens.sourcePath).toBe('styles/tokens.css');
    expect(
      existsSync(path.join(packageRoot, String(tokens.repositoryPath))),
    ).toBe(true);
    expect(Number(tokens.cssVariableCount)).toBeGreaterThan(50);
    expect(agentContext.derived).toBe(true);
    expect(agentContext.concisePublicPath).toBe('/llms.txt');
    expect(agentContext.fullPublicPath).toBe('/llms-full.txt');
    expect(templates.templateCount).toBe(6);
    expect(policy.validatorPath).toBe('scripts/validate-design-policy.mjs');

    const validation = manifest.validation as JsonObject;
    const commands = validation.commands as JsonObject[];
    expect(commands.some(({ id }) => id === 'manifest')).toBe(true);
    expect(commands.some(({ id }) => id === 'agent')).toBe(true);
    expect(commands.some(({ id }) => id === 'full')).toBe(true);
    expect(commands.every(({ blocking }) => blocking === true)).toBe(true);
  });

  it('declares an unambiguous canonical-source precedence', () => {
    const precedence = manifest.canonicalSourcePrecedence as JsonObject[];
    expect(precedence.map(({ rank }) => rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect((precedence[0].paths as string[])).toContain('src/**');
    expect((precedence[1].paths as string[])).toContain('styles/tokens.css');
    expect((precedence[3].paths as string[])).toContain(
      'playground/src/components/design-system/specs/registry.ts',
    );
    expect((precedence[4].paths as string[])).toContain(
      'playground/src/components/design-system/principal-spec/registry.ts',
    );
    expect((precedence[5].paths as string[])[0]).toBe('AGENTS.md');
  });
});
