import { readFile } from 'node:fs/promises';

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
if (!tag || !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(tag)) {
  throw new Error('Pass a stable release tag such as v1.2.3.');
}

const version = tag.slice(1);
const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const escapedVersion = version.replaceAll('.', '\\.');
const heading = new RegExp(`^## \\[${escapedVersion}\\] - .+$`, 'm');
const headingMatch = heading.exec(changelog);

if (!headingMatch) {
  throw new Error(`CHANGELOG.md has no release section for ${version}.`);
}

const notesStart = headingMatch.index + headingMatch[0].length;
const remainingChangelog = changelog.slice(notesStart);
const nextHeading = /^## \[/m.exec(remainingChangelog);
const notes = remainingChangelog.slice(0, nextHeading?.index).trim();

if (!notes) {
  throw new Error(`CHANGELOG.md release section for ${version} is empty.`);
}

process.stdout.write(`${notes}\n`);
