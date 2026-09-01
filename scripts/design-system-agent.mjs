#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const readJson = (relativePath) =>
  readFile(path.join(packageRoot, relativePath), 'utf8').then(JSON.parse);

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message, suggestions = []) {
  output({ ok: false, error: message, suggestions });
  process.exitCode = 2;
}

function help() {
  output({
    ok: true,
    usage: 'node scripts/design-system-agent.mjs <command> [argument]',
    commands: {
      context: 'Return canonical sources, artifacts, counts, and validation commands.',
      consumers: 'List every product governed by the downstream compatibility contract.',
      'consumer-status':
        'Verify a consumer manifest, npm lockfile/tag commit, and latest reviewed release.',
      'list-components': 'List component ids, names, categories, and summaries.',
      component: 'Return the complete contract for one component id or slug.',
      guideline: 'Return one principal guideline by slug.',
      templates: 'List approved page templates.',
      template: 'Return one template contract and its complete TSX source.',
      validate: 'Run the blocking design-policy validator against optional paths.',
    },
  });
}

function stableVersion(tag) {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(tag);
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

async function latestReleaseTag() {
  if (process.env.AI_CREATED_UI_LATEST_TAG) {
    return process.env.AI_CREATED_UI_LATEST_TAG;
  }

  const release = await fetchGitHubJson(
    'https://api.github.com/repos/TheMarco/ai-created-ui/releases/latest',
    'latest-release',
  );
  if (typeof release.tag_name !== 'string') {
    throw new Error('GitHub latest-release response did not include a tag name.');
  }
  return release.tag_name;
}

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ai-created-ui-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function fetchGitHubJson(url, label) {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub ${label} request failed with HTTP ${response.status}.`);
  }
  return response.json();
}

function commitSha(value, label) {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/i.test(value)) {
    throw new Error(`${label} must be a 40-character Git commit SHA.`);
  }
  return value.toLowerCase();
}

async function tagCommitSha(tag) {
  if (process.env.AI_CREATED_UI_TAG_COMMIT_SHA) {
    return commitSha(
      process.env.AI_CREATED_UI_TAG_COMMIT_SHA,
      'AI_CREATED_UI_TAG_COMMIT_SHA',
    );
  }

  const ref = await fetchGitHubJson(
    `https://api.github.com/repos/TheMarco/ai-created-ui/git/ref/tags/${encodeURIComponent(tag)}`,
    `tag-ref ${tag}`,
  );
  let object = ref.object;
  for (let depth = 0; depth < 5; depth += 1) {
    if (object?.type === 'commit') {
      return commitSha(object.sha, `Commit behind ${tag}`);
    }
    if (object?.type !== 'tag') {
      throw new Error(`GitHub tag ${tag} did not resolve to a commit or annotated tag.`);
    }
    const annotatedTag = await fetchGitHubJson(
      `https://api.github.com/repos/TheMarco/ai-created-ui/git/tags/${commitSha(
        object.sha,
        `Annotated tag object for ${tag}`,
      )}`,
      `annotated-tag ${tag}`,
    );
    object = annotatedTag.object;
  }
  throw new Error(`GitHub tag ${tag} exceeded the supported annotated-tag depth.`);
}

function lockedCommitSha(resolution) {
  if (typeof resolution !== 'string') return null;
  const match = /^(?:git\+https:\/\/github\.com\/|git\+ssh:\/\/git@github\.com\/|git\+ssh:\/\/github\.com\/)TheMarco\/ai-created-ui\.git#([0-9a-f]{40})$/i.exec(
    resolution,
  );
  return match ? match[1].toLowerCase() : null;
}

function lifecycleStatus(status, error) {
  if (status === 'current') {
    return {
      stage: {
        id: 'currency-current',
        inferredFrom: 'local-manifest-lockfile-and-release',
        liveRepositoryStateVerified: false,
      },
      nextAction: {
        id: 'none',
        actor: 'none',
        description:
          'No package update is required; this command does not inspect live deployment state.',
        requiresLiveRepositoryInspection: false,
      },
    };
  }
  if (status === 'stale') {
    return {
      stage: {
        id: 'renovate-detection',
        inferredFrom: 'version-comparison-only',
        liveRepositoryStateVerified: false,
      },
      nextAction: {
        id: 'review-update-path',
        actor: 'consumer-owner',
        description:
          'Review the release notes, then adopt the immutable tag manually or inspect the dependency updater configured by this consumer. This command does not inspect live pull-request state.',
        requiresLiveRepositoryInspection: true,
      },
    };
  }
  if (status === 'ahead') {
    return {
      stage: {
        id: 'validation',
        inferredFrom: 'version-comparison-only',
        liveRepositoryStateVerified: false,
      },
      nextAction: {
        id: 'verify-ahead-release',
        actor: 'maintainer',
        description:
          'Verify that the installed tag is a reviewed published release and that the latest-release source is current.',
        requiresLiveRepositoryInspection: true,
      },
    };
  }
  return {
    stage: {
      id: 'validation',
      inferredFrom: 'local-contract-failure',
      liveRepositoryStateVerified: false,
    },
    nextAction: {
      id: 'repair-consumer-dependency',
      actor: 'maintainer',
      description: error,
      requiresLiveRepositoryInspection: false,
    },
  };
}

