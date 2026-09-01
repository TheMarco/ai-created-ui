import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');

function runAgent(...args: string[]) {
  return JSON.parse(execFileSync(process.execPath, ['scripts/design-system-agent.mjs', ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
  })) as Record<string, unknown>;
}

describe('AI agent context and query interface', () => {
  it('keeps one universal narrative contract without a competing legacy file', () => {
    expect(readFileSync(path.join(packageRoot, 'CLAUDE.md'), 'utf8')).toBe('@AGENTS.md\n');
    const contract = readFileSync(path.join(packageRoot, 'AGENTS.md'), 'utf8');
    expect(contract).toContain('Do not infer props, variants, token names, or component behavior from model memory.');
    expect(contract).toContain('npm run agent:check');
  });

  it('keeps generated context current without writing during checks', () => {
    const files = ['llms.txt', 'llms-full.txt', 'playground/public/llms.txt', 'playground/public/llms-full.txt'];
    const before = files.map((file) => statSync(path.join(packageRoot, file)).mtimeMs);
    expect(() => execFileSync(process.execPath, ['scripts/export-agent-context.mjs', '--check'], {
      cwd: packageRoot,
      stdio: 'pipe',
    })).not.toThrow();
    expect(files.map((file) => statSync(path.join(packageRoot, file)).mtimeMs)).toEqual(before);
    expect(readFileSync(path.join(packageRoot, 'llms.txt'), 'utf8')).toBe(
      readFileSync(path.join(packageRoot, 'playground/public/llms.txt'), 'utf8'),
    );
    expect(readFileSync(path.join(packageRoot, 'llms-full.txt'), 'utf8')).toBe(
      readFileSync(path.join(packageRoot, 'playground/public/llms-full.txt'), 'utf8'),
    );
  });

  it('publishes the complete downstream consumer lifecycle for machines', () => {
    for (const file of ['llms.txt', 'llms-full.txt']) {
      const context = readFileSync(path.join(packageRoot, file), 'utf8');
      for (const requiredText of [
        '## Downstream consumer lifecycle',
        'npx ai-created-ui-agent consumer-status',
        'docs/consumer-update-automation.md',
        'Existing sites remain on that release',
        'no central registration is required',
        'The consumer owns any optional schedule',
        'Provider previews may help review but do not replace those compatibility checks',
        'merge manually',
        'smoke-test the affected workflow',
        'docs/examples/consumer-renovate.json',
      ]) {
        expect(context).toContain(requiredText);
      }
      for (const prohibitedText of [
        'Registered consumers:',
        'Quality / Validate application',
        'GitHub returns 404 for unauthorized private repository issues',
      ]) {
        expect(context).not.toContain(prohibitedText);
      }
    }
  });

  it('publishes the compact appearance and accent contract for agents', () => {
    const context = readFileSync(path.join(packageRoot, 'llms.txt'), 'utf8');

    for (const requiredText of [
      '## Appearance and accent contract',
      'The supported `accentNames` are `red`, `green`, `blue`, `orange`, `yellow`, `purple`, `teal`, `pink`, and `magenta`.',
      'destructive and status tokens remain fixed',
      '`ThemeProvider`, `useTheme`, `accentNames`, and the `Accent` type',
      '<ThemeProvider accent="blue">',
      '`onAccentChange` reports requested changes in either mode, but controlled mode does not persist them',
      '<ThemeProvider defaultAccent="blue">',
      '`localStorage["accent"]`, existing `html[data-accent]`, `defaultAccent`, then `red`',
      '`setAccent` persists changes and calls `onAccentChange` in uncontrolled mode',
      'Render the matching `data-accent` on the root document before paint',
      'Before hydration, server-render the fallback `html[data-accent]` that matches `defaultAccent`',
      'replace it with any valid stored accent',
    ]) {
      expect(context).toContain(requiredText);
    }
  });

  it('returns complete component and template contracts as JSON', () => {
    const button = runAgent('component', 'button');
    const component = button.component as Record<string, unknown>;
    expect(button.ok).toBe(true);
    expect(component.id).toBe('button');
    expect(component).toHaveProperty('construction');
    expect(component).toHaveProperty('accessibilitySpec');

    const templateResult = runAgent('template', 'dashboard');
    expect(templateResult.ok).toBe(true);
    expect(String(templateResult.source)).toContain("from '@ai-created/ui'");
    expect(String(templateResult.source)).toContain('DashboardPage');
  });

  it('lists full coverage and reports unknown ids with actionable suggestions', () => {
    const components = runAgent('list-components').components as unknown[];
    const templates = runAgent('templates').templates as unknown[];
    expect(components).toHaveLength(22);
    expect(templates).toHaveLength(6);

    expect(() => execFileSync(process.execPath, ['scripts/design-system-agent.mjs', 'component', 'made-up'], {
      cwd: packageRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    })).toThrow();
  });
});
