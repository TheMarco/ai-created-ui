import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const validatorPath = path.join(packageRoot, 'scripts/validate-design-policy.mjs');
const temporaryDirectories: string[] = [];

interface PolicyException {
  rule: string;
  files: string[];
  reason: string;
  owner: string;
  reviewBy: string;
}

interface Diagnostic {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
}

interface PolicyResult {
  success: boolean;
  scannedFiles: number;
  errors: number;
  diagnostics: Diagnostic[];
}

function fixture(source: string, exceptions: PolicyException[] = []) {
  const directory = mkdtempSync(path.join(tmpdir(), 'ai-created-policy-'));
  temporaryDirectories.push(directory);
  mkdirSync(path.join(directory, 'src'));
  writeFileSync(path.join(directory, 'src', 'Example.tsx'), source);
  writeFileSync(
    path.join(directory, 'policy.json'),
    JSON.stringify({
      policyVersion: '1.0.0',
      canonicalPackage: '@ai-created/ui',
      extensions: ['.css', '.js', '.jsx', '.ts', '.tsx'],
      canonicalTokenSources: ['vendor/tokens.css'],
      canonicalPrimitiveSources: ['vendor/components/**'],
      canonicalPrimitives: ['Button', 'Surface'],
      ignore: [],
      approvedArchetypes: [
        {
          id: 'workspace',
          description: 'Task-oriented product surface with one focused work area.',
        },
      ],
      exceptions,
    })
  );
  return directory;
}

function run(directory: string, ...arguments_: string[]) {
  return spawnSync(
    process.execPath,
    [validatorPath, '--config', 'policy.json', '--json', ...arguments_],
    { cwd: directory, encoding: 'utf8' }
  );
}

