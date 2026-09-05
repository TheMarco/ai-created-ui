import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const sourceRoots = ['src', 'styles', 'templates/agent',
  'playground/src/components/design-system/specs',
  'playground/src/components/design-system/principal-spec'];
const sourceFiles = ['tailwind-preset.js', 'DESIGN-SYSTEM.md',
  'playground/src/components/design-system/componentDocs.ts',
  'playground/src/app/globals.css', 'playground/tailwind.config.js'];
const digest = (value) => createHash('sha256').update(value).digest('hex');
const sorted = (record) => Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b, 'en')));
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const validDate = (value) => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));
const equalIds = (a, b) => Array.isArray(a) && Array.isArray(b)
  && a.every(nonempty) && new Set(a).size === a.length
  && JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

function sourceDigest(source) {
  return digest(JSON.stringify({ packageVersion: source.packageVersion,
    files: sorted(source.files), componentIds: [...source.componentIds].sort() }));
}

async function inspect(root, relative, files) {
  const absolute = path.join(root, relative);
  const entry = await lstat(absolute);
  if (entry.isSymbolicLink()) throw new Error(`Figma source cannot be a symlink: ${relative}`);
  if (entry.isDirectory()) {
    for (const name of (await readdir(absolute)).sort()) await inspect(root, path.posix.join(relative, name), files);
  } else if (entry.isFile()) files[relative] = digest(await readFile(absolute));
  else throw new Error(`Unsupported Figma source file: ${relative}`);
}

/** Hash owning sources, including additions/deletions. Exporting never blesses the audit. */
export async function captureSource(root) {
  const files = {};
  for (const relative of [...sourceRoots, ...sourceFiles]) await inspect(root, relative, files);
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  files['package.json'] = digest(JSON.stringify({ version: pkg.version,
    dependencies: sorted(pkg.dependencies ?? {}), peerDependencies: sorted(pkg.peerDependencies ?? {}) }));
  const manifest = JSON.parse(await readFile(path.join(root, 'design-system.manifest.json'), 'utf8'));
  const componentIds = manifest.components?.map((component) => component.id).sort();
  if (!componentIds?.length || !equalIds(componentIds, componentIds)) {
    throw new Error('Canonical manifest must contain unique component IDs. Run npm run agent:export.');
  }
  const source = { packageVersion: pkg.version, files: sorted(files), componentIds };
  return { ...source, fingerprint: sourceDigest(source) };
}

export function diffSources(current, recorded = {}) {
  const a = current.files ?? {};
  const b = recorded.files ?? {};
  return {
    added: Object.keys(a).filter((name) => !(name in b)).sort(),
    changed: Object.keys(a).filter((name) => name in b && a[name] !== b[name]).sort(),
    removed: Object.keys(b).filter((name) => !(name in a)).sort(),
  };
}

export function validPublication(record, fingerprint) {
  return record?.sourceFingerprint === fingerprint && validDate(record.verifiedAt);
}

/** Validates a review receipt, not the remote file. MCP inspection remains mandatory. */
export function validateAudit(audit, source, config) {
  if (!audit || audit.schemaVersion !== 1) throw new Error('Audit schemaVersion must be 1.');
  if (!nonempty(config.fileKey) || audit.fileKey !== config.fileKey) throw new Error('Audit fileKey must match the configured consumer.');
  if (audit.sourceFingerprint !== source.fingerprint) throw new Error('Audit sourceFingerprint does not match reviewed source.');
  if (!validDate(audit.auditedAt) || !nonempty(audit.reviewer)) throw new Error('Audit requires an ISO auditedAt and a named reviewer.');
  if (!equalIds(audit.reviewedComponentIds, source.componentIds)) throw new Error('Audit reviewedComponentIds must cover every public component exactly once.');
  for (const check of ['tokens', 'components', 'themes', 'templates', 'visualReview']) {
    if (audit.checks?.[check] !== 'passed') throw new Error(`Audit check has not passed: ${check}.`);
  }
  if (!Array.isArray(audit.evidence) || !audit.evidence.length || !audit.evidence.every(nonempty)) throw new Error('Audit requires nonempty evidence references.');
  const observed = audit.observed;
  const assets = observed?.componentAssets;
  if (!Array.isArray(assets) || !assets.length
    || assets.some((asset) => !nonempty(asset.id) || !nonempty(asset.name))
    || new Set(assets.map((asset) => asset.id)).size !== assets.length
    || new Set(assets.map((asset) => asset.name)).size !== assets.length
    || !Number.isInteger(observed.variables) || observed.variables <= 0
    || !Number.isInteger(observed.textStyles) || observed.textStyles <= 0
    || !Array.isArray(observed.collections)) throw new Error('Audit observed assets or counts are invalid.');
  const semantic = observed.collections.find((collection) => collection.name === 'AI-Created UI / Semantic');
  if (!semantic?.modes?.includes('dark') || !semantic.modes.includes('light')) throw new Error('Semantic collection must include dark and light modes.');
  const accent = observed.collections.find((collection) => collection.name === 'AI-Created UI / Accent');
  const accents = config.accentModes ?? ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'teal', 'pink', 'magenta'];
  if (!equalIds(accent?.modes, accents)) throw new Error('Accent collection modes must match the consumer contract.');
  return audit;
}

export function assessConsumer(source, lock, config) {
  const report = { status: 'unverified', sourceFingerprint: source.fingerprint, packageVersion: source.packageVersion,
    changes: diffSources(source, lock?.source), publication: { library: 'pending', community: 'pending' } };
  if (!lock) return { ...report, reason: 'Missing Figma consumer lock.' };
  try {
    if (lock.schemaVersion !== 1 || !lock.source?.files || !lock.source?.componentIds
      || lock.source.fingerprint !== sourceDigest(lock.source)) throw new Error('Invalid recorded source fingerprint.');
    validateAudit(lock.audit, lock.source, config);
  } catch (error) { return { ...report, reason: error.message }; }
  if (lock.source.fingerprint !== source.fingerprint) {
    return { ...report, status: 'stale', reason: 'Source changed since the Figma audit. Run npm run figma:plan and reconcile Figma.' };
  }
  return { ...report, status: 'current', publication: Object.fromEntries(['library', 'community'].map((channel) => [
    channel, validPublication(lock.publication?.[channel], source.fingerprint) ? 'current' : 'pending',
  ])) };
}
