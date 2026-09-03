#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.AI_CREATED_UI_DOCS_ROOT
  ? path.resolve(process.env.AI_CREATED_UI_DOCS_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  agents: 'AGENTS.md',
  agentsPage: 'playground/src/components/design-system/agents/AgentsPage.tsx',
  agentsRoute: 'playground/src/app/agents/page.tsx',
  changelog: 'CHANGELOG.md',
  claude: 'CLAUDE.md',
  contributing: 'CONTRIBUTING.md',
  consumerCurrencyWorkflow: '.github/workflows/consumer-currency.yml',
  consumerAutomation: 'docs/consumer-update-automation.md',
  consumerCompatibility: 'docs/consumer-compatibility.md',
  renovateExample: 'docs/examples/consumer-renovate.json',
  consumerRegistry: 'consumers.json',
  consumerRegistrySchema: 'contracts/consumer-registry.schema.json',
  designSystem: 'DESIGN-SYSTEM.md',
  releaseModule: 'playground/src/lib/release.ts',
  systemFacts: 'playground/src/lib/system-facts.ts',
  header: 'playground/src/components/PlaygroundHeader.tsx',
  foundationsRoute: 'playground/src/app/foundations/page.tsx',
  homepage: 'playground/src/components/design-system/OverviewShell.tsx',
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
const consumerRegistrySchema = JSON.parse(files.consumerRegistrySchema);
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

function rejectText(fileKey, text, label = text) {
  if (files[fileKey].includes(text)) {
    issues.push(`${paths[fileKey]} must not include ${JSON.stringify(label)}.`);
  }
}

function rejectPattern(fileKey, pattern, label) {
  if (pattern.test(files[fileKey])) {
    issues.push(`${paths[fileKey]} must not include ${label}.`);
  }
}

function resolveLocalSchemaReference(reference) {
  if (!reference.startsWith('#/')) {
    throw new Error(`Unsupported consumer-registry schema reference: ${reference}`);
  }
  return reference
    .slice(2)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
    .reduce((value, part) => value?.[part], consumerRegistrySchema);
}

function validateJsonSchema(value, schema, location = '$', collector = issues) {
  if (typeof schema === 'boolean') {
    if (!schema) collector.push(`${paths.consumerRegistry} ${location} is rejected by its JSON Schema.`);
    return;
  }
  if (schema.$ref) {
    const resolved = resolveLocalSchemaReference(schema.$ref);
    if (!resolved) {
      collector.push(`${paths.consumerRegistrySchema} has an unresolved reference ${schema.$ref}.`);
      return;
    }
    validateJsonSchema(value, resolved, location, collector);
    return;
  }
  for (const branch of schema.allOf ?? []) validateJsonSchema(value, branch, location, collector);

  const branchMatches = (branch) => {
    const branchIssues = [];
    validateJsonSchema(value, branch, location, branchIssues);
    return branchIssues.length === 0;
  };
  if (schema.anyOf && !schema.anyOf.some(branchMatches)) {
    collector.push(`${paths.consumerRegistry} ${location} must match at least one anyOf branch.`);
  }
  if (schema.oneOf && schema.oneOf.filter(branchMatches).length !== 1) {
    collector.push(`${paths.consumerRegistry} ${location} must match exactly one oneOf branch.`);
  }
  if (schema.not && branchMatches(schema.not)) {
    collector.push(`${paths.consumerRegistry} ${location} must not match its excluded schema.`);
  }

  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    collector.push(`${paths.consumerRegistry} ${location} must equal ${JSON.stringify(schema.const)}.`);
  }
  if (schema.enum && !schema.enum.some((candidate) => JSON.stringify(candidate) === JSON.stringify(value))) {
    collector.push(`${paths.consumerRegistry} ${location} must match an allowed schema value.`);
  }

  const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  const expectedTypes = schema.type ? (Array.isArray(schema.type) ? schema.type : [schema.type]) : [];
  const typeMatches = expectedTypes.length === 0 || expectedTypes.some((expected) =>
    expected === actualType || (expected === 'integer' && actualType === 'number' && Number.isInteger(value))
  );
  if (!typeMatches) {
    collector.push(`${paths.consumerRegistry} ${location} must have type ${expectedTypes.join(' or ')}.`);
    return;
  }

  if (actualType === 'object') {
    for (const requiredProperty of schema.required ?? []) {
      if (!Object.hasOwn(value, requiredProperty)) {
        collector.push(`${paths.consumerRegistry} ${location}.${requiredProperty} is required by its JSON Schema.`);
      }
    }
    const properties = schema.properties ?? {};
    if (schema.additionalProperties === false) {
      for (const property of Object.keys(value)) {
        if (!Object.hasOwn(properties, property)) {
          collector.push(`${paths.consumerRegistry} ${location}.${property} is not allowed by its JSON Schema.`);
        }
      }
    }
    for (const [property, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, property)) {
        validateJsonSchema(value[property], propertySchema, `${location}.${property}`, collector);
      }
    }
  }

  if (actualType === 'array') {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      collector.push(`${paths.consumerRegistry} ${location} must contain at least ${schema.minItems} item(s).`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      collector.push(`${paths.consumerRegistry} ${location} must contain at most ${schema.maxItems} item(s).`);
    }
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) {
      collector.push(`${paths.consumerRegistry} ${location} must contain unique items.`);
    }
    for (const [index, itemSchema] of (schema.prefixItems ?? []).entries()) {
      if (index < value.length) {
        validateJsonSchema(value[index], itemSchema, `${location}[${index}]`, collector);
      }
    }
    const prefixLength = schema.prefixItems?.length ?? 0;
    if (schema.items === false && value.length > prefixLength) {
      collector.push(`${paths.consumerRegistry} ${location} must not contain items after index ${prefixLength - 1}.`);
    } else if (schema.items && typeof schema.items === 'object') {
      value
        .slice(prefixLength)
        .forEach((item, index) =>
          validateJsonSchema(item, schema.items, `${location}[${index + prefixLength}]`, collector),
        );
    }
  }

  if (actualType === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      collector.push(`${paths.consumerRegistry} ${location} must contain at least ${schema.minLength} character(s).`);
    }
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) {
      collector.push(`${paths.consumerRegistry} ${location} must match ${schema.pattern}.`);
    }
    if (schema.format === 'uri') {
      try {
        new URL(value);
      } catch {
        collector.push(`${paths.consumerRegistry} ${location} must be a valid URI.`);
      }
    }
  }

  if (actualType === 'number' && schema.minimum !== undefined && value < schema.minimum) {
    collector.push(`${paths.consumerRegistry} ${location} must be at least ${schema.minimum}.`);
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
]) {
  requireText('readme', command);
}
requireText('readme', 'npx ai-created-ui-agent consumer-status');
requireText('integration', 'npx ai-created-ui-agent consumer-status');
requireText('consumerCurrencyWorkflow', 'workflow_call:');
requireText('consumerCurrencyWorkflow', 'ai-created-ui-agent consumer-status');
validateJsonSchema(consumerRegistry, consumerRegistrySchema);
if (consumerRegistry.schemaVersion !== '2.0.0') {
  issues.push(`${paths.consumerRegistry} must publish schemaVersion 2.0.0.`);
}
const lifecycleOrder = consumerRegistry.lifecycle?.stageOrder;
const lifecycleStages = consumerRegistry.lifecycle?.stages;
if (Array.isArray(lifecycleOrder) && Array.isArray(lifecycleStages)) {
  const lifecycleIds = lifecycleStages.map(({ id }) => id);
  if (JSON.stringify(lifecycleIds) !== JSON.stringify(lifecycleOrder)) {
    issues.push(`${paths.consumerRegistry} lifecycle stages must exactly follow lifecycle.stageOrder.`);
  }
  lifecycleStages.forEach(({ id, nextStage }, index) => {
    const expectedNextStage = lifecycleOrder[index + 1] ?? null;
    if (nextStage !== expectedNextStage) {
      issues.push(
        `${paths.consumerRegistry} lifecycle stage ${id} must point to ${JSON.stringify(expectedNextStage)}.`,
      );
    }
  });
}
const registeredConsumers = Array.isArray(consumerRegistry.consumers)
  ? consumerRegistry.consumers
  : [];