function resultOf(output: ReturnType<typeof run>) {
  expect(output.stdout).not.toBe('');
  return JSON.parse(output.stdout) as PolicyResult;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe('blocking design-policy validator', () => {
  it('passes semantic package usage and emits valid machine-readable JSON', () => {
    const directory = fixture(`import { Button, Surface } from '@ai-created/ui';

export function Example() {
  return <Surface className="bg-surface text-text"><Button>Save</Button></Surface>;
}
`);

    const output = run(directory, 'src');
    const result = resultOf(output);

    expect(output.status).toBe(0);
    expect(output.stderr).toBe('');
    expect(result).toMatchObject({
      success: true,
      scannedFiles: 1,
      errors: 0,
      diagnostics: [],
    });
  });

  it('allows raw reference declarations only in the configured canonical token source', () => {
    const directory = fixture(`export const semanticClass = 'bg-surface text-text';\n`);
    mkdirSync(path.join(directory, 'vendor'));
    writeFileSync(
      path.join(directory, 'vendor', 'tokens.css'),
      ':root { --ref-neutral-950: #0a0a0b; --color-bg: var(--ref-neutral-950); }\n'
    );

    const output = run(directory, 'vendor/tokens.css');
    expect(output.status).toBe(0);
    expect(resultOf(output)).toMatchObject({ success: true, scannedFiles: 1, errors: 0 });
  });

  it('does not scan paths ignored by the repository policy, including tests', () => {
    const output = spawnSync(
      process.execPath,
      [validatorPath, '--json', '--allow-empty', 'tests'],
      { cwd: packageRoot, encoding: 'utf8' }
    );
    const result = resultOf(output);

    expect(output.status).toBe(0);
    expect(result).toMatchObject({ success: true, scannedFiles: 0, errors: 0 });
  });

  it('fails by default when no files match the requested targets', () => {
    const directory = fixture(`export const semanticClass = 'bg-surface text-text';\n`);
    mkdirSync(path.join(directory, 'ignored'));

    const output = run(directory, 'ignored');
    const result = resultOf(output);

    expect(output.status).toBe(1);
    expect(result).toMatchObject({ success: false, scannedFiles: 0, errors: 1 });
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        file: '.',
        line: 1,
        column: 1,
        rule: 'no-files-scanned',
      }),
    ]);
  });

  it('rejects stock palette, radius, shadow, and font classes while allowing deliberate geometry', () => {
    const directory = fixture(`export const classes = [
  'bg-slate-900 border-red-500 bg-emerald-400/20 text-white',
  'dark:bg-zinc-950 light:text-black hover:bg-blue-600',
  'rounded-3xl shadow-2xl font-[600]',
  'text-red bg-red rounded-lg rounded-t-md shadow-none shadow-elevation-medium',
  'p-[13px] w-[377px] text-[11px]',
].join(' ');\n`);

    const output = run(directory, 'src');
    const result = resultOf(output);

    expect(output.status).toBe(1);
    expect(result.success).toBe(false);
    expect(result.errors).toBe(10);
    expect(result.diagnostics.filter((diagnostic) => diagnostic.rule === 'no-theme-palette')).toHaveLength(7);
    expect(result.diagnostics.filter((diagnostic) => diagnostic.rule === 'no-arbitrary-style-value')).toHaveLength(3);

    const reportedClasses = result.diagnostics.flatMap((diagnostic) =>
      diagnostic.message.match(/"([^"]+)"/)?.slice(1) ?? []
    );
    for (const forbidden of [
      'bg-slate-900',
      'border-red-500',
      'bg-emerald-400/20',
      'text-white',
      'dark:bg-zinc-950',
      'light:text-black',
      'hover:bg-blue-600',
      'rounded-3xl',
      'shadow-2xl',
      'font-[600]',
    ]) {
      expect(reportedClasses).toContain(forbidden);
    }
    for (const allowed of [
      'text-red',
      'bg-red',
      'rounded-lg',
      'rounded-t-md',
      'shadow-none',
      'shadow-elevation-medium',
      'p-[13px]',
      'w-[377px]',
      'text-[11px]',
    ]) {
      expect(reportedClasses).not.toContain(allowed);
    }
  });

  it('fails with precise file, line, and rule diagnostics for every drift class', () => {
    const directory = fixture(`import { Button } from '@ai-created/ui/src/components/Button';
import { Surface } from './Surface';

const reference = 'var(--ref-neutral-950)';
const raw = '#ff00aa';
const classes = 'dark:bg-zinc-950 bg-[#112233] font-[Inter] rounded-[13px] shadow-[0_1px_#000]';

export function Example() { return <Button className={classes}>{reference}{raw}<Surface /></Button>; }
`);

    const output = run(directory, 'src');
    const result = resultOf(output);
    const rules = new Set(result.diagnostics.map((diagnostic) => diagnostic.rule));

    expect(output.status).toBe(1);
    expect(result.success).toBe(false);
    expect(rules).toEqual(
      new Set([
        'no-reference-token',
        'no-raw-color',
        'no-internal-package-import',
        'no-theme-palette',
        'no-arbitrary-style-value',
        'no-local-primitive',
      ])
    );
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        file: 'src/Example.tsx',
        line: 1,
        column: expect.any(Number),
        rule: 'no-internal-package-import',
      })
    );
    expect(result.diagnostics.every((diagnostic) => diagnostic.line > 0 && diagnostic.column > 0)).toBe(true);
  });

  it('honors a concrete active exception scoped to its rule and file', () => {
    const directory = fixture(
      `export const legacyColor = '#d41010';\n`,
      [
        {
          rule: 'no-raw-color',
          files: ['src/Example.tsx'],
          reason: 'A partner embed contract still requires this exact legacy value.',
          owner: 'Design systems team',
          reviewBy: '2099-12-31',
        },
      ]
    );

    const output = run(directory, 'src');
    expect(output.status).toBe(0);
    expect(resultOf(output)).toMatchObject({ success: true, errors: 0 });
  });

  it('fails an expired exception and leaves the original violation visible', () => {
    const directory = fixture(
      `export const legacyColor = '#d41010';\n`,
      [
        {
          rule: 'no-raw-color',
          files: ['src/Example.tsx'],
          reason: 'A partner embed contract still requires this exact legacy value.',
          owner: 'Design systems team',
          reviewBy: '2000-01-01',
        },
      ]
    );

    const output = run(directory, 'src');
    const result = resultOf(output);

    expect(output.status).toBe(1);
    expect(result.diagnostics.map((diagnostic) => diagnostic.rule)).toEqual([
      'exception-expired',
      'no-raw-color',
    ]);
  });

  it('rejects vague or repository-wide exceptions as invalid configuration', () => {
    const directory = fixture(
      `export const legacyColor = '#d41010';\n`,
      [
        {
          rule: 'no-raw-color',
          files: ['**/*'],
          reason: 'temporary',
          owner: 'x',
          reviewBy: '2099-12-31',
        },
      ]
    );

    const output = run(directory, 'src');
    const result = resultOf(output);

    expect(output.status).toBe(2);
    expect(result.diagnostics.every((diagnostic) => diagnostic.rule === 'config-invalid')).toBe(true);
    expect(result.diagnostics.map((diagnostic) => diagnostic.message).join(' ')).toContain(
      'repository-wide globs are forbidden'
    );
  });
});
