import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const manifestVersion = '1.0.0';
const schemaVersion = '1.0.0';
const schemaPath = 'contracts/design-system-manifest.schema.json';
const componentRegistryPath =
  'playground/src/components/design-system/specs/registry.ts';
const guidelineRegistryPath =
  'playground/src/components/design-system/principal-spec/registry.ts';
const tokenSourcePath = 'styles/tokens.css';
const tokenArtifactPath = 'playground/public/design-system/tokens.json';
const packageApiPath = 'src/index.ts';
const templateManifestPath = 'templates/agent/manifest.json';
const outputPaths = [
  'design-system.manifest.json',
  'playground/public/design-system/manifest.json',
];

const moduleCache = new Map();

function absolute(relativePath) {
  return path.join(packageRoot, relativePath);
}

async function exists(relativePath) {
  try {
    await access(absolute(relativePath));
    return true;
  } catch {
    return false;
  }
}

function resolveTypeScriptModule(specifier, importerPath) {
  if (!specifier.startsWith('.')) {
    throw new Error(
      `Registry ${importerPath} imports unsupported runtime module "${specifier}".`,
    );
  }

  const basePath = path.resolve(path.dirname(importerPath), specifier);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];

  for (const candidate of candidates) {
    if (ts.sys.fileExists(candidate)) return candidate;
  }

  throw new Error(
    `Unable to resolve registry import "${specifier}" from ${importerPath}.`,
  );
}

function formatDiagnostics(diagnostics) {
  return ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => packageRoot,
    getNewLine: () => '\n',
  });
}

/**
 * Loads data-only TypeScript registries in memory. This avoids generated
 * JavaScript, temporary directories, runtime dependencies, and writes during
 * --check.
 */
function loadTypeScriptRegistry(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath).exports;

  const source = ts.sys.readFile(resolvedPath);
  if (source === undefined) throw new Error(`Missing registry: ${resolvedPath}`);

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: resolvedPath,
    reportDiagnostics: true,
  });
  const errors = (transpiled.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length > 0) throw new Error(formatDiagnostics(errors));

  const loadedModule = { exports: {} };
  moduleCache.set(resolvedPath, loadedModule);
  const localRequire = (specifier) =>
    loadTypeScriptRegistry(resolveTypeScriptModule(specifier, resolvedPath));
  const wrapper = new vm.Script(
    `(function (exports, require, module, __filename, __dirname) {${transpiled.outputText}\n})`,
    { filename: resolvedPath },
  ).runInThisContext();

  wrapper(
    loadedModule.exports,
    localRequire,
    loadedModule,
    resolvedPath,
    path.dirname(resolvedPath),
  );
  return loadedModule.exports;
}

function resolvePublicSourcePath(modulePath) {
  const basePath = path.resolve(path.dirname(absolute(packageApiPath)), modulePath);
  const candidates = [
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];
  const resolved = candidates.find((candidate) => ts.sys.fileExists(candidate));
  if (!resolved) {
    throw new Error(
      `Public API module "${modulePath}" does not resolve from ${packageApiPath}.`,
    );
  }
  return path.relative(packageRoot, resolved).split(path.sep).join('/');
}

function readPublicApi(source) {
  const sourceFile = ts.createSourceFile(
    absolute(packageApiPath),
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const publicExports = [];

  for (const statement of sourceFile.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.moduleSpecifier ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    ) {
      continue;
    }

    const modulePath = statement.moduleSpecifier.text;
    const sourcePath = resolvePublicSourcePath(modulePath);
    for (const element of statement.exportClause.elements) {
      publicExports.push({
        name: element.name.text,
        localName: element.propertyName?.text ?? element.name.text,
        kind:
          statement.isTypeOnly || element.isTypeOnly ? 'type' : 'value',
        modulePath,
        sourcePath,
      });
    }
  }

  const duplicateNames = publicExports
    .map(({ name }) => name)
    .filter((name, index, names) => names.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    throw new Error(
      `Public API contains duplicate exports: ${[...new Set(duplicateNames)].join(', ')}.`,
    );
  }

  return publicExports.sort((left, right) =>
    left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
  );
}

