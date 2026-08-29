import { spawnSync } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const templatesDirectory = path.join(packageRoot, 'templates/agent');
const fixtureDirectory = path.join(packageRoot, 'tests/fixtures/agent-consumer');
const fixturePackagePath = path.join(fixtureDirectory, 'package.fixture.json');
const manifestPath = path.join(templatesDirectory, 'manifest.json');
const requiredChecks = new Set([
  'node scripts/verify-agent-templates.mjs',
  'npm run typecheck',
  'npm run lint',
]);
const canonicalArchetypes = new Set(['home', 'browse', 'detail', 'context', 'workspace']);

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function listSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listSourceFiles(entryPath) : [entryPath];
  }));
  return files.flat().filter((file) => /\.(?:ts|tsx)$/.test(file)).sort();
}

function parseSource(filePath, source) {
  return ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}

function publicValueImports(sourceFile) {
  const imports = new Set();
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== '@ai-created/ui') continue;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly || !clause.namedBindings || !ts.isNamedImports(clause.namedBindings)) continue;
    for (const element of clause.namedBindings.elements) {
      if (!element.isTypeOnly) imports.add((element.propertyName ?? element.name).text);
    }
  }
  return imports;
}

function publicRuntimeExports(sourceFile) {
  const exports = new Set();
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly || !statement.exportClause) continue;
    if (!ts.isNamedExports(statement.exportClause)) continue;
    for (const element of statement.exportClause.elements) {
      if (!element.isTypeOnly) exports.add(element.name.text);
    }
  }
  return exports;
}

function stringLiteralsWithin(node) {
  const values = [];
  function visit(child) {
    if (ts.isStringLiteral(child) || ts.isNoSubstitutionTemplateLiteral(child)) values.push(child.text);
    ts.forEachChild(child, visit);
  }
  visit(node);
  return values;
}

