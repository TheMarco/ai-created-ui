import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);
const packageLock = JSON.parse(
  await readFile(new URL('../package-lock.json', import.meta.url), 'utf8')
);
const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');

const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
if (!semverPattern.test(packageJson.version)) {
  throw new Error(`package.json version is not stable SemVer: ${packageJson.version}`);
}

if (packageJson.private !== true) {
  throw new Error('package.json must keep private: true while distribution is GitHub-only.');
}

if (
  packageLock.version !== packageJson.version ||
  packageLock.packages?.['']?.version !== packageJson.version
) {
  throw new Error('package.json and package-lock.json versions do not match.');
}

const requestedTag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
const expectedTag = `v${packageJson.version}`;
if (requestedTag && requestedTag !== expectedTag) {
  throw new Error(`Release tag ${requestedTag} must match package version ${expectedTag}.`);
}

const escapedVersion = packageJson.version.replaceAll('.', '\\.');
const releaseHeading = new RegExp(
  `^## \\[${escapedVersion}\\] - \\d{4}-\\d{2}-\\d{2}$`,
  'm'
);
if (!releaseHeading.test(changelog)) {
  throw new Error(
    `CHANGELOG.md needs a dated "## [${packageJson.version}]" release section.`
  );
}

console.log(
  `Release metadata verified for ${requestedTag ?? expectedTag} in ${packageRoot}.`
);
