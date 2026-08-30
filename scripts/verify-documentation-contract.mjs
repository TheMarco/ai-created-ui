#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  agents: 'AGENTS.md',
  changelog: 'CHANGELOG.md',
  claude: 'CLAUDE.md',
  contributing: 'CONTRIBUTING.md',
  consumerCurrencyWorkflow: '.github/workflows/consumer-currency.yml',
  consumerRegistry: 'consumers.json',
  designSystem: 'DESIGN-SYSTEM.md',
  header: 'playground/src/components/PlaygroundHeader.tsx',
  homepage: 'playground/src/components/design-system/DSPageShell.tsx',
  integration: 'docs/agent-integration.md',
  layout: 'playground/src/app/layout.tsx',
  manifest: 'design-system.manifest.json',
  package: 'package.json',
  qualityWorkflow: '.github/workflows/quality.yml',
  readme: 'README.md',
  release: 'RELEASING.md',
  releaseWorkflow: '.github/workflows/release.yml',
};

const entries = await Promise.all(
  Object.entries(paths).map(async ([key, relativePath]) => [
    key,
    await readFile(path.join(root, relativePath), 'utf8'),
  ]),
);
const files = Object.fromEntries(entries);
const manifest = JSON.parse(files.manifest);
const consumerRegistry = JSON.parse(files.consumerRegistry);
const packageJson = JSON.parse(files.package);
const issues = [];

function requireText(fileKey, text, label = text) {
  if (!files[fileKey].includes(text)) {
    issues.push(`${paths[fileKey]} must include ${JSON.stringify(label)}.`);
  }
}

function requirePattern(fileKey, pattern, label) {
  if (!pattern.test(files[fileKey])) {
    issues.push(`${paths[fileKey]} must include ${label}.`);
  }
}

const componentCount = manifest.components.length;
const publicExportCount = manifest.publicApi.exports.length;
const runtimeValueCount = manifest.publicApi.exports.filter(
  ({ kind }) => kind === 'value',
).length;

requireText('readme', `**${componentCount} documented families**`);
requireText('readme', `${runtimeValueCount} runtime values`);
requireText('readme', `${publicExportCount} public TypeScript exports`);
for (const url of [
  'https://ui.ai-created.com/llms.txt',
  'https://ui.ai-created.com/llms-full.txt',
  'https://ui.ai-created.com/design-system/manifest.json',
]) {
  requireText('readme', url);
}
for (const command of [
  'npm run agent:export',
  'npm run agent:check',
  'npm run docs:check',
  'npm run validate',
  'npm run test:browser',
  'npm run agent:query -- consumers',
]) {
  requireText('readme', command);
}
requireText('readme', 'npx ai-created-ui-agent consumer-status');
requireText('integration', 'consumers.json');
requireText('integration', 'npx ai-created-ui-agent consumer-status');
requireText('consumerCurrencyWorkflow', 'workflow_call:');
requireText('consumerCurrencyWorkflow', 'ai-created-ui-agent consumer-status');
if (
  consumerRegistry.schemaVersion !== '1.0.0' ||
  consumerRegistry.package !== '@ai-created/ui' ||
  !Array.isArray(consumerRegistry.consumers) ||
  consumerRegistry.consumers.length === 0
) {
  issues.push(`${paths.consumerRegistry} must publish the versioned supported-consumer inventory.`);
}
const consumerRepositories = consumerRegistry.consumers.map(({ repository }) => repository);
if (new Set(consumerRepositories).size !== consumerRepositories.length) {
  issues.push(`${paths.consumerRegistry} contains duplicate repositories.`);
}

for (const text of [
  'AGENTS.md',
  'design-system.manifest.json',
  'npm run agent:export',
  'npm run agent:check',
  'npm run validate',
  'npm run test:browser',
  'Validate design system',
]) {
  requireText('contributing', text);
}

for (const text of [
  'npm run agent:export',
  'npm run validate',
  'npm run test:browser',
  'Validate design system',
]) {
  requireText('release', text);
}

for (const text of [
  'Validate design system',
  'require pull requests',
  'prohibit force pushes',
  'Renovate dependency pull request',
]) {
  requireText('integration', text);
}

for (const destination of [
  '/components',
  '/guidelines',
  '/guidelines/assets#agent-contract',
]) {
  requireText('homepage', `href: '${destination}'`, destination);
  requireText('header', `href: '${destination}'`, destination);
}
requireText('homepage', 'Design once. Build without drift.');
requireText('layout', 'Design System Specification');
if (files.layout.includes('Design System Playground')) {
  issues.push(`${paths.layout} must describe the canonical specification, not a playground.`);
}

for (const fileKey of ['homepage', 'header', 'layout']) {
  if (/[\u2013\u2014]/u.test(files[fileKey])) {
    issues.push(`${paths[fileKey]} contains a visible en dash or em dash.`);
  }
}

if (files.claude !== '@AGENTS.md\n') {
  issues.push('CLAUDE.md must remain the exact one-line pointer @AGENTS.md.');
}

for (const [scriptName, expectedFragment] of [
  ['agent:export', 'manifest:export'],
  ['agent:check', 'docs:check'],
  ['validate', 'agent:check'],
]) {
  const script = packageJson.scripts?.[scriptName];
  if (typeof script !== 'string' || !script.includes(expectedFragment)) {
    issues.push(`package.json script ${scriptName} must include ${expectedFragment}.`);
  }
}

const validationCommands = manifest.validation?.commands ?? [];
if (!validationCommands.some(({ id, command, blocking }) =>
  id === 'documentation' && command === 'npm run docs:check' && blocking === true
)) {
  issues.push('design-system.manifest.json must publish docs:check as a blocking validation command.');
}

requirePattern('qualityWorkflow', /pull_request:/u, 'the pull_request trigger');
requirePattern('qualityWorkflow', /branches:\s*\[main\]/u, 'the main branch trigger');
requireText('qualityWorkflow', 'npm run validate');
requireText('qualityWorkflow', 'npm run test:browser');
requireText('releaseWorkflow', 'npm run validate');
requireText('releaseWorkflow', 'npm run test:browser');

if (issues.length > 0) {
  console.error('Documentation contract failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Documentation contract verified: ${componentCount} documented families, ${runtimeValueCount} runtime values, ${publicExportCount} public exports.`,
  );
}
