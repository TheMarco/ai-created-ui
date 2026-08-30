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
      consumers: 'List every product governed by the downstream compatibility contract.',
      'consumer-status': 'Compare a consumer package manifest with the latest reviewed release.',
      'list-components': 'List component ids, names, categories, and summaries.',
      component: 'Return the complete contract for one component id or slug.',
      guideline: 'Return one principal guideline by slug.',
      templates: 'List approved page templates.',
      template: 'Return one template contract and its complete TSX source.',
      validate: 'Run the blocking design-policy validator against optional paths.',
    },
  });
}

function stableVersion(tag) {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(tag);
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

async function latestReleaseTag() {
  if (process.env.AI_CREATED_UI_LATEST_TAG) {
    return process.env.AI_CREATED_UI_LATEST_TAG;
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ai-created-ui-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(
    'https://api.github.com/repos/TheMarco/ai-created-ui/releases/latest',
    { headers },
  );
  if (!response.ok) {
    throw new Error(`GitHub latest-release request failed with HTTP ${response.status}.`);
  }
  const release = await response.json();
  if (typeof release.tag_name !== 'string') {
    throw new Error('GitHub latest-release response did not include a tag name.');
  }
  return release.tag_name;
}

async function consumerStatus(manifestArgument) {
  const manifestPath = path.resolve(process.cwd(), manifestArgument ?? 'package.json');
  const consumerPackage = JSON.parse(await readFile(manifestPath, 'utf8'));
  const dependency =
    consumerPackage.dependencies?.['@ai-created/ui'] ??
    consumerPackage.devDependencies?.['@ai-created/ui'];
  if (typeof dependency !== 'string') {
    throw new Error(`${manifestPath} does not declare @ai-created/ui.`);
  }
  const dependencyMatch =
    /^git\+https:\/\/github\.com\/TheMarco\/ai-created-ui\.git#(v\d+\.\d+\.\d+)$/.exec(
      dependency,
    );
  if (!dependencyMatch) {
    throw new Error(
      '@ai-created/ui must use an immutable public GitHub SemVer tag, for example #v1.2.0.',
    );
  }

  const installedTag = dependencyMatch[1];
  const latestTag = await latestReleaseTag();
  const installedVersion = stableVersion(installedTag);
  const latestVersion = stableVersion(latestTag);
  if (!installedVersion || !latestVersion) {
    throw new Error(`Unable to compare release tags ${installedTag} and ${latestTag}.`);
  }

  const comparison = compareVersions(installedVersion, latestVersion);
  const result = {
    ok: comparison === 0,
    consumer: consumerPackage.name ?? path.basename(path.dirname(manifestPath)),
    manifestPath,
    installedTag,
    latestTag,
    status: comparison === 0 ? 'current' : comparison < 0 ? 'stale' : 'ahead',
  };
  output(result);
  if (comparison !== 0) process.exitCode = comparison < 0 ? 1 : 2;
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

  if (command === 'consumer-status') {
    return consumerStatus(arguments_[0]);
  }

  const manifest = await readJson('design-system.manifest.json');
  const consumerRegistry = await readJson('consumers.json');

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
        consumers: consumerRegistry.consumers.length,
      },
      validation: manifest.validation,
    });
  }

  if (command === 'consumers') {
    return output({ ok: true, ...consumerRegistry });
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

  fail(`Unknown command: ${command}`, [
    'context',
    'consumers',
    'consumer-status',
    'list-components',
    'component',
    'guideline',
    'templates',
    'template',
    'validate',
  ]);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
