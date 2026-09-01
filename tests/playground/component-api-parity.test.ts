import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '../..');

describe('component API parity', () => {
  it('resolves documented API rows, imports, and select controls against public TypeScript', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/verify-component-api-parity.mjs', '--json'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(JSON.parse(output)).toMatchObject({
      ok: true,
      components: 22,
    });
  }, 15_000);
});
