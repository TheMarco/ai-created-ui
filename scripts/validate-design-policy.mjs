#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const POLICY_VERSION = '1.0.0';
const DEFAULT_EXTENSIONS = ['.css', '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'];
const KNOWN_RULES = new Set([
  'no-reference-token',
  'no-raw-color',
  'no-internal-package-import',
  'no-theme-palette',
  'no-arbitrary-style-value',
  'no-local-primitive',
]);
const RAW_PALETTES = new Set([
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'black', 'white',
]);
const COLOR_UTILITY_PREFIXES = new Set([
  'bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'via', 'to',
  'accent', 'caret', 'decoration', 'placeholder', 'outline', 'divide',
]);

function usage() {
  return `Usage: node scripts/validate-design-policy.mjs [options] [target ...]

Targets default to src.

Options:
  --config <path>   Read policy configuration from this JSON file.
  --json            Emit one machine-readable JSON result.
  --format json     Alias for --json.
  --allow-empty     Permit a successful scan when no files match the targets.
  --help            Show this help.`;
}

function parseArguments(argv) {
  const targets = [];
  let configPath = 'ai-created-ui.config.json';
  let json = false;
  let allowEmpty = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    if (argument === '--json') {
      json = true;
      continue;
    }
    if (argument === '--allow-empty') {
      allowEmpty = true;
      continue;
    }
    if (argument === '--format') {
      const format = argv[index + 1];
      if (format !== 'json' && format !== 'human') {
        throw new Error('--format must be "json" or "human".');
      }
      json = format === 'json';
      index += 1;
      continue;
    }
    if (argument === '--config') {
      configPath = argv[index + 1];
      if (!configPath) throw new Error('--config requires a path.');
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) throw new Error(`Unknown option: ${argument}`);
    targets.push(argument);
  }

  return { allowEmpty, configPath, help: false, json, targets: targets.length > 0 ? targets : ['src'] };
}

function slash(value) {
  return value.split(path.sep).join('/').replace(/^\.\//, '');
}

function globToRegExp(glob) {
  let expression = '^';
  const normalized = slash(glob);

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    if (character === '*') {
      if (normalized[index + 1] === '*') {
        const followedBySlash = normalized[index + 2] === '/';
        expression += followedBySlash ? '(?:.*/)?' : '.*';
        index += followedBySlash ? 2 : 1;
      } else {
        expression += '[^/]*';
      }
      continue;
    }
    if (character === '?') {
      expression += '[^/]';
      continue;
    }
    expression += character.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
  }

  return new RegExp(`${expression}$`);
}