function invalidConsumerStatus(context, error) {
  const message = error instanceof Error ? error.message : String(error);
  const result = {
    statusSchemaVersion: '1.0.0',
    ok: false,
    consumer: context.consumer,
    manifestPath: context.manifestPath,
    lockfilePath: context.lockfilePath,
    installedTag: context.installedTag,
    latestTag: context.latestTag,
    status: 'invalid',
    ...lifecycleStatus('invalid', message),
    error: message,
  };
  output(result);
  process.exitCode = 2;
}

async function consumerStatus(manifestArgument) {
  const manifestPath = path.resolve(process.cwd(), manifestArgument ?? 'package.json');
  const context = {
    consumer: path.basename(path.dirname(manifestPath)),
    manifestPath,
    lockfilePath: path.join(path.dirname(manifestPath), 'package-lock.json'),
    installedTag: null,
    latestTag: null,
  };

  try {
    const consumerPackage = JSON.parse(await readFile(manifestPath, 'utf8'));
    context.consumer = consumerPackage.name ?? context.consumer;
    const dependencySection = consumerPackage.dependencies?.['@ai-created/ui']
      ? 'dependencies'
      : consumerPackage.devDependencies?.['@ai-created/ui']
        ? 'devDependencies'
        : null;
    const dependency = dependencySection
      ? consumerPackage[dependencySection]['@ai-created/ui']
      : null;
    if (typeof dependency !== 'string') {
      throw new Error(`${manifestPath} does not declare @ai-created/ui.`);
    }
    const dependencyMatch =
      /^git\+https:\/\/github\.com\/TheMarco\/ai-created-ui\.git#(v\d+\.\d+\.\d+)$/.exec(
        dependency,
      );
    if (!dependencyMatch) {
      throw new Error(
        '@ai-created/ui must use an immutable public GitHub SemVer tag, for example #v1.2.0.',
      );
    }
    context.installedTag = dependencyMatch[1];

    let lockfile;
    try {
      lockfile = JSON.parse(await readFile(context.lockfilePath, 'utf8'));
    } catch (error) {
      if (error?.code === 'ENOENT') {
        throw new Error(`${context.lockfilePath} is required for consumer integrity checks.`);
      }
      throw new Error(`${context.lockfilePath} is not valid JSON.`);
    }
    if (lockfile.lockfileVersion !== 2 && lockfile.lockfileVersion !== 3) {
      throw new Error('package-lock.json must use npm lockfileVersion 2 or 3.');
    }
    const rootSpec = lockfile.packages?.['']?.[dependencySection]?.['@ai-created/ui'];
    if (rootSpec !== dependency) {
      throw new Error(
        'package-lock.json root dependency spec does not match package.json for @ai-created/ui.',
      );
    }
    const lockedPackage =
      lockfile.packages?.['node_modules/@ai-created/ui'] ??
      lockfile.dependencies?.['@ai-created/ui'];
    if (!lockedPackage || typeof lockedPackage !== 'object') {
      throw new Error('package-lock.json does not contain the installed @ai-created/ui package.');
    }
    const expectedPackageVersion = context.installedTag.slice(1);
    const lockedVersionSha = lockedCommitSha(lockedPackage.version);
    if (lockedPackage.version !== expectedPackageVersion && !lockedVersionSha) {
      throw new Error(
        `package-lock.json records @ai-created/ui version ${lockedPackage.version}, expected ${expectedPackageVersion}.`,
      );
    }
    const resolution =
      lockedPackage.resolved ??
      (lockedCommitSha(lockedPackage.version) ? lockedPackage.version : null);
    const lockedSha = lockedCommitSha(resolution);
    if (!lockedSha) {
      throw new Error(
        'package-lock.json must resolve @ai-created/ui to a 40-character commit SHA from TheMarco/ai-created-ui.',
      );
    }
    if (lockedVersionSha && lockedVersionSha !== lockedSha) {
      throw new Error(
        `package-lock.json has conflicting @ai-created/ui commit SHAs ${lockedVersionSha} and ${lockedSha}.`,
      );
    }
    const installedTagCommitSha = await tagCommitSha(context.installedTag);
    if (lockedSha !== installedTagCommitSha) {
      throw new Error(
        `package-lock.json resolves ${lockedSha}, but ${context.installedTag} resolves ${installedTagCommitSha}.`,
      );
    }

    context.latestTag = await latestReleaseTag();
    const installedVersion = stableVersion(context.installedTag);
    const latestVersion = stableVersion(context.latestTag);
    if (!installedVersion || !latestVersion) {
      throw new Error(
        `Unable to compare release tags ${context.installedTag} and ${context.latestTag}.`,
      );
    }

    const comparison = compareVersions(installedVersion, latestVersion);
    const status = comparison === 0 ? 'current' : comparison < 0 ? 'stale' : 'ahead';
    const result = {
      statusSchemaVersion: '1.0.0',
      ok: comparison === 0,
      consumer: context.consumer,
      manifestPath,
      lockfilePath: context.lockfilePath,
      installedTag: context.installedTag,
      installedTagCommitSha,
      lockedCommitSha: lockedSha,
      latestTag: context.latestTag,
      status,
      ...lifecycleStatus(status),
    };
    output(result);
    if (comparison !== 0) process.exitCode = comparison < 0 ? 1 : 2;
  } catch (error) {
    invalidConsumerStatus(context, error);
  }
}

