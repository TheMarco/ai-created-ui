import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '../..');

describe('public documentation contract', () => {
  it('matches the canonical manifest, portal routes, workflows, and contribution guidance', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/verify-documentation-contract.mjs'], {
        cwd: packageRoot,
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });
});
