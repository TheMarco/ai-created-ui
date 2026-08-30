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
  consumers: Array<{
    id: string;
    repository: string;
    defaultBranch: string;
    manifestPath: string;
    validationCommand: string;
    owner: string;
  }>;
};
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function runConsumerStatus(tag: string, latestTag = 'v1.2.0') {
  const directory = mkdtempSync(path.join(tmpdir(), 'ai-created-ui-consumer-'));
  temporaryDirectories.push(directory);
  writeFileSync(
    path.join(directory, 'package.json'),
    `${JSON.stringify({
      name: 'consumer-fixture',
      dependencies: {
        '@ai-created/ui': `git+https://github.com/TheMarco/ai-created-ui.git#${tag}`,
      },
    }, null, 2)}\n`,
  );
  return spawnSync(
    process.execPath,
    [path.join(packageRoot, 'scripts/design-system-agent.mjs'), 'consumer-status'],
    {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, AI_CREATED_UI_LATEST_TAG: latestTag },
    },
  );
}

describe('consumer propagation contract', () => {
  it('registers every governed product without duplicate identities', () => {
    expect(registry.schemaVersion).toBe('1.0.0');
    expect(registry.package).toBe('@ai-created/ui');
    expect(registry.consumers.map(({ id }) => id)).toEqual([
      'ai-created.com',
      'human-actually',
    ]);
    expect(new Set(registry.consumers.map(({ repository }) => repository)).size).toBe(
      registry.consumers.length,
    );
    for (const consumer of registry.consumers) {
      expect(consumer.defaultBranch).toBe('main');
      expect(consumer.manifestPath).toBe('package.json');
      expect(consumer.validationCommand).toBe('npm run validate:ui-update');
      expect(consumer.owner.length).toBeGreaterThan(2);
    }
  });

  it('passes an exact immutable release and reports structured status', () => {
    const result = runConsumerStatus('v1.2.0');
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: true,
      installedTag: 'v1.2.0',
      latestTag: 'v1.2.0',
      status: 'current',
    });
  });

  it('fails when a consumer is behind the latest release', () => {
    const result = runConsumerStatus('v1.1.1');
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      installedTag: 'v1.1.1',
      latestTag: 'v1.2.0',
      status: 'stale',
    });
  });

  it('rejects a moving branch dependency', () => {
    const result = runConsumerStatus('main');
    expect(result.status).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      error: expect.stringMatching(/immutable public GitHub SemVer tag/i),
    });
  });
});