async function main() {
  const [command = 'help', ...arguments_] = process.argv.slice(2);
  if (command === 'help' || command === '--help' || command === '-h') return help();

  if (command === 'validate') {
    const result = spawnSync(
      process.execPath,
      [path.join(packageRoot, 'scripts/validate-design-policy.mjs'), '--json', ...arguments_],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    process.exitCode = result.status ?? 2;
    return;
  }

  if (command === 'consumer-status') {
    return consumerStatus(arguments_[0]);
  }

  const manifest = await readJson('design-system.manifest.json');
  const consumerRegistry = await readJson('consumers.json');

  if (command === 'context') {
    return output({
      ok: true,
      package: manifest.package,
      canonicalSourcePrecedence: manifest.canonicalSourcePrecedence,
      artifacts: manifest.artifacts,
      coverage: {
        components: manifest.components.length,
        publicExports: manifest.publicApi.exports.length,
        guidelines: manifest.guidelines.length,
        consumers: consumerRegistry.consumers.length,
      },
      validation: manifest.validation,
    });
  }

  if (command === 'consumers') {
    return output({ ok: true, ...consumerRegistry });
  }

  if (command === 'list-components') {
    return output({
      ok: true,
      components: manifest.components.map(({ id, slug, name, category, summary }) => ({
        id,
        slug,
        name,
        category,
        summary,
      })),
    });
  }

  if (command === 'component') {
    const query = arguments_[0];
    const component = manifest.components.find(
      ({ id, slug, name }) => id === query || slug === query || name.toLowerCase() === query?.toLowerCase(),
    );
    if (!component) return fail(`Unknown component: ${query ?? '(missing)'}`, manifest.components.map(({ id }) => id));
    return output({ ok: true, component });
  }

  if (command === 'guideline') {
    const query = arguments_[0];
    const guideline = manifest.guidelines.find(({ slug }) => slug === query);
    if (!guideline) return fail(`Unknown guideline: ${query ?? '(missing)'}`, manifest.guidelines.map(({ slug }) => slug));
    return output({ ok: true, guideline });
  }

  if (command === 'templates' || command === 'template') {
    const templateManifest = await readJson('templates/agent/manifest.json');
    if (command === 'templates') return output({ ok: true, ...templateManifest });
    const query = arguments_[0];
    const template = templateManifest.templates.find(({ id }) => id === query);
    if (!template) return fail(`Unknown template: ${query ?? '(missing)'}`, templateManifest.templates.map(({ id }) => id));
    const source = await readFile(path.join(packageRoot, template.source), 'utf8');
    return output({ ok: true, template, source });
  }

  fail(`Unknown command: ${command}`, [
    'context',
    'consumers',
    'consumer-status',
    'list-components',
    'component',
    'guideline',
    'templates',
    'template',
    'validate',
  ]);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
