#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const preset = require(path.join(root, 'tailwind-preset.js'));

function collectVariables(value, output = new Set()) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/var\((--[^)]+)\)/g)) output.add(match[1]);
    return output;
  }

  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) collectVariables(nested, output);
  }

  return output;
}

function fail(issues, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify({ ok: false, issues }, null, 2)}\n`);
  } else {
    console.error('Tailwind token parity failed:');
    for (const issue of issues) console.error(`- ${issue}`);
  }
  process.exitCode = 1;
}

const css = await readFile(path.join(root, 'styles/tokens.css'), 'utf8');
const declared = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((match) => match[1]));
const referenced = collectVariables(preset.theme);
const issues = [];

for (const variable of referenced) {
  if (!declared.has(variable)) issues.push(`Tailwind references unknown token ${variable}.`);
  if (variable.startsWith('--ref-')) issues.push(`Tailwind must not expose reference token ${variable}.`);
}

const intentionallyCssOnly = new Set([
  '--color-selection',
  '--layout-gutter',
  '--layout-gutter-mobile',
  '--hero-overlay-default',
  '--hero-overlay-strong',
  '--hero-overlay-soft',
  '--hero-text-primary',
  '--hero-text-muted',
  '--hero-text-dim',
  '--hero-image-light-opacity',
  '--hero-image-dark-opacity',
]);

for (const variable of declared) {
  const publicCategory =
    variable.startsWith('--color-') ||
    variable.startsWith('--radius-') ||
    variable.startsWith('--layout-') ||
    variable.startsWith('--motion-') ||
    variable.startsWith('--hero-');
  if (publicCategory && !referenced.has(variable) && !intentionallyCssOnly.has(variable)) {
    issues.push(`Public token ${variable} is neither mapped by Tailwind nor declared CSS-only.`);
  }
}

if (issues.length) {
  fail(issues, process.argv.includes('--json'));
} else if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({ ok: true, declared: declared.size, mapped: referenced.size })}\n`);
} else {
  console.log(`Tailwind token parity verified: ${referenced.size} mapped variables, ${declared.size} declared tokens.`);
}