function matchesAny(relativePath, globs) {
  const normalized = slash(relativePath);
  return globs.some((glob) => globToRegExp(glob).test(normalized));
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function validCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function exceptionProblems(exceptions) {
  if (!Array.isArray(exceptions)) return ['exceptions must be an array.'];
  const problems = [];
  const vagueReasons = /^(?:temporary|temp|needed|required|exception|legacy|n\/?a|tbd|todo|fix later|workaround)[.!]?$/i;
  const broadGlobs = new Set(['*', '**', '**/*', '.', './']);

  exceptions.forEach((exception, index) => {
    const label = `exceptions[${index}]`;
    if (!exception || typeof exception !== 'object' || Array.isArray(exception)) {
      problems.push(`${label} must be an object.`);
      return;
    }
    if (!KNOWN_RULES.has(exception.rule)) {
      problems.push(`${label}.rule must name a supported policy rule.`);
    }
    if (
      !Array.isArray(exception.files) ||
      exception.files.length === 0 ||
      exception.files.some((file) => typeof file !== 'string' || file.trim() === '' || broadGlobs.has(file.trim()))
    ) {
      problems.push(`${label}.files must contain specific paths or scoped globs; repository-wide globs are forbidden.`);
    }
    if (
      typeof exception.reason !== 'string' ||
      exception.reason.trim().length < 20 ||
      vagueReasons.test(exception.reason.trim())
    ) {
      problems.push(`${label}.reason must be a concrete explanation of at least 20 characters.`);
    }
    if (typeof exception.owner !== 'string' || exception.owner.trim().length < 3) {
      problems.push(`${label}.owner must identify an accountable person or team.`);
    }
    if (typeof exception.reviewBy !== 'string' || !validCalendarDate(exception.reviewBy)) {
      problems.push(`${label}.reviewBy must be a real date in YYYY-MM-DD format.`);
    }
  });

  return problems;
}

function configProblems(config) {
  const problems = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return ['The policy configuration must be a JSON object.'];
  }
  if (config.policyVersion !== POLICY_VERSION) {
    problems.push(`policyVersion must be "${POLICY_VERSION}".`);
  }
  if (typeof config.canonicalPackage !== 'string' || config.canonicalPackage.trim() === '') {
    problems.push('canonicalPackage must be a non-empty package name.');
  }
  for (const key of ['ignore', 'canonicalTokenSources', 'canonicalPrimitiveSources', 'canonicalPrimitives']) {
    if (!Array.isArray(config[key]) || config[key].some((value) => typeof value !== 'string')) {
      problems.push(`${key} must be an array of strings.`);
    }
  }
  if (
    config.extensions !== undefined &&
    (!Array.isArray(config.extensions) ||
      config.extensions.length === 0 ||
      config.extensions.some(
        (extension) => typeof extension !== 'string' || !/^\.[a-z0-9]+$/i.test(extension)
      ))
  ) {
    problems.push('extensions must be a non-empty array of file extensions beginning with a period.');
  }
  if (
    !Array.isArray(config.approvedArchetypes) ||
    config.approvedArchetypes.length === 0 ||
    config.approvedArchetypes.some(
      (archetype) =>
        !archetype ||
        typeof archetype !== 'object' ||
        typeof archetype.id !== 'string' ||
        archetype.id.trim() === '' ||
        typeof archetype.description !== 'string' ||
        archetype.description.trim().length < 10
    )
  ) {
    problems.push('approvedArchetypes must contain documented id and description entries.');
  }
  problems.push(...exceptionProblems(config.exceptions));
  return problems;
}

async function collectFiles(targets, cwd, configDir, config) {
  const files = [];
  const extensions = new Set(config.extensions ?? DEFAULT_EXTENSIONS);

  async function visit(absolutePath) {
    const relativeToConfig = slash(path.relative(configDir, absolutePath));
    if (matchesAny(relativeToConfig, config.ignore)) return;

    const details = await stat(absolutePath);
    if (details.isDirectory()) {
      const entries = await readdir(absolutePath, { withFileTypes: true });
      await Promise.all(
        entries
          .filter((entry) => !entry.isSymbolicLink())
          .map((entry) => visit(path.join(absolutePath, entry.name)))
      );
      return;
    }
    if (details.isFile() && extensions.has(path.extname(absolutePath))) files.push(absolutePath);
  }

  for (const target of targets) {
    await visit(path.resolve(cwd, target));
  }

  return [...new Set(files)].sort();
}

function locationAt(source, index) {
  const before = source.slice(0, index);
  const lines = before.split('\n');
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

function excerptAt(source, line) {
  return source.split(/\r?\n/)[line - 1]?.trim().slice(0, 240) ?? '';
}

function addPatternDiagnostics(diagnostics, source, file, rule, message, pattern) {
  for (const match of source.matchAll(pattern)) {
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule,
      message,
      excerpt: excerptAt(source, location.line),
    });
  }
}

