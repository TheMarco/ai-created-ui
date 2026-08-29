#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'design-system.manifest.json'), 'utf8'));
const configPath = path.join(root, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

if (configFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
}

const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root, undefined, configPath);
const program = ts.createProgram(config.fileNames, config.options);
const checker = program.getTypeChecker();
const indexSource = program.getSourceFile(path.join(root, 'src/index.ts'));
if (!indexSource) throw new Error('TypeScript could not load src/index.ts.');
const indexSymbol = checker.getSymbolAtLocation(indexSource);
if (!indexSymbol) throw new Error('TypeScript could not resolve the public package module.');

const exportsByName = new Map(checker.getExportsOfModule(indexSymbol).map((symbol) => [symbol.name, symbol]));
const manifestExports = new Set(manifest.publicApi.exports.map((entry) => entry.name));
const issues = [];

function resolveExport(name) {
  const exported = exportsByName.get(name);
  if (!exported) return undefined;
  return exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
}

function declaredType(name) {
  const symbol = resolveExport(name);
  return symbol ? checker.getDeclaredTypeOfSymbol(symbol) : undefined;
}

function propertiesForType(name) {
  const type = declaredType(name);
  return type ? new Map(checker.getPropertiesOfType(type).map((property) => [property.name, property])) : new Map();
}

function propsExportsFor(component) {
  return manifest.publicApi.exports
    .filter((entry) => entry.kind === 'type' && entry.sourcePath === component.sourcePath && entry.name.endsWith('Props'))
    .map((entry) => entry.name);
}

function propertyType(property) {
  const declaration = property.valueDeclaration ?? property.declarations?.[0] ?? indexSource;
  return checker.getTypeOfSymbolAtLocation(property, declaration);
}

function literalStrings(type) {
  const members = type.isUnion() ? type.types : [type];
  return members
    .filter((member) => member.isStringLiteral())
    .map((member) => member.value)
    .sort();
}

function functionReturnProperties(name) {
  const symbol = resolveExport(name);
  if (!symbol) return new Map();
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? indexSource;
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = type.getCallSignatures()[0];
  if (!signature) return new Map();
  return new Map(checker.getPropertiesOfType(signature.getReturnType()).map((property) => [property.name, property]));
}

function documentedApiExists(component, apiName, propsMaps) {
  if (apiName.startsWith('...')) return true;
  if (manifestExports.has(apiName)) return true;

  const dotIndex = apiName.indexOf('.');
  if (dotIndex !== -1) {
    const owner = apiName.slice(0, dotIndex).replace(/\(\)$/, '');
    const member = apiName.slice(dotIndex + 1);
    if (!manifestExports.has(owner)) return false;
    const ownerProps = propsMaps.get(`${owner}Props`);
    if (ownerProps?.has(member)) return true;
    return functionReturnProperties(owner).has(member);
  }

  return [...propsMaps.values()].some((properties) => properties.has(apiName));
}

for (const component of manifest.components) {
  const propsNames = propsExportsFor(component);
  const propsMaps = new Map(propsNames.map((name) => [name, propertiesForType(name)]));

  for (const row of component.api ?? []) {
    if (!documentedApiExists(component, row.prop, propsMaps)) {
      issues.push(`${component.id}: documented API "${row.prop}" is not a public export or prop from ${component.sourcePath}.`);
    }
  }

  const importMatch = component.implementation?.importStatement?.match(
    /import\s*\{([^}]+)\}\s*from\s*['"]@ai-created\/ui['"]/,
  );
  if (importMatch) {
    for (const imported of importMatch[1].split(',')) {
      const name = imported.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0];
      if (name && !manifestExports.has(name)) {
        issues.push(`${component.id}: implementation imports unknown public export "${name}".`);
      }
    }
  }

  for (const [controlName, control] of Object.entries(component.controls ?? {})) {
    if (control.type !== 'select') continue;
    const matchingProperties = [...propsMaps.values()]
      .map((properties) => properties.get(controlName))
      .filter(Boolean);
    if (matchingProperties.length === 0) continue;

    const allowed = [...new Set(matchingProperties.flatMap((property) => literalStrings(propertyType(property))))].sort();
    if (allowed.length === 0) continue;
    const documented = [...control.options].sort();
    if (JSON.stringify(allowed) !== JSON.stringify(documented)) {
      issues.push(`${component.id}: control "${controlName}" options [${documented.join(', ')}] do not match TypeScript [${allowed.join(', ')}].`);
    }
  }
}

const diagnostics = ts.getPreEmitDiagnostics(program).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
if (diagnostics.length) {
  issues.push(`TypeScript program has ${diagnostics.length} error diagnostics.`);
}

if (issues.length) {
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ ok: false, issues }, null, 2)}\n`);
  } else {
    console.error('Component API parity failed:');
    for (const issue of issues) console.error(`- ${issue}`);
  }
  process.exitCode = 1;
} else if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({ ok: true, components: manifest.components.length, exports: manifest.publicApi.exports.length })}\n`);
} else {
  console.log(`Component API parity verified: ${manifest.components.length} contracts and ${manifest.publicApi.exports.length} exports.`);
}
