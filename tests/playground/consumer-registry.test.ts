import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');
const registry = JSON.parse(
  readFileSync(path.join(packageRoot, 'consumers.json'), 'utf8'),
) as {
  schemaVersion: string;
  package: string;
  lifecycle: {
    version: string;
    stageOrder: string[];
    stages: Array<{ id: string; nextStage: string | null }>;
  };
  consumers: Array<{
    id: string;
    repository: string;
    defaultBranch: string;
    manifestPath: string;
    lockfilePath: string;
    owner: string;
    dependencyAutomation: {
      provider: string;
      dashboardIssue: { number: number; url: string };
      pullRequest: { automerge: boolean };
    };
    validation: {
      command: string;
      policyRequiredCheckName: string;
      branchProtectionEnforced: boolean;
      checks: Array<{ id: string; command: string }>;
    };
    currency: { workflowPath: string; cron: string };
    deployment: {
      targets: Array<{
        id: string;
        provider: string;
        verification: { method: string; url?: string; workflowPath?: string };
      }>;
    };
  }>;
};
const temporaryDirectories: string[] = [];
const TAG_COMMIT_SHA = 'a'.repeat(40);
const DIFFERENT_COMMIT_SHA = 'b'.repeat(40);

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

type ConsumerFixtureOptions = {
  tag?: string;
  latestTag?: string;
  includeLockfile?: boolean;
  lockfileVersion?: 2 | 3;
  rootTag?: string;
  lockedSha?: string;
  tagCommitSha?: string;
  useV2DependencyEntry?: boolean;
};

function runConsumerStatus({
  tag = 'v1.2.0',
  latestTag = 'v1.2.0',
  includeLockfile = true,
  lockfileVersion = 3,
  rootTag = tag,
  lockedSha = TAG_COMMIT_SHA,
  tagCommitSha = TAG_COMMIT_SHA,
  useV2DependencyEntry = false,
}: ConsumerFixtureOptions = {}) {
  const directory = mkdtempSync(path.join(tmpdir(), 'ai-created-ui-consumer-'));
  temporaryDirectories.push(directory);
  const dependency = `git+https://github.com/TheMarco/ai-created-ui.git#${tag}`;
  writeFileSync(
    path.join(directory, 'package.json'),
    `${JSON.stringify({
      name: 'consumer-fixture',
      dependencies: { '@ai-created/ui': dependency },
    }, null, 2)}\n`,
  );

  if (includeLockfile) {
    const lockedPackage = {
      version: /^v\d+\.\d+\.\d+$/.test(tag) ? tag.slice(1) : tag,
      resolved: `git+ssh://git@github.com/TheMarco/ai-created-ui.git#${lockedSha}`,
    };
    const lockfile: Record<string, unknown> = {
      name: 'consumer-fixture',
      lockfileVersion,
      requires: true,
      packages: {
        '': {
          dependencies: {
            '@ai-created/ui': `git+https://github.com/TheMarco/ai-created-ui.git#${rootTag}`,
          },
        },
        ...(useV2DependencyEntry
          ? {}
          : { 'node_modules/@ai-created/ui': lockedPackage }),
      },
      ...(useV2DependencyEntry
        ? { dependencies: { '@ai-created/ui': lockedPackage } }
        : {}),
    };
    writeFileSync(
      path.join(directory, 'package-lock.json'),
      `${JSON.stringify(lockfile, null, 2)}\n`,
    );
  }

  return spawnSync(
    process.execPath,
    [path.join(packageRoot, 'scripts/design-system-agent.mjs'), 'consumer-status'],
    {
      cwd: directory,
      encoding: 'utf8',
      env: {
        ...process.env,
        AI_CREATED_UI_LATEST_TAG: latestTag,
        AI_CREATED_UI_TAG_COMMIT_SHA: tagCommitSha,
      },
    },
  );
}