function validatePublicApiSymbols(publicExports) {
  const configPath = absolute('tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) throw new Error(formatDiagnostics([configFile.error]));
  const config = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    packageRoot,
    undefined,
    configPath,
  );
  if (config.errors.length > 0) throw new Error(formatDiagnostics(config.errors));

  const program = ts.createProgram({
    rootNames: config.fileNames,
    options: config.options,
  });
  const sourceFile = program.getSourceFile(absolute(packageApiPath));
  if (!sourceFile) throw new Error(`TypeScript did not load ${packageApiPath}.`);
  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) throw new Error(`TypeScript did not resolve ${packageApiPath}.`);
  const symbols = new Map(
    checker.getExportsOfModule(moduleSymbol).map((symbol) => [symbol.name, symbol]),
  );

  for (const exportedSymbol of publicExports) {
    const alias = symbols.get(exportedSymbol.name);
    if (!alias) {
      throw new Error(`TypeScript cannot resolve public export ${exportedSymbol.name}.`);
    }
    const symbol =
      alias.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(alias) : alias;
    const requiredFlag =
      exportedSymbol.kind === 'type' ? ts.SymbolFlags.Type : ts.SymbolFlags.Value;
    if (!(symbol.flags & requiredFlag)) {
      throw new Error(
        `Public export ${exportedSymbol.name} is not a ${exportedSymbol.kind} symbol.`,
      );
    }
    const declarations = symbol.declarations ?? [];
    if (
      !declarations.some(
        (declaration) =>
          path.relative(packageRoot, declaration.getSourceFile().fileName)
            .split(path.sep)
            .join('/') === exportedSymbol.sourcePath,
      )
    ) {
      throw new Error(
        `Public export ${exportedSymbol.name} does not originate in ${exportedSymbol.sourcePath}.`,
      );
    }
  }
}

function readTokenNames(css) {
  return new Set(
    [...css.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) => `--${match[1]}`),
  );
}

function validateTokenReference(reference, tokenNames, context) {
  const references = reference.match(/--[a-z0-9-*]+/gi) ?? [];
  for (const token of references) {
    if (token.includes('*')) {
      const prefix = token.slice(0, token.indexOf('*'));
      if (![...tokenNames].some((name) => name.startsWith(prefix))) {
        throw new Error(`${context} references unknown token family ${token}.`);
      }
    } else if (!tokenNames.has(token)) {
      throw new Error(`${context} references unknown token ${token}.`);
    }
  }
}

async function validateComponents(componentSpecs, publicExports, tokenNames) {
  if (componentSpecs.length !== 22) {
    throw new Error(`Expected 22 component specs, received ${componentSpecs.length}.`);
  }

  const publicNames = new Set(publicExports.map(({ name }) => name));
  const ids = new Set();
  const slugs = new Set();
  for (const spec of componentSpecs) {
    if (ids.has(spec.id)) throw new Error(`Duplicate component id: ${spec.id}.`);
    if (slugs.has(spec.slug)) throw new Error(`Duplicate component slug: ${spec.slug}.`);
    ids.add(spec.id);
    slugs.add(spec.slug);

    if (!(await exists(spec.sourcePath))) {
      throw new Error(`Component ${spec.id} has missing source path ${spec.sourcePath}.`);
    }
    if (spec.construction?.governance?.canonicalSource !== spec.sourcePath) {
      throw new Error(
        `Component ${spec.id} governance source does not match ${spec.sourcePath}.`,
      );
    }
    for (const exportName of spec.packageExports) {
      if (!publicNames.has(exportName)) {
        throw new Error(`Component ${spec.id} references unknown export ${exportName}.`);
      }
    }
    for (const usage of spec.designTokens) {
      validateTokenReference(usage.token, tokenNames, `Component ${spec.id}`);
    }
  }
}

function validateGuidelines(guidelineSpecs, tokenNames) {
  const expectedSlugs = [
    'foundations',
    'construction',
    'patterns',
    'content',
    'accessibility',
    'governance',
    'assets',
  ];
  const slugs = guidelineSpecs.map(({ slug }) => slug);
  if (JSON.stringify(slugs) !== JSON.stringify(expectedSlugs)) {
    throw new Error(`Guideline registry order is incomplete: ${slugs.join(', ')}.`);
  }

  for (const guideline of guidelineSpecs) {
    if (!guideline.owner || !guideline.sourceOfTruth || guideline.sections.length === 0) {
      throw new Error(`Guideline ${guideline.slug} is missing operational metadata.`);
    }
    for (const section of guideline.sections) {
      for (const block of section.blocks) {
        if (block.type !== 'tokens') continue;
        for (const item of block.items) {
          if (item.cssVariable) {
            validateTokenReference(
              item.cssVariable,
              tokenNames,
              `Guideline ${guideline.slug}`,
            );
          }
        }
      }
    }
  }
}