function arbitraryValueDiagnostics(source, file, diagnostics) {
  const candidatePattern = /(?:[a-z0-9-]+:)*(?:bg|text|border|ring|fill|stroke|from|via|to|accent|caret|decoration|placeholder|outline|divide|font|rounded(?:-[trblxy]{1,2})?|shadow)-\[[^\]\r\n]+\]/gi;
  const colorValue = /^(?:#|rgba?\(|hsla?\(|color\(|oklch\(|lab\(|lch\(|var\(|--)/i;

  for (const match of source.matchAll(candidatePattern)) {
    const className = match[0];
    const utility = className.slice(className.lastIndexOf(':') + 1);
    const prefix = utility.slice(0, utility.indexOf('-['));
    const value = utility.slice(utility.indexOf('[') + 1, -1).trim();
    const forbidden =
      prefix === 'font' ||
      prefix.startsWith('rounded') ||
      prefix === 'shadow' ||
      (COLOR_UTILITY_PREFIXES.has(prefix) && colorValue.test(value));

    if (!forbidden) continue;
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule: 'no-arbitrary-style-value',
      message: `Replace arbitrary Tailwind value "${className}" with a named design-system token or primitive.`,
      excerpt: excerptAt(source, location.line),
    });
  }

  const allowedRadiusValues = new Set(['none', 'sm', 'md', 'lg', 'full']);
  const radiusDirections = new Set(['t', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl', 's', 'e', 'ss', 'se', 'es', 'ee', 'x', 'y']);
  const radiusPattern = /(?<![a-z0-9_-])(?:[a-z0-9-]+:)*rounded(?:-[a-z0-9]+){0,2}(?![a-z0-9_-])/gi;

  for (const match of source.matchAll(radiusPattern)) {
    const className = match[0];
    const utility = className.slice(className.lastIndexOf(':') + 1);
    const parts = utility.split('-').slice(1);
    if (parts.length === 0) continue;
    const value = radiusDirections.has(parts[0]) ? parts[1] : parts[0];
    if (value === undefined || allowedRadiusValues.has(value)) continue;
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule: 'no-arbitrary-style-value',
      message: `Replace unapproved radius utility "${className}" with rounded-none, rounded-sm, rounded-md, rounded-lg, or rounded-full.`,
      excerpt: excerptAt(source, location.line),
    });
  }

  const shadowPattern = /(?<![a-z0-9_-])(?:[a-z0-9-]+:)*shadow(?:-[a-z0-9-]+)?(?![a-z0-9_[-])/gi;
  const allowedShadowUtilities = new Set([
    'shadow-none',
    'shadow-elevation-low',
    'shadow-elevation-medium',
    'shadow-elevation-high',
  ]);

  for (const match of source.matchAll(shadowPattern)) {
    const className = match[0];
    const utility = className.slice(className.lastIndexOf(':') + 1);
    if (allowedShadowUtilities.has(utility)) continue;
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule: 'no-arbitrary-style-value',
      message: `Replace unapproved shadow utility "${className}" with shadow-none or shadow-elevation-low/medium/high.`,
      excerpt: excerptAt(source, location.line),
    });
  }
}

function themePaletteDiagnostics(source, file, diagnostics) {
  const candidatePattern = /(?<![a-z0-9_-])(?:[a-z0-9-]+:)*(?:bg|text|border|ring|fill|stroke|from|via|to|accent|caret|decoration|placeholder|outline|divide)-[a-z]+(?:-\d{2,3})?(?:\/[0-9]+)?(?![a-z0-9_/-])/gi;

  for (const match of source.matchAll(candidatePattern)) {
    const className = match[0];
    const utility = className.slice(className.lastIndexOf(':') + 1);
    const colorValue = utility
      .replace(/^(?:bg|text|border|ring|fill|stroke|from|via|to|accent|caret|decoration|placeholder|outline|divide)-/, '')
      .split('/')[0];
    const [palette, shade, ...rest] = colorValue.split('-');
    const isStockPalette =
      RAW_PALETTES.has(palette) &&
      rest.length === 0 &&
      ((palette === 'black' || palette === 'white') ? shade === undefined : /^\d{2,3}$/.test(shade ?? ''));
    if (!isStockPalette) continue;
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule: 'no-theme-palette',
      message: `Replace stock palette utility "${className}" with a semantic utility that resolves through design-system tokens.`,
      excerpt: excerptAt(source, location.line),
    });
  }
}

