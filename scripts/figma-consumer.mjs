#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureSource, validateAudit, assessConsumer, validPublication } from './lib/figma-consumer.mjs';

async function readJson(filename, optional = false) {
  try { return JSON.parse(await readFile(filename, 'utf8')); }
  catch (error) { if (optional && error.code === 'ENOENT') return null; throw error; }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] && !args[0].startsWith('--') ? args.shift() : 'check';
  if (!['check', 'plan', 'record', 'release-check'].includes(command)) throw new Error(`Unknown command: ${command}`);
  const options = {};
  while (args.length) {
    const option = args.shift();
    if (Object.hasOwn(options, option)) throw new Error(`Duplicate option: ${option}`);
    if (['--root', '--evidence'].includes(option)) {
      if (!args[0] || args[0].startsWith('--')) throw new Error(`${option} requires a path.`);
      options[option] = args.shift();
    } else if (['--published-library', '--published-community'].includes(option)) options[option] = true;
    else throw new Error(`Unknown option: ${option}`);
  }
  if (command !== 'record' && Object.keys(options).some((key) => key !== '--root')) throw new Error('Evidence and publication flags are only accepted by record.');
  if (command === 'record' && !options['--evidence']) throw new Error('record requires --evidence PATH.');
  const root = options['--root'] ? path.resolve(options['--root']) : fileURLToPath(new URL('../', import.meta.url));
  const config = await readJson(path.join(root, 'figma/consumer.json'));
  if (config.schemaVersion !== 1 || !config.fileKey) throw new Error('Invalid Figma consumer configuration.');
  const lockPath = path.join(root, 'figma/consumer.lock.json');
  const lock = await readJson(lockPath, true);
  const source = await captureSource(root);
  if (command === 'record') {
    const audit = await readJson(path.resolve(options['--evidence']));
    validateAudit(audit, source, config);
    const publication = { ...lock?.publication };
    for (const channel of ['library', 'community']) {
      if (options[`--published-${channel}`]) {
        if (!validPublication(audit.publication?.[channel], source.fingerprint)) throw new Error(`Evidence must confirm ${channel} publication for this source fingerprint.`);
        publication[channel] = audit.publication[channel];
      }
    }
    await writeFile(lockPath, `${JSON.stringify({ schemaVersion: 1, source, audit, publication }, null, 2)}\n`);
    console.log(`Recorded Figma audit for ${source.fingerprint}. Publication requires separate verified evidence.`);
    return;
  }
  const report = assessConsumer(source, lock, config);
  if (command === 'plan') console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Figma consumer: ${report.status}; library: ${report.publication.library}; Community: ${report.publication.community}.`);
    if (report.reason) console.error(report.reason);
    for (const [kind, names] of Object.entries(report.changes)) if (names.length) console.error(`${kind}: ${names.join(', ')}`);
    if (report.status !== 'current' || (command === 'release-check'
      && Object.values(report.publication).some((status) => status !== 'current'))) process.exitCode = 1;
  }
}
main().catch((error) => { console.error(`Figma consumer: ${error.message}`); process.exitCode = 1; });