const consumerRepositories = registeredConsumers.map(({ repository }) => repository);
if (new Set(consumerRepositories).size !== consumerRepositories.length) {
  issues.push(`${paths.consumerRegistry} contains duplicate repositories.`);
}
const consumerIds = registeredConsumers.map(({ id }) => id);
if (new Set(consumerIds).size !== consumerIds.length) {
  issues.push(`${paths.consumerRegistry} contains duplicate consumer ids.`);
}

for (const text of [
  'vX.Y.Z',
  'github-tags',
  'automerge: false',
  'existing Renovate configuration',
  'Existing applications stay on the version they installed',
]) {
  requireText('consumerAutomation', text);
}
requirePattern(
  'consumerAutomation',
  /(?:merge manually|manual(?:ly)?[\s\S]{0,80}merge)/iu,
  'a manual merge stage',
);
requirePattern(
  'consumerAutomation',
  /(?:(?:verify|confirm|check)[\s\S]{0,160}deploy|deploy[\s\S]{0,160}(?:verify|confirm|check))/iu,
  'a deployment verification stage',
);
requireText(
  'consumerAutomation',
  '## Optional currency monitoring',
  'optional currency monitoring',
);
for (const text of ['package.json', 'package-lock.json', 'validate:ui-update']) {
  if (text === 'validate:ui-update') continue;
  requireText('consumerAutomation', text);
}
for (const fileKey of ['consumerAutomation', 'consumerCompatibility', 'integration']) {
  rejectPattern(
    fileKey,
    /\b(?:ai-created\.com|Human, Actually|human-actually|ai-created-nextjs|applyanator)\b/u,
    'named consumer products or repositories',
  );
  rejectPattern(fileKey, /\bregistered consumer\b/iu, 'a central consumer registration requirement');
}
requireText('consumerCompatibility', 'No registration in this repository is required.');
requireText('consumerCompatibility', 'Consumer-owned compatibility checks');
for (const text of [
  '"github-tags"',
  '"automerge": false',
  '"separateMajorMinor": true',
  '"matchDepNames": ["@ai-created/ui"]',
]) {
  requireText('renovateExample', text);
}
rejectText('renovateExample', '"schedule"');
rejectText('renovateExample', '"enabled": false');
for (const fileKey of [
  'consumerAutomation',
  'consumerCompatibility',
  'integration',
  'release',
]) {
  rejectPattern(fileKey, /\bv1\.1\.0\b/u, 'fixed v1.1.0 operational examples; use vX.Y.Z');
}
requireText('release', 'vX.Y.Z');

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
  'A consumer may opt into Renovate',
]) {
  requireText('integration', text);
}

