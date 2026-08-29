import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const templatesDirectory = path.join(packageRoot, 'templates/agent');
const manifest = JSON.parse(readFileSync(path.join(templatesDirectory, 'manifest.json'), 'utf8')) as {
  schemaVersion: string;
  package: string;
  templates: Array<{
    id: string;
    archetype: string;
    subtype: string;
    source: string;
    slots: string[];
    states: string[];
    imports: string[];
    requiredChecks: string[];
  }>;
};

describe('AI agent golden-path templates', () => {
  it('covers all requested page templates using canonical top-level archetypes', () => {
    expect(manifest.schemaVersion).toBe('1.0.0');
    expect(manifest.package).toBe('@ai-created/ui');
    expect(manifest.templates.map((template) => template.id)).toEqual([
      'directory',
      'detail',
      'form',
      'settings',
      'dashboard',
      'onboarding',
    ]);
    expect(manifest.templates.map(({ archetype, subtype }) => `${archetype}/${subtype}`)).toEqual([
      'browse/directory',
      'detail/record',
      'workspace/form',
      'workspace/settings',
      'workspace/dashboard',
      'workspace/onboarding',
    ]);
  });

  it('registers every template source with operational slots, states, and checks', () => {
    const sourceFiles = readdirSync(templatesDirectory)
      .filter((file) => file.endsWith('.tsx'))
      .map((file) => `templates/agent/${file}`)
      .sort();
    expect(manifest.templates.map((template) => template.source).sort()).toEqual(sourceFiles);

    for (const template of manifest.templates) {
      expect(template.slots.length).toBeGreaterThanOrEqual(3);
      expect(template.states).toContain('error');
      expect(template.states).toContain('forbidden');
      expect(template.imports.length).toBeGreaterThan(0);
      expect(template.requiredChecks).toContain('node scripts/verify-agent-templates.mjs');
      expect(template.requiredChecks).toContain('npm run typecheck');
      expect(template.requiredChecks).toContain('npm run lint');
    }
  });

  it('keeps templates on the public package boundary and semantic styling surface', () => {
    for (const template of manifest.templates) {
      const source = readFileSync(path.join(packageRoot, template.source), 'utf8');
      expect(source).not.toContain('@ai-created/ui/src');
      expect(source).not.toMatch(/from\s+['"]\.\.?\//);
      expect(source).not.toMatch(/#[\da-f]{3,8}\b/i);
      expect(source).not.toMatch(/\b(?:bg|border|text)-(?:black|white|slate|gray|zinc|neutral|stone|blue|green|purple|pink)-\d{2,3}\b/);
    }
  });

  it('compiles every template and the clean consumer fixture against the public contract', () => {
    const fixtureDirectory = path.join(packageRoot, 'tests/fixtures/agent-consumer');
    expect(existsSync(path.join(fixtureDirectory, 'package.fixture.json'))).toBe(true);
    expect(existsSync(path.join(fixtureDirectory, 'package.json'))).toBe(false);
    expect(() => execFileSync(process.execPath, ['scripts/verify-agent-templates.mjs'], {
      cwd: packageRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    })).not.toThrow();
  });
});
