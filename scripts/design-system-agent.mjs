#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const readJson = (relativePath) =>
  readFile(path.join(packageRoot, relativePath), 'utf8').then(JSON.parse);

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message, suggestions = []) {
  output({ ok: false, error: message, suggestions });
  process.exitCode = 2;
}

function help() {
  output({
    ok: true,
    usage: 'node scripts/design-system-agent.mjs <command> [argument]',
    commands: {
      context: 'Return canonical sources, artifacts, counts, and validation commands.',
      'list-components': 'List component ids, names, categories, and summaries.',
      component: 'Return the complete contract for one component id or slug.',
      guideline: 'Return one principal guideline by slug.',
      templates: 'List approved page templates.',
      template: 'Return one template contract and its complete TSX source.',
      validate: 'Run the blocking design-policy validator against optional paths.',
    },
  });
}

async function main() {
  const [command = 'help', ...arguments_] = process.argv.slice(2);
  if (command === 'help' || command === '--help' || command === '-h') return help();

  if (command === 'validate') {
    const result = spawnSync(
      process.execPath,
      [path.join(packageRoot, 'scripts/validate-design-policy.mjs'), '--json', ...arguments_],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    process.exitCode = result.status ?? 2;
    return;
  }

  const manifest = await readJson('design-system.manifest.json');

  if (command === 'context') {
    return output({
      ok: true,
      package: manifest.package,
      canonicalSourcePrecedence: manifest.canonicalSourcePrecedence,
      artifacts: manifest.artifacts,
      coverage: {
        components: manifest.components.length,
        publicExports: manifest.publicApi.exports.length,
        guidelines: manifest.guidelines.length,
      },
      validation: manifest.validation,
    });
  }

  if (command === 'list-components') {
    return output({
      ok: true,
      components: manifest.components.map(({ id, slug, name, category, summary }) => ({
        id,
        slug,
        name,
        category,
        summary,
      })),
    });
  }

  if (command === 'component') {
    const query = arguments_[0];
    const component = manifest.components.find(
      ({ id, slug, name }) => id === query || slug === query || name.toLowerCase() === query?.toLowerCase(),
    );
    if (!component) return fail(`Unknown component: ${query ?? '(missing)'}`, manifest.components.map(({ id }) => id));
    return output({ ok: true, component });
  }

  if (command === 'guideline') {
    const query = arguments_[0];
    const guideline = manifest.guidelines.find(({ slug }) => slug === query);
    if (!guideline) return fail(`Unknown guideline: ${query ?? '(missing)'}`, manifest.guidelines.map(({ slug }) => slug));
    return output({ ok: true, guideline });
  }

  if (command === 'templates' || command === 'template') {
    const templateManifest = await readJson('templates/agent/manifest.json');
    if (command === 'templates') return output({ ok: true, ...templateManifest });
    const query = arguments_[0];
    const template = templateManifest.templates.find(({ id }) => id === query);
    if (!template) return fail(`Unknown template: ${query ?? '(missing)'}`, templateManifest.templates.map(({ id }) => id));
    const source = await readFile(path.join(packageRoot, template.source), 'utf8');
    return output({ ok: true, template, source });
  }

  fail(`Unknown command: ${command}`, ['context', 'list-components', 'component', 'guideline', 'templates', 'template', 'validate']);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