function validationCommands(packageJson) {
  const commands = [
    ['typecheck', 'npm run typecheck', 'Validate package and portal TypeScript.'],
    ['lint', 'npm run lint', 'Validate source, scripts, tests, and portal conventions.'],
    ['test', 'npm run test', 'Run component and contract tests.'],
    ['tokens', 'npm run tokens:check', 'Reject stale generated design tokens.'],
    [
      'manifest',
      'node scripts/export-design-system-manifest.mjs --check',
      'Reject a stale or incomplete agent manifest.',
    ],
    ['tailwind', 'npm run tailwind:check', 'Reject framework mappings that drift from canonical tokens.'],
    ['api', 'npm run api:check', 'Reject documented props, controls, or imports that drift from the public TypeScript API.'],
    ['policy', 'npm run policy:check', 'Reject prohibited styling, imports, tokens, and primitive copies.'],
    ['templates', 'npm run templates:check', 'Compile and verify every approved page template and public export fixture.'],
    ['documentation', 'npm run docs:check', 'Reject stale public counts, routes, workflows, or propagation guidance.'],
    ['agent-context', 'npm run agent-context:check', 'Reject stale concise or full agent context artifacts.'],
    ['agent', 'npm run agent:check', 'Run the complete machine-readable anti-drift contract.'],
    ['portal', 'npm run build:playground', 'Build the specification portal.'],
    ['package', 'npm run package:check', 'Verify the distributable package contract.'],
    ['full', 'npm run validate', 'Run the repository validation gate.'],
  ];

  return commands.map(([id, command, purpose]) => {
    const scriptName = command.startsWith('npm run ') ? command.slice(8) : null;
    if (scriptName && packageJson.scripts[scriptName] === undefined) {
      throw new Error(`Manifest validation command references missing script ${scriptName}.`);
    }
    return { id, command, purpose, blocking: true };
  });
}