describe('consumer propagation contract', () => {
  it('publishes a complete, ordered lifecycle and both governed products', () => {
    expect(registry.schemaVersion).toBe('2.0.0');
    expect(registry.package).toBe('@ai-created/ui');
    expect(registry.lifecycle.version).toBe('1.0.0');
    expect(registry.lifecycle.stageOrder).toEqual([
      'release-published',
      'renovate-detection',
      'schedule-bypass',
      'update-pr',
      'validation',
      'manual-merge',
      'deployment',
      'currency-current',
    ]);
    expect(registry.lifecycle.stages.map(({ id }) => id)).toEqual(
      registry.lifecycle.stageOrder,
    );
    expect(registry.lifecycle.stages.at(-1)?.nextStage).toBeNull();
    expect(registry.consumers.map(({ id }) => id)).toEqual([
      'ai-created.com',
      'human-actually',
    ]);
    expect(new Set(registry.consumers.map(({ repository }) => repository)).size).toBe(
      registry.consumers.length,
    );
  });

  it('records update, validation, currency, and deployment automation per consumer', () => {
    for (const consumer of registry.consumers) {
      expect(consumer.defaultBranch).toBe('main');
      expect(consumer.manifestPath).toBe('package.json');
      expect(consumer.lockfilePath).toBe('package-lock.json');
      expect(consumer.owner.length).toBeGreaterThan(2);
      expect(consumer.dependencyAutomation.provider).toBe('renovate');
      expect(consumer.dependencyAutomation.dashboardIssue.url).toContain(
        `github.com/${consumer.repository}/issues/`,
      );
      expect(consumer.dependencyAutomation.pullRequest.automerge).toBe(false);
      expect(consumer.validation.command).toBe('npm run validate:ui-update');
      expect(consumer.validation.policyRequiredCheckName).toBe('Validate application');
      expect(consumer.validation.branchProtectionEnforced).toBe(false);
      expect(consumer.validation.checks.length).toBeGreaterThanOrEqual(4);
      expect(consumer.currency.workflowPath).toBe(
        '.github/workflows/design-system-currency.yml',
      );
      expect(consumer.currency.cron).toMatch(/^\d+ \d+ \* \* \*$/);
    }

    const aiCreated = registry.consumers.find(({ id }) => id === 'ai-created.com');
    expect(aiCreated?.deployment.targets).toMatchObject([
      {
        id: 'web',
        provider: 'vercel',
        verification: { url: 'https://ai-created.com' },
      },
    ]);
    const humanActually = registry.consumers.find(({ id }) => id === 'human-actually');
    expect(humanActually?.deployment.targets).toMatchObject([
      {
        id: 'web',
        provider: 'vercel',
        verification: { url: 'https://human-actually.com' },
      },
      {
        id: 'worker',
        provider: 'fly.io',
        verification: { workflowPath: '.github/workflows/fly-worker-deploy.yml' },
      },
    ]);
  });

  it('passes an exact immutable release with an aligned npm v3 lock', () => {
    const result = runConsumerStatus();
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      statusSchemaVersion: '1.0.0',
      ok: true,
      installedTag: 'v1.2.0',
      installedTagCommitSha: TAG_COMMIT_SHA,
      lockedCommitSha: TAG_COMMIT_SHA,
      latestTag: 'v1.2.0',
      status: 'current',
      stage: {
        id: 'currency-current',
        liveRepositoryStateVerified: false,
      },
      nextAction: { id: 'none' },
    });
  });

  it('reports a stale consumer without claiming live pull-request state', () => {
    const result = runConsumerStatus({ tag: 'v1.1.1', latestTag: 'v1.2.0' });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      installedTag: 'v1.1.1',
      latestTag: 'v1.2.0',
      status: 'stale',
      stage: {
        id: 'renovate-detection',
        liveRepositoryStateVerified: false,
      },
      nextAction: {
        id: 'review-update-path',
        requiresLiveRepositoryInspection: true,
      },
    });
  });

  it('reports an ahead consumer as requiring release verification', () => {
    const result = runConsumerStatus({ tag: 'v1.3.0', latestTag: 'v1.2.0' });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      installedTag: 'v1.3.0',
      latestTag: 'v1.2.0',
      status: 'ahead',
      stage: {
        id: 'validation',
        liveRepositoryStateVerified: false,
      },
      nextAction: {
        id: 'verify-ahead-release',
        requiresLiveRepositoryInspection: true,
      },
    });
  });

  it('rejects a moving branch dependency as invalid', () => {
    const result = runConsumerStatus({ tag: 'main' });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      status: 'invalid',
      stage: { id: 'validation' },
      nextAction: { id: 'repair-consumer-dependency' },
      error: expect.stringMatching(/immutable public GitHub SemVer tag/i),
    });
  });

  it('rejects a missing package lock', () => {
    const result = runConsumerStatus({ includeLockfile: false });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      status: 'invalid',
      error: expect.stringMatching(/package-lock\.json is required/i),
    });
  });

  it('rejects a root lock spec that differs from package.json', () => {
    const result = runConsumerStatus({ rootTag: 'v1.1.1' });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      status: 'invalid',
      error: expect.stringMatching(/root dependency spec does not match package\.json/i),
    });
  });

  it('rejects a locked commit that is not the commit behind the tag', () => {
    const result = runConsumerStatus({ lockedSha: DIFFERENT_COMMIT_SHA });
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      status: 'invalid',
      error: expect.stringContaining(DIFFERENT_COMMIT_SHA),
    });
  });

  it('accepts a peeled commit SHA override for an annotated release tag', () => {
    const annotatedTagCommit = 'c'.repeat(40);
    const result = runConsumerStatus({
      lockedSha: annotatedTagCommit,
      tagCommitSha: annotatedTagCommit,
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'current',
      installedTagCommitSha: annotatedTagCommit,
      lockedCommitSha: annotatedTagCommit,
    });
  });

  it('supports the npm v2 dependencies entry when packages lacks the installed node', () => {
    const result = runConsumerStatus({
      lockfileVersion: 2,
      useV2DependencyEntry: true,
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'current',
      lockedCommitSha: TAG_COMMIT_SHA,
    });
  });
});
