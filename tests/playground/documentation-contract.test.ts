import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const fixturePaths = [
  '.github/workflows/consumer-currency.yml',
  '.github/workflows/quality.yml',
  '.github/workflows/release.yml',
  'AGENTS.md',
  'CHANGELOG.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'DESIGN-SYSTEM.md',
  'README.md',
  'RELEASING.md',
  'consumers.json',
  'contracts/consumer-registry.schema.json',
  'design-system.manifest.json',
  'docs/agent-integration.md',
  'docs/consumer-compatibility.md',
  'docs/consumer-update-automation.md',
  'package.json',
  'playground/src/app/layout.tsx',
  'playground/src/components/PlaygroundHeader.tsx',
  'playground/src/components/design-system/DSPageShell.tsx',
];
const temporaryRoots: string[] = [];

function runDocumentationCheck(root = packageRoot) {
  return execFileSync(process.execPath, ['scripts/verify-documentation-contract.mjs'], {
    cwd: packageRoot,
    encoding: 'utf8',
    env: { ...process.env, AI_CREATED_UI_DOCS_ROOT: root },
    stdio: 'pipe',
  });
}

function createDocumentationFixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'ai-created-ui-docs-'));
  temporaryRoots.push(root);
  for (const relativePath of fixturePaths) {
    const destination = path.join(root, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(packageRoot, relativePath), destination);
  }
  return root;
}

function replaceInFixture(root: string, relativePath: string, pattern: string | RegExp, replacement: string) {
  const filePath = path.join(root, relativePath);
  const original = readFileSync(filePath, 'utf8');
  writeFileSync(filePath, original.replace(pattern, replacement));
}

function captureDocumentationFailure(root: string) {
  try {
    runDocumentationCheck(root);
  } catch (error) {
    const failure = error as { stderr?: Buffer | string; stdout?: Buffer | string };
    return `${String(failure.stdout ?? '')}\n${String(failure.stderr ?? '')}`;
  }
  throw new Error('Expected the documentation contract to fail.');
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('public documentation contract', () => {
  it('matches the canonical manifest, portal routes, workflows, and contribution guidance', () => {
    expect(() => runDocumentationCheck()).not.toThrow();
  });

  it('fails when either manual Renovate dashboard action is missing', () => {
    for (const action of [
      'Trigger a request for Renovate to run again',
      'fix(deps): update dependency @ai-created/ui to vX.Y.Z',
    ]) {
      const root = createDocumentationFixture();
      replaceInFixture(root, 'docs/consumer-update-automation.md', action, 'removed dashboard action');
      expect(captureDocumentationFailure(root)).toContain(action);
    }
  });

  it('fails when deployment verification or generic release examples disappear', () => {
    const missingDeployment = createDocumentationFixture();
    replaceInFixture(
      missingDeployment,
      'docs/consumer-update-automation.md',
      /deploy/giu,
      'publish',
    );
    expect(captureDocumentationFailure(missingDeployment)).toContain(
      'a deployment verification stage',
    );

    const fixedVersion = createDocumentationFixture();
    replaceInFixture(fixedVersion, 'RELEASING.md', /vX\.Y\.Z/gu, 'v1.1.0');
    expect(captureDocumentationFailure(fixedVersion)).toContain(
      'fixed v1.1.0 operational examples',
    );
  });

  it('fails when manual merge or scheduled currency stages disappear', () => {
    const missingMerge = createDocumentationFixture();
    replaceInFixture(
      missingMerge,
      'docs/consumer-update-automation.md',
      'Merge manually',
      'Complete the review',
    );
    expect(captureDocumentationFailure(missingMerge)).toContain('a manual merge stage');

    const missingCurrency = createDocumentationFixture();
    replaceInFixture(
      missingCurrency,
      'docs/consumer-update-automation.md',
      /(?:scheduled|daily)/giu,
      'periodic',
    );
    expect(captureDocumentationFailure(missingCurrency)).toContain(
      'scheduled currency monitoring',
    );
  });

  it('fails when required consumer lifecycle registry fields violate the JSON Schema', () => {
    const root = createDocumentationFixture();
    const registryPath = path.join(root, 'consumers.json');
    const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as Record<string, unknown>;
    delete registry.lifecycle;
    writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

    expect(captureDocumentationFailure(root)).toContain('$.lifecycle is required');
  });
});
