import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = 'design-system.manifest.json';
const templateManifestPath = 'templates/agent/manifest.json';
const outputs = {
  concise: ['llms.txt', 'playground/public/llms.txt'],
  full: ['llms-full.txt', 'playground/public/llms-full.txt'],
};

const absolute = (relativePath) => path.join(packageRoot, relativePath);

function lineList(values, fallback = 'None documented.') {
  return values?.length ? values.map((value) => `- ${value}`).join('\n') : `- ${fallback}`;
}

function renderApi(api) {
  if (!api?.length) return '- No public props documented.';
  return api
    .map((item) => {
      const defaultCopy = item.defaultValue === undefined ? '' : ` Default: ${item.defaultValue}.`;
      return `- \`${item.prop}\`: \`${item.type}\`.${defaultCopy} ${item.description}`;
    })
    .join('\n');
}

function renderComponent(component) {
  const construction = component.construction ?? {};
  const governance = construction.governance ?? {};
  const designAsset = construction.asset ?? {};
  const implementation = component.implementation ?? {};
  const accessibility = component.accessibilitySpec ?? {};
  const tokens = component.designTokens?.map(({ token, purpose }) => `${token}: ${purpose}`);
  const keyboard = component.keyboard?.map(({ key, action }) => `${key}: ${action}`);
  const recipes = implementation.recipes?.map(
    ({ name, description, code }) => `${name}: ${description}\n\n\`\`\`tsx\n${code}\n\`\`\``,
  );
  const limitations = construction.limitations ?? {};
  const authoringLimits = [
    ...(limitations.figma ?? []).map((value) => `Design-tool limit: ${value}`),
    ...(limitations.code ?? []).map((value) => `Code limit: ${value}`),
    ...(limitations.notApplicable ?? []).map((value) => `Not applicable: ${value}`),
  ];

  return `## ${component.name} (\`${component.id}\`)

${component.summary}

- Category: ${component.category}
- Source: \`${component.sourcePath}\`
- Public exports: ${component.packageExports.map((name) => `\`${name}\``).join(', ')}
- Import: \`${implementation.importStatement ?? 'See public package exports.'}\`
- Client component: ${implementation.clientComponent ? 'yes' : 'no'}
- Design asset: ${designAsset.figmaName ?? 'Not applicable'}
- Maturity: ${governance.status ?? 'Not documented'}
- Owner: ${governance.ownerRole ?? 'Not documented'}

### Use when

${lineList(component.useWhen)}

### Avoid when

${lineList(component.avoidWhen)}

### Public API

${renderApi(component.api)}

### States

${lineList(component.stateDefinitions?.map(({ name, trigger, behavior }) => `${name}: ${trigger} ${behavior}`))}

### Keyboard

${lineList(keyboard)}

### Accessibility

- Semantics: ${accessibility.semantics ?? 'See component source.'}
- Accessible name: ${accessibility.accessibleName ?? 'See component source.'}
${lineList(accessibility.requirements)}

### Tokens

${lineList(tokens)}

### Composition

${lineList(component.composition)}

### Implementation notes

${lineList(implementation.notes)}

### Recipes

${lineList(recipes)}

### Content and authoring limits

${lineList(construction.contentLimits?.map(({ target, limit, overflowBehavior }) => `${target}: ${limit}. ${overflowBehavior}`))}
${lineList(authoringLimits)}

### Required tests

${lineList([
    ...(component.testing?.unit ?? []).map((value) => `Unit: ${value}`),
    ...(component.testing?.interaction ?? []).map((value) => `Interaction: ${value}`),
    ...(component.testing?.accessibility ?? []).map((value) => `Accessibility: ${value}`),
    ...(component.testing?.visual ?? []).map((value) => `Visual: ${value}`),
  ])}`;
}

function renderGuideline(guideline) {
  const sections = guideline.sections
    .map((section) => `- \`${section.id}\` ${section.title}: ${section.summary}`)
    .join('\n');
  return `## ${guideline.index}. ${guideline.title} (\`${guideline.slug}\`)

${guideline.summary}

- Status: ${guideline.status}
- Owner: ${guideline.owner}
- Review cycle: ${guideline.reviewCycle}
- Source of truth: ${guideline.sourceOfTruth}

${sections}`;
}