async function createManifest() {
  const [packageText, apiSource, tokenCss, templateManifestText] = await Promise.all([
    readFile(absolute('package.json'), 'utf8'),
    readFile(absolute(packageApiPath), 'utf8'),
    readFile(absolute(tokenSourcePath), 'utf8'),
    readFile(absolute(templateManifestPath), 'utf8'),
  ]);
  const packageJson = JSON.parse(packageText);
  const templateManifest = JSON.parse(templateManifestText);
  const componentModule = loadTypeScriptRegistry(absolute(componentRegistryPath));
  const guidelineModule = loadTypeScriptRegistry(absolute(guidelineRegistryPath));
  const componentSpecs = componentModule.componentSpecs;
  const guidelineSpecs = guidelineModule.guidelineSpecs;
  const publicExports = readPublicApi(apiSource);
  const tokenNames = readTokenNames(tokenCss);

  if (!Array.isArray(componentSpecs) || !Array.isArray(guidelineSpecs)) {
    throw new Error('Design-system registries did not expose serializable arrays.');
  }
  validatePublicApiSymbols(publicExports);
  await validateComponents(componentSpecs, publicExports, tokenNames);
  validateGuidelines(guidelineSpecs, tokenNames);
  if (!(await exists(tokenArtifactPath))) {
    throw new Error(`Token artifact is missing: ${tokenArtifactPath}.`);
  }
  if (!(await exists(schemaPath))) {
    throw new Error(`Manifest schema is missing: ${schemaPath}.`);
  }
  if (!Array.isArray(templateManifest.templates) || templateManifest.templates.length !== 6) {
    throw new Error('Agent template manifest must contain exactly six approved templates.');
  }

  const manifest = {
    $schema: schemaPath,
    manifestVersion,
    schemaVersion,
    package: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      sourcePath: 'package.json',
      publicApiPath: packageApiPath,
      entrypoints: Object.entries(packageJson.exports).map(([name, target]) => ({
        name,
        target,
      })),
    },
    canonicalSourcePrecedence: [
      {
        rank: 1,
        scope: 'runtime behavior and public API',
        paths: ['src/**', packageApiPath],
        authority: 'Production source is canonical for semantics, props, and behavior.',
      },
      {
        rank: 2,
        scope: 'design tokens',
        paths: [tokenSourcePath],
        authority: 'Token CSS is canonical. JSON and framework mappings are derived views.',
      },
      {
        rank: 3,
        scope: 'framework mappings',
        paths: ['tailwind-preset.js'],
        authority: 'The preset maps canonical semantic CSS variables into utilities.',
      },
      {
        rank: 4,
        scope: 'component and construction guidance',
        paths: [
          'playground/src/components/design-system/componentDocs.ts',
          'playground/src/components/design-system/specs/details.ts',
          'playground/src/components/design-system/specs/construction.ts',
          componentRegistryPath,
        ],
        authority: 'The merged registry is canonical for supported design and authoring guidance.',
      },
      {
        rank: 5,
        scope: 'system guidelines',
        paths: [guidelineRegistryPath],
        authority: 'The principal guideline registry is canonical for cross-component practice.',
      },
      {
        rank: 6,
        scope: 'narrative documentation',
        paths: ['AGENTS.md', 'DESIGN-SYSTEM.md', 'README.md', 'CLAUDE.md'],
        authority: 'Narrative documentation explains canonical sources and must not override them.',
      },
    ],
    artifacts: {
      manifest: {
        sourcePath: 'scripts/export-design-system-manifest.mjs',
        repositoryPath: outputPaths[0],
        publicPath: '/design-system/manifest.json',
        schemaPath,
        derived: true,
        authority: 'Consumption projection only. It never overrides canonical sources.',
      },
      tokens: {
        sourcePath: tokenSourcePath,
        repositoryPath: tokenArtifactPath,
        publicPath: '/design-system/tokens.json',
        format: 'DTCG-shaped JSON',
        cssVariableCount: tokenNames.size,
      },
      agentContext: {
        sourcePath: 'scripts/export-agent-context.mjs',
        conciseRepositoryPath: 'llms.txt',
        concisePublicPath: '/llms.txt',
        fullRepositoryPath: 'llms-full.txt',
        fullPublicPath: '/llms-full.txt',
        derived: true,
      },
      templates: {
        manifestPath: templateManifestPath,
        schemaPath: 'templates/agent/manifest.schema.json',
        packagePath: './templates/agent/manifest.json',
        templateCount: templateManifest.templates.length,
      },
      policy: {
        configPath: 'ai-created-ui.config.json',
        schemaPath: 'contracts/design-policy.schema.json',
        validatorPath: 'scripts/validate-design-policy.mjs',
      },
    },
    publicApi: {
      sourcePath: packageApiPath,
      exports: publicExports,
    },
    components: componentSpecs,
    guidelines: guidelineSpecs.map((guideline) => ({
      ...guideline,
      sourcePath: guidelineRegistryPath,
    })),
    validation: {
      policy: 'Every command is blocking. A change is publishable only when all commands pass.',
      commands: validationCommands(packageJson),
    },
  };

  const serialized = JSON.stringify(manifest);
  if (/[–—]/.test(serialized)) {
    throw new Error('Manifest content contains a prohibited en dash or em dash glyph.');
  }
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

async function checkOutput(outputPath, expected) {
  let actual;
  try {
    actual = await readFile(absolute(outputPath), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `Design-system manifest is missing at ${outputPath}. Run node scripts/export-design-system-manifest.mjs.`,
      );
    }
    throw error;
  }

  if (actual !== expected) {
    throw new Error(
      `Design-system manifest is stale at ${outputPath}. Run node scripts/export-design-system-manifest.mjs.`,
    );
  }
}

async function main() {
  const serialized = await createManifest();
  if (process.argv.includes('--check')) {
    for (const outputPath of outputPaths) await checkOutput(outputPath, serialized);
    if (
      (await readFile(absolute(outputPaths[0]), 'utf8')) !==
      (await readFile(absolute(outputPaths[1]), 'utf8'))
    ) {
      throw new Error('Repository and public manifest artifacts are not identical.');
    }
    console.log(`Design-system manifest is current (${outputPaths.join(', ')}).`);
    return;
  }

  for (const outputPath of outputPaths) {
    await mkdir(path.dirname(absolute(outputPath)), { recursive: true });
    await writeFile(absolute(outputPath), serialized);
  }
  console.log(`Wrote design-system manifest to ${outputPaths.join(' and ')}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
