import packageJson from '../../../package.json';

/**
 * Release facts derived from package.json so no component hardcodes them.
 * The repository is distributed through immutable GitHub tags, not npm.
 */
const repositoryUrl = packageJson.repository.url
  .replace(/^git\+/, '')
  .replace(/\.git$/, '');

export const release = {
  packageName: packageJson.name,
  version: packageJson.version,
  license: packageJson.license,
  repositoryUrl,
  releasesUrl: `${repositoryUrl}/releases`,
  licenseUrl: `${repositoryUrl}/blob/main/LICENSE`,
  installCommand: `npm install --install-links "git+${repositoryUrl}.git#v${packageJson.version}"`,
} as const;