function renderTemplate(template) {
  return `## ${template.title} (\`${template.id}\`)

${template.whenToUse}

- Archetype: \`${template.archetype}/${template.subtype}\`
- Source: \`${template.source}\`
- Export: \`${template.export}\`
- Required states: ${template.states.join(', ')}
- Slots: ${template.slots.join(', ')}
- Public imports: ${template.imports.join(', ')}`;
}

function renderConsumerLifecycle() {
  return `## Downstream consumer lifecycle

1. Install an immutable \`vX.Y.Z\` tag. Existing sites remain on that release until their owner deliberately adopts another one; consumers never follow \`main\`.
2. Opt into update discovery with Renovate. Merge the documented \`@ai-created/ui\` package rule into the consumer's own Renovate configuration; no central registration is required.
3. Renovate detects a newer GitHub tag and opens a pull request that updates both \`package.json\` and \`package-lock.json\`. The consumer owns any optional schedule and Dependency Dashboard settings.
4. Run the consumer's own install, typecheck, lint, tests, design-policy validation, accessibility checks, and production build. Provider previews may help review but do not replace those compatibility checks.
5. Review release notes and visible or behavioral impact, then merge manually. Design-system dependency updates do not auto-merge.
6. Verify the consumer's normal deployment completed and smoke-test the affected workflow.
7. Optionally run \`npx ai-created-ui-agent consumer-status\` on a schedule to make staleness visible. This command reports status; it does not update, merge, or deploy the consumer.

Use \`docs/consumer-update-automation.md\` for setup, configuration, review, troubleshooting, and removal. Use \`docs/examples/consumer-renovate.json\` as a standalone example or copy only its package rule into an existing Renovate configuration.`;
}

function createConcise(manifest, templates) {
  return `# @ai-created/ui agent entrypoint

This repository and package include a machine-readable design-system contract for AI agents. Never infer component props, variants, tokens, or behavior from model memory.

## Required sequence

1. Read \`design-system.manifest.json\` or query it with \`npm run agent:query -- component <id>\`.
2. For page-level work, select a reviewed archetype with \`npm run agent:query -- templates\`.
3. Import only public APIs from \`@ai-created/ui\`.
4. Use semantic tokens through the shared CSS and Tailwind preset. Never consume \`--ref-*\` values in product UI.
5. Implement every applicable loading, empty, error, permission, disabled, focus, and responsive state.
6. Run \`npm run agent:check\`. A justified departure requires a scoped, owned, expiring exception in \`ai-created-ui.config.json\`.

## Canonical authority

${manifest.canonicalSourcePrecedence.map(({ rank, scope, paths }) => `${rank}. ${scope}: ${paths.map((value) => `\`${value}\``).join(', ')}`).join('\n')}

The generated manifest is a consumption projection only. It never overrides canonical source.

## Appearance and accent contract

- The supported \`accentNames\` are \`red\`, \`green\`, \`blue\`, \`orange\`, \`yellow\`, \`purple\`, \`teal\`, \`pink\`, and \`magenta\`. Accent-aware semantic tokens follow the selected accent; destructive and status tokens remain fixed.
- The public appearance APIs are \`ThemeProvider\`, \`useTheme\`, \`accentNames\`, and the \`Accent\` type.
- For a fixed product accent, use controlled mode with \`<ThemeProvider accent="blue">\`. \`onAccentChange\` reports requested changes in either mode, but controlled mode does not persist them. Render the matching \`data-accent\` on the root document before paint; do not initialize a fixed choice from saved preferences.
- For a persisted user preference, use uncontrolled mode with \`<ThemeProvider defaultAccent="blue">\`. Resolution order is valid \`localStorage["accent"]\`, existing \`html[data-accent]\`, \`defaultAccent\`, then \`red\`. \`setAccent\` persists changes and calls \`onAccentChange\` in uncontrolled mode. Before hydration, server-render the fallback \`html[data-accent]\` that matches \`defaultAccent\` and replace it with any valid stored accent so the first paint matches the resolved preference.

## Machine resources

- Full context: \`llms-full.txt\` or \`/llms-full.txt\`
- Component and guideline contract: \`design-system.manifest.json\` or \`/design-system/manifest.json\`
- DTCG-shaped tokens: \`/design-system/tokens.json\`
- Page templates: \`templates/agent/manifest.json\`
- Universal operating rules: \`AGENTS.md\`
- Query CLI: \`npm run agent:query -- <command>\`
- Consumer currency check: \`npx ai-created-ui-agent consumer-status\`
- Human and operator runbook: \`docs/consumer-update-automation.md\`

${renderConsumerLifecycle()}

## Coverage

- ${manifest.components.length} documented component, provider, utility, and motion families
- ${manifest.publicApi.exports.length} verified public exports
- ${manifest.guidelines.length} principal guideline chapters
- ${templates.templates.length} production page templates
`;
}