function validateTemplateSource(template, filePath, source) {
  const sourceFile = parseSource(filePath, source);
  const imports = publicValueImports(sourceFile);
  const declaredImports = new Set(template.imports);
  invariant(imports.size === declaredImports.size, `${template.id}: manifest imports do not match source imports`);
  for (const imported of imports) {
    invariant(declaredImports.has(imported), `${template.id}: ${imported} is missing from manifest imports`);
  }

  invariant(!source.includes('@ai-created/ui/src'), `${template.id}: internal package import is forbidden`);
  invariant(!/from\s+['"]\.\.?\//.test(source), `${template.id}: templates must not depend on private relative modules`);
  invariant(!/#[\da-f]{3,8}\b/i.test(source), `${template.id}: raw color value is forbidden`);
  invariant(!/\b(?:bg|border|text)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/.test(source), `${template.id}: non-semantic palette utility is forbidden`);

  for (const node of sourceFile.statements) {
    function visit(child) {
      if (ts.isJsxAttribute(child) && child.name.text === 'className' && child.initializer) {
        const classValues = stringLiteralsWithin(child.initializer);
        invariant(!classValues.some((value) => value.includes('[') || value.includes(']')), `${template.id}: arbitrary Tailwind values are forbidden`);
      }
      ts.forEachChild(child, visit);
    }
    visit(node);
  }

  const namedDefaultExport = sourceFile.statements.some(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === template.export &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
  invariant(namedDefaultExport, `${template.id}: expected named default export ${template.export}`);
}

function formatDiagnostics(diagnostics) {
  return diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (!diagnostic.file || diagnostic.start === undefined) return message;
    const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const relativeFile = path.relative(packageRoot, diagnostic.file.fileName);
    return `${relativeFile}:${position.line + 1}:${position.character + 1} ${message}`;
  }).join('\n');
}

function compileSources(rootNames) {
  const program = ts.createProgram({
    rootNames,
    options: {
      target: ts.ScriptTarget.ES2020,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      isolatedModules: true,
      resolveJsonModule: true,
      baseUrl: packageRoot,
      ignoreDeprecations: '6.0',
      paths: {
        '@ai-created/ui': ['src/index.ts'],
        '@ai-created/ui/*': ['*'],
      },
    },
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  invariant(diagnostics.length === 0, `Agent templates failed TypeScript compilation:\n${formatDiagnostics(diagnostics)}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
invariant(manifest.schemaVersion === '1.0.0', 'Unsupported agent template manifest version');
invariant(manifest.package === '@ai-created/ui', 'Agent template manifest must target @ai-created/ui');
invariant(Array.isArray(manifest.templates) && manifest.templates.length === 6, 'Manifest must contain exactly six golden-path templates');

const ids = new Set();
const sources = new Set();
for (const template of manifest.templates) {
  invariant(typeof template.id === 'string' && template.id.length > 0, 'Every template needs an id');
  invariant(!ids.has(template.id), `Duplicate template id: ${template.id}`);
  ids.add(template.id);
  invariant(canonicalArchetypes.has(template.archetype), `${template.id}: unknown top-level archetype ${template.archetype}`);
  invariant(typeof template.subtype === 'string' && template.subtype.length > 0, `${template.id}: subtype is required`);
  invariant(typeof template.whenToUse === 'string' && template.whenToUse.length > 20, `${template.id}: whenToUse must be operational`);
  invariant(Array.isArray(template.slots) && template.slots.length >= 3, `${template.id}: at least three slots are required`);
  invariant(Array.isArray(template.states) && template.states.length >= 4, `${template.id}: at least four states are required`);
  invariant(template.states.includes('error') && template.states.includes('forbidden'), `${template.id}: error and forbidden states are required`);
  invariant(Array.isArray(template.requiredChecks), `${template.id}: requiredChecks must be an array`);
  for (const check of requiredChecks) invariant(template.requiredChecks.includes(check), `${template.id}: missing required check ${check}`);
  invariant(template.source.startsWith('templates/agent/') && template.source.endsWith('.tsx'), `${template.id}: source must stay in templates/agent`);
  invariant(!sources.has(template.source), `${template.id}: source is already registered`);
  sources.add(template.source);

  const absoluteSource = path.join(packageRoot, template.source);
  invariant((await stat(absoluteSource)).isFile(), `${template.id}: source file does not exist`);
  validateTemplateSource(template, absoluteSource, await readFile(absoluteSource, 'utf8'));
}

const templateFiles = (await listSourceFiles(templatesDirectory))
  .map((file) => path.relative(packageRoot, file).split(path.sep).join('/'));
invariant(templateFiles.length === sources.size, 'Every TSX template source must be registered exactly once');
for (const file of templateFiles) invariant(sources.has(file), `Unregistered template source: ${file}`);

const fixtureSources = await listSourceFiles(fixtureDirectory);
invariant(
  !(await pathExists(path.join(fixtureDirectory, 'package.json'))),
  'Consumer test fixtures must not contain package.json because deployment platforms can misidentify them as applications'
);
const fixturePackage = JSON.parse(await readFile(fixturePackagePath, 'utf8'));
invariant(fixturePackage.private === true, 'Consumer fixture metadata must remain private');
invariant(
  fixturePackage.dependencies?.['@ai-created/ui'] === 'file:../../..',
  'Consumer fixture metadata must target the repository public package'
);
invariant(
  typeof fixturePackage.dependencies?.next === 'string',
  'Consumer fixture metadata must document Next.js compatibility'
);
const fixtureImports = new Set();
for (const file of fixtureSources) {
  const source = await readFile(file, 'utf8');
  for (const imported of publicValueImports(parseSource(file, source))) fixtureImports.add(imported);
}
const indexPath = path.join(packageRoot, 'src/index.ts');
const runtimeExports = publicRuntimeExports(parseSource(indexPath, await readFile(indexPath, 'utf8')));
const missingRuntimeExports = [...runtimeExports].filter((exported) => !fixtureImports.has(exported));
invariant(missingRuntimeExports.length === 0, `Consumer fixture misses runtime exports: ${missingRuntimeExports.join(', ')}`);

const globalCss = await readFile(path.join(fixtureDirectory, 'app/globals.css'), 'utf8');
const tailwindConfig = await readFile(path.join(fixtureDirectory, 'tailwind.config.cjs'), 'utf8');
invariant(globalCss.includes("@import '@ai-created/ui/styles/tokens.css';"), 'Consumer fixture must import public token CSS');
invariant(tailwindConfig.includes("require('@ai-created/ui/tailwind-preset')"), 'Consumer fixture must load the public Tailwind preset');
invariant(tailwindConfig.includes('presets: [aiCreatedPreset]'), 'Consumer fixture must register the shared preset');

compileSources([
  ...[...sources].map((source) => path.join(packageRoot, source)),
  ...fixtureSources,
]);

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packageResult = spawnSync(npmCommand, ['pkg', 'get', 'name'], {
  cwd: packageRoot,
  encoding: 'utf8',
});
invariant(packageResult.status === 0 && packageResult.stdout.includes('@ai-created/ui'), 'Public package identity could not be verified');

console.log(`Agent templates verified: ${manifest.templates.length} templates, ${runtimeExports.size} runtime exports, clean consumer compilation.`);
