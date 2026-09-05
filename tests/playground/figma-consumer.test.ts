import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { assessConsumer, captureSource, validateAudit } from '../../scripts/lib/figma-consumer.mjs';

const script = path.resolve(import.meta.dirname, '../../scripts/figma-consumer.mjs');
const config = { schemaVersion: 1, fileKey: 'figma-file' };
const verifiedAt = '2026-09-04T00:00:00Z';
let root: string;

async function write(relative: string, value: unknown) {
  const filename = path.join(root, relative);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, typeof value === 'string' ? value : JSON.stringify(value));
}

function cli(...args: string[]) {
  return spawnSync(process.execPath, [script, ...args, '--root', root], { encoding: 'utf8' });
}

function audit(source: Awaited<ReturnType<typeof captureSource>>) {
  return {
    schemaVersion: 1, fileKey: config.fileKey, sourceFingerprint: source.fingerprint,
    auditedAt: verifiedAt, reviewer: 'Fixture reviewer', reviewedComponentIds: source.componentIds,
    checks: { tokens: 'passed', components: 'passed', themes: 'passed', templates: 'passed', visualReview: 'passed' },
    evidence: ['Fixture verification'],
    observed: {
      componentAssets: [{ id: '1:2', name: 'Button' }], variables: 10, textStyles: 10,
      collections: [
        { id: 'semantic', name: 'AI-Created UI / Semantic', modes: ['dark', 'light'] },
        { id: 'accent', name: 'AI-Created UI / Accent', modes: ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'teal', 'pink', 'magenta'] },
      ],
    },
  };
}

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'figma-consumer-'));
  for (const filename of [
    'src/Button.tsx', 'styles/tokens.css', 'templates/agent/form.tsx',
    'playground/src/components/design-system/specs/registry.ts',
    'playground/src/components/design-system/principal-spec/registry.ts',
    'tailwind-preset.js', 'DESIGN-SYSTEM.md',
    'playground/src/components/design-system/componentDocs.ts',
    'playground/src/app/globals.css', 'playground/tailwind.config.js',
  ]) await write(filename, 'fixture');
  await write('package.json', { version: '1.4.0', dependencies: {}, peerDependencies: {} });
  await write('design-system.manifest.json', { components: [{ id: 'button' }] });
  await write('figma/consumer.json', config);
});

afterEach(async () => { await rm(root, { recursive: true, force: true }); });

it('records a reviewed source and independently confirms its publication channels', async () => {
  const source = await captureSource(root);
  const publication = { sourceFingerprint: source.fingerprint, verifiedAt };
  const lock = { schemaVersion: 1, source, audit: audit(source), publication: { library: publication, community: publication } };
  expect(assessConsumer(source, lock, config)).toMatchObject({
    status: 'current', publication: { library: 'current', community: 'current' },
  });
  expect(assessConsumer(source, { ...lock, publication: {} }, config)).toMatchObject({
    status: 'current', publication: { library: 'pending', community: 'pending' },
  });
  expect(assessConsumer(source, null, config).status).toBe('unverified');
});

it('reports actual added, changed and removed watched files as stale', async () => {
  const source = await captureSource(root);
  await write('src/New.tsx', 'new component');
  await write('styles/tokens.css', 'changed token');
  await rm(path.join(root, 'src/Button.tsx'));
  const current = await captureSource(root);
  expect(assessConsumer(current, { schemaVersion: 1, source, audit: audit(source) }, config)).toMatchObject({
    status: 'stale',
    changes: { added: ['src/New.tsx'], changed: ['styles/tokens.css'], removed: ['src/Button.tsx'] },
  });
});

it('requires reviewed coverage when a public component is added', async () => {
  const source = await captureSource(root);
  await write('design-system.manifest.json', { components: [{ id: 'button' }, { id: 'new-component' }] });
  const current = await captureSource(root);
  expect(current.fingerprint).not.toBe(source.fingerprint);
  expect(() => validateAudit({ ...audit(source), sourceFingerprint: current.fingerprint }, current, config))
    .toThrow(/reviewedComponentIds/);
});

it('rejects malformed evidence, wrong source, duplicate assets and incomplete themes', async () => {
  const source = await captureSource(root);
  expect(() => validateAudit({}, source, config)).toThrow(/schemaVersion/);
  expect(() => validateAudit({ ...audit(source), sourceFingerprint: 'wrong' }, source, config)).toThrow(/sourceFingerprint/);
  const missingTheme = audit(source);
  missingTheme.observed.collections[0].modes = ['light'];
  expect(() => validateAudit(missingTheme, source, config)).toThrow(/Semantic/);
  const duplicates = audit(source);
  duplicates.observed.componentAssets.push(duplicates.observed.componentAssets[0]);
  expect(() => validateAudit(duplicates, source, config)).toThrow(/observed/);
});

it('uses the exact root, leaves plan read-only and rejects malformed CLI arguments', async () => {
  const plan = cli('plan');
  expect(plan.status, plan.stderr).toBe(0);
  expect(JSON.parse(plan.stdout).status).toBe('unverified');
  await expect(readFile(path.join(root, 'figma/consumer.lock.json'))).rejects.toThrow(/ENOENT/);
  for (const args of [['record'], ['check', '--wat'], ['nope'], ['record', '--evidence']]) {
    expect(cli(...args).status).toBe(1);
  }
});

it('preserves old publication receipts until publication of the changed source is verified', async () => {
  const source = await captureSource(root);
  const publication = { sourceFingerprint: source.fingerprint, verifiedAt };
  await write('evidence.json', { ...audit(source), publication: { library: publication, community: publication } });
  const evidence = path.join(root, 'evidence.json');
  const initial = cli('record', '--evidence', evidence, '--published-library', '--published-community');
  expect(initial.status, initial.stderr).toBe(0);
  expect(cli('release-check').status).toBe(0);
  await write('src/Button.tsx', 'new button contract');
  expect(cli('check').status).toBe(1);
  expect(JSON.parse(cli('plan').stdout).status).toBe('stale');
  await write('evidence.json', audit(await captureSource(root)));
  expect(cli('record', '--evidence', evidence).status).toBe(0);
  const lock = JSON.parse(await readFile(path.join(root, 'figma/consumer.lock.json'), 'utf8'));
  expect(lock.publication.community.sourceFingerprint).toBe(source.fingerprint);
  expect(cli('check').status).toBe(0);
  expect(cli('release-check').status).toBe(1);
});

it('rejects unverified publication flags without writing a lock', async () => {
  await write('evidence.json', audit(await captureSource(root)));
  const result = cli('record', '--evidence', path.join(root, 'evidence.json'), '--published-community');
  expect(result.status).toBe(1);
  expect(result.stderr).toMatch(/confirm community publication/);
  await expect(readFile(path.join(root, 'figma/consumer.lock.json'))).rejects.toThrow(/ENOENT/);
});

it('ignores website copy but detects a new watched file and its removal', async () => {
  const before = await captureSource(root);
  await write('playground/src/app/designers/page.tsx', 'new marketing copy');
  expect((await captureSource(root)).fingerprint).toBe(before.fingerprint);
  await write('src/New.tsx', 'new component');
  expect((await captureSource(root)).fingerprint).not.toBe(before.fingerprint);
  await rm(path.join(root, 'src/New.tsx'));
  expect((await captureSource(root)).fingerprint).toBe(before.fingerprint);
});