function localPrimitiveDiagnostics(source, file, diagnostics, config, configRelativePath) {
  if (matchesAny(configRelativePath, config.canonicalPrimitiveSources)) return;
  const primitiveSet = new Set(config.canonicalPrimitives);
  const importPattern = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

  for (const match of source.matchAll(importPattern)) {
    const [, bindings, importPath] = match;
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) continue;
    const usedPrimitives = [...primitiveSet].filter((primitive) =>
      new RegExp(`\\b${primitive}\\b`).test(bindings)
    );
    if (usedPrimitives.length === 0) continue;
    const location = locationAt(source, match.index);
    diagnostics.push({
      file,
      ...location,
      rule: 'no-local-primitive',
      message: `Import ${usedPrimitives.join(', ')} from ${config.canonicalPackage}; local primitive imports can drift from the canonical implementation.`,
      excerpt: excerptAt(source, location.line),
    });
  }

  for (const primitive of primitiveSet) {
    const declarationPattern = new RegExp(`\\b(?:function|class|const|let|var)\\s+${primitive}\\b`, 'g');
    addPatternDiagnostics(
      diagnostics,
      source,
      file,
      'no-local-primitive',
      `Do not declare a local ${primitive}; import the canonical primitive from ${config.canonicalPackage}.`,
      declarationPattern
    );
  }
}

function scanSource(source, file, config, configRelativePath) {
  const diagnostics = [];
  const isTokenSource = matchesAny(configRelativePath, config.canonicalTokenSources);

  if (!isTokenSource) {
    addPatternDiagnostics(
      diagnostics,
      source,
      file,
      'no-reference-token',
      'Reference tokens are implementation details. Consume a semantic --color-*, --radius-*, --layout-*, or --motion-* token instead.',
      /--ref-[a-z0-9-]+/gi
    );
    addPatternDiagnostics(
      diagnostics,
      source,
      file,
      'no-raw-color',
      'Replace the raw color with a semantic design-system token or utility.',
      /(?<![\w&-])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![0-9a-f])/gi
    );
    addPatternDiagnostics(
      diagnostics,
      source,
      file,
      'no-raw-color',
      'Replace the raw color function with a semantic design-system token or utility.',
      /\b(?:rgb|hsl)a?\(\s*[^)]+\)/gi
    );
  }

  const escapedPackage = config.canonicalPackage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  addPatternDiagnostics(
    diagnostics,
    source,
    file,
    'no-internal-package-import',
    `Import only from the public ${config.canonicalPackage} package entrypoints.`,
    new RegExp(`(?:from\\s+|import\\s*\\(\\s*)['"]${escapedPackage}/src(?:/[^'"]*)?['"]`, 'g')
  );

  arbitraryValueDiagnostics(source, file, diagnostics);
  themePaletteDiagnostics(source, file, diagnostics);
  localPrimitiveDiagnostics(source, file, diagnostics, config, configRelativePath);

  return diagnostics;
}

function applyExceptions(diagnostics, config, configDir, cwd) {
  const activeExceptions = config.exceptions.filter((exception) => exception.reviewBy >= todayUtc());
  return diagnostics.filter((diagnostic) => {
    const absoluteFile = path.resolve(cwd, diagnostic.file);
    const relativeToConfig = slash(path.relative(configDir, absoluteFile));
    return !activeExceptions.some(
      (exception) =>
        exception.rule === diagnostic.rule && matchesAny(relativeToConfig, exception.files)
    );
  });
}

function exceptionDiagnostics(config, configDisplayPath) {
  return config.exceptions
    .filter((exception) => validCalendarDate(exception.reviewBy) && exception.reviewBy < todayUtc())
    .map((exception) => ({
      file: configDisplayPath,
      line: 1,
      column: 1,
      rule: 'exception-expired',
      message: `The ${exception.rule} exception owned by ${exception.owner} expired on ${exception.reviewBy}; remove or explicitly review it.`,
      excerpt: '',
    }));
}

