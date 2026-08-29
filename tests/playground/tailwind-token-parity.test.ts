import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '../..');

describe('Tailwind token parity', () => {
  it('maps only declared semantic tokens and accounts for public token families', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/verify-tailwind-token-parity.mjs', '--json'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(JSON.parse(output)).toMatchObject({ ok: true });
  });
});