function createFull(manifest, templates) {
  return `# @ai-created/ui complete agent reference

This file is generated. Do not edit it directly. Canonical sources are listed below, and the machine-readable equivalent is \`design-system.manifest.json\`.

## Source precedence

${manifest.canonicalSourcePrecedence.map(({ rank, scope, paths, authority }) => `${rank}. **${scope}** (${paths.map((value) => `\`${value}\``).join(', ')}): ${authority}`).join('\n')}

## Non-negotiable build rules

- Use public imports from \`@ai-created/ui\` only.
- Import \`@ai-created/ui/styles/tokens.css\` once and load \`@ai-created/ui/tailwind-preset\`.
- Use semantic token names and approved component variants. Do not invent raw colors, fonts, radii, shadows, primitive copies, or internal imports.
- Compose existing primitives before adding a local abstraction.
- Use native semantics and each component's documented keyboard and accessibility contract.
- Preserve DOM order across responsive layouts.
- Implement all applicable exceptional states.
- Treat \`className\` as a composition hook, not a second visual language.
- Run \`npm run agent:check\` before handoff.

${renderConsumerLifecycle()}

# Components

${manifest.components.map(renderComponent).join('\n\n')}

# Principal guidelines

${manifest.guidelines.map(renderGuideline).join('\n\n')}

# Approved page templates

${templates.templates.map(renderTemplate).join('\n\n')}

# Drift and exception policy

Run \`npm run policy:check -- <paths...>\` in a consumer repository. The validator rejects raw color values and stock palette utilities, direct reference-token use, internal package imports, unapproved font, radius, shadow, and arbitrary color values, and detectable local primitive copies. A zero-file scan fails unless the caller explicitly passes \`--allow-empty\`. A necessary exception must name one rule, narrowly scoped files, a concrete reason, an owner, and a future review date. Expired exceptions fail validation.

# Validation commands

${manifest.validation.commands.map(({ command, purpose }) => `- \`${command}\`: ${purpose}`).join('\n')}
`;
}

async function checkOutput(outputPath, expected) {
  try {
    await access(absolute(outputPath));
  } catch {
    throw new Error(`Agent context is missing at ${outputPath}. Run npm run agent-context:export.`);
  }
  const actual = await readFile(absolute(outputPath), 'utf8');
  if (actual !== expected) {
    throw new Error(`Agent context is stale at ${outputPath}. Run npm run agent-context:export.`);
  }
}

async function main() {
  const [manifest, templates] = await Promise.all([
    readFile(absolute(manifestPath), 'utf8').then(JSON.parse),
    readFile(absolute(templateManifestPath), 'utf8').then(JSON.parse),
  ]);
  const content = {
    concise: createConcise(manifest, templates),
    full: createFull(manifest, templates),
  };

  for (const value of Object.values(content)) {
    if (/[–—]/.test(value)) throw new Error('Agent context contains a prohibited en dash or em dash glyph.');
  }

  if (process.argv.includes('--check')) {
    for (const [kind, outputPaths] of Object.entries(outputs)) {
      for (const outputPath of outputPaths) await checkOutput(outputPath, content[kind]);
    }
    console.log('Agent context is current (llms.txt and llms-full.txt).');
    return;
  }

  for (const [kind, outputPaths] of Object.entries(outputs)) {
    for (const outputPath of outputPaths) {
      await mkdir(path.dirname(absolute(outputPath)), { recursive: true });
      await writeFile(absolute(outputPath), content[kind]);
    }
  }
  console.log('Wrote llms.txt and llms-full.txt for the package and portal.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