function printHuman(result) {
  if (result.diagnostics.length === 0) {
    process.stdout.write(`Design policy passed (${result.scannedFiles} files).\n`);
    return;
  }

  for (const diagnostic of result.diagnostics) {
    process.stderr.write(
      `${diagnostic.file}:${diagnostic.line}:${diagnostic.column}  ${diagnostic.rule}  ${diagnostic.message}\n`
    );
    if (diagnostic.excerpt) process.stderr.write(`  ${diagnostic.excerpt}\n`);
  }
  process.stderr.write(
    `Design policy failed with ${result.errors} error${result.errors === 1 ? '' : 's'} across ${result.scannedFiles} files.\n`
  );
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n\n${usage()}\n`);
    process.exitCode = 2;
    return;
  }

  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const cwd = process.cwd();
  const absoluteConfigPath = path.resolve(cwd, options.configPath);
  const configDir = path.dirname(absoluteConfigPath);
  const configDisplayPath = slash(path.relative(cwd, absoluteConfigPath)) || path.basename(absoluteConfigPath);
  let config;

  try {
    config = JSON.parse(await readFile(absoluteConfigPath, 'utf8'));
  } catch (error) {
    const result = {
      policyVersion: POLICY_VERSION,
      success: false,
      scannedFiles: 0,
      errors: 1,
      diagnostics: [{
        file: configDisplayPath,
        line: 1,
        column: 1,
        rule: 'config-invalid',
        message: `Cannot read policy configuration: ${error.message}`,
        excerpt: '',
      }],
    };
    if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else printHuman(result);
    process.exitCode = 2;
    return;
  }

  const problems = configProblems(config);
  if (problems.length > 0) {
    const result = {
      policyVersion: POLICY_VERSION,
      success: false,
      scannedFiles: 0,
      errors: problems.length,
      diagnostics: problems.map((message) => ({
        file: configDisplayPath,
        line: 1,
        column: 1,
        rule: 'config-invalid',
        message,
        excerpt: '',
      })),
    };
    if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else printHuman(result);
    process.exitCode = 2;
    return;
  }

  let files;
  try {
    files = await collectFiles(options.targets, cwd, configDir, config);
  } catch (error) {
    const result = {
      policyVersion: POLICY_VERSION,
      success: false,
      scannedFiles: 0,
      errors: 1,
      diagnostics: [{
        file: '.',
        line: 1,
        column: 1,
        rule: 'target-invalid',
        message: `Cannot scan target: ${error.message}`,
        excerpt: '',
      }],
    };
    if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else printHuman(result);
    process.exitCode = 2;
    return;
  }

  const diagnostics = [];
  if (files.length === 0 && !options.allowEmpty) {
    diagnostics.push({
      file: '.',
      line: 1,
      column: 1,
      rule: 'no-files-scanned',
      message: 'No files matched the requested targets. Pass --allow-empty only when an empty scan is intentional.',
      excerpt: '',
    });
  }
  for (const absoluteFile of files) {
    const source = await readFile(absoluteFile, 'utf8');
    const displayFile = slash(path.relative(cwd, absoluteFile));
    const configRelativePath = slash(path.relative(configDir, absoluteFile));
    diagnostics.push(...scanSource(source, displayFile, config, configRelativePath));
  }

  const unsuppressed = applyExceptions(diagnostics, config, configDir, cwd);
  unsuppressed.push(...exceptionDiagnostics(config, configDisplayPath));
  unsuppressed.sort((a, b) =>
    a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || a.rule.localeCompare(b.rule)
  );

  const result = {
    policyVersion: POLICY_VERSION,
    success: unsuppressed.length === 0,
    scannedFiles: files.length,
    errors: unsuppressed.length,
    diagnostics: unsuppressed,
  };

  if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else printHuman(result);
  if (!result.success) process.exitCode = 1;
}

await main();