for (const destination of ['/foundations', '/components', '/guidelines', '/agents']) {
  requireText('homepage', `href: '${destination}'`, destination);
  requireText('header', `href: '${destination}'`, destination);
}
requireText('homepage', 'Design once. Build without drift.');
rejectText('header', "href: '/', label: 'Foundations'", 'Foundations pointing at the overview route');
requireText('foundationsRoute', 'https://ui.ai-created.com/foundations');

// The portal must derive countable system facts, never restate them.
requireText('systemFacts', "from '../../../design-system.manifest.json'", 'a canonical manifest import');
requireText('systemFacts', "from '../../../package.json'", 'a canonical package import');
requireText('releaseModule', "from '../../../package.json'", 'a canonical package import');
for (const fileKey of ['homepage', 'agentsPage']) {
  rejectPattern(
    fileKey,
    new RegExp(`\\bv?${packageJson.version.replace(/\./gu, '\\.')}\\b`, 'u'),
    'a hardcoded package version',
  );
}
requireText('header', "aria-current={active ? 'page' : undefined}", 'an active navigation state');

requireText('agentsPage', "'/guidelines/assets#agent-contract'", 'the canonical agent-contract reference');
requireText('agentsPage', 'Design once. Agents build without drift.');
for (const machineResource of [
  '/design-system/manifest.json',
  '/design-system/tokens.json',
  '/llms.txt',
  '/llms-full.txt',
  'AGENTS.md',
]) {
  requireText('agentsPage', machineResource);
}
for (const agentCommand of [
  'npm run agent:query -- context',
  'npm run agent:query -- templates',
  'npm run agent:check',
  'npm run validate',
]) {
  requireText('agentsPage', agentCommand);
}
requireText('agentsRoute', 'https://ui.ai-created.com/agents');
requireText('designSystem', '`/agents`', 'the /agents portal layer');
requireText('readme', 'https://ui.ai-created.com/agents');

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
