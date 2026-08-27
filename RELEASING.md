# Releasing `@ai-created/ui`

This package is distributed from the private GitHub repository. It is not published to npm. A release is an immutable `vX.Y.Z` Git tag whose version matches `package.json`, plus human-reviewed notes in `CHANGELOG.md` and a GitHub Release created by automation.

## Choose the version

- PATCH: a bug fix or visual correction that preserves meaningful API, token, and behavior contracts.
- MINOR: an additive component, variant, prop, export, or documented capability.
- MAJOR: a removed or renamed export, incompatible prop or callback change, token removal, or behavior change that requires consumer migration.

Use the highest impact in the release. Do not infer the version from commit messages. Changesets are intentionally not used while this remains one privately distributed package with a small maintainer and consumer set.

## Prepare the release

1. Confirm every release-worthy change has a concise entry under `Unreleased` in `CHANGELOG.md`.
2. Run `npm run validate` and `npm run test:browser` from the repository root.
3. Update the version without creating a tag yet:

   ```bash
   npm version minor --no-git-tag-version
   ```

   Replace `minor` with `patch`, `major`, or an exact stable version. This updates both `package.json` and `package-lock.json`.
4. Move the relevant `Unreleased` notes into a dated heading such as `## [1.1.0] - 2026-08-27`. Leave an empty `Unreleased` section at the top.
5. Verify the package boundary and release metadata:

   ```bash
   npm run release:check -- v1.1.0
   npm run package:check
   npm run release:notes -- v1.1.0
   ```
6. Commit the version, lockfile, and changelog together. Review and merge that commit to `main` through the normal quality gate.

## Tag and publish the GitHub Release

Tag the exact validated commit on `main`:

```bash
git tag -a v1.1.0 -m "@ai-created/ui v1.1.0"
git push origin v1.1.0
```

Pushing a `v*.*.*` tag runs `.github/workflows/release.yml`. The workflow repeats the complete quality and browser gates, verifies that the tag, package version, lockfile, and changelog agree, checks the packed file boundary, and then creates the GitHub Release from that version's changelog section.

The workflow's write permission exists only in the final release job after validation. Pull request code and dependency installation run with read-only repository access.

## Update consumers

After the GitHub Release exists, Renovate should open a tag update PR in each consumer. The expected manifest shape is:

```json
{
  "dependencies": {
    "@ai-created/ui": "github:TheMarco/ai-created-ui#v1.1.0"
  }
}
```

Review the release notes and consumer checks before merging. Major updates are always reviewed and are never auto-merged. See `docs/consumer-update-automation.md` for activation and `docs/consumer-compatibility.md` for the required current and future consumer checks.

## Correct a bad release

Do not move or delete a published tag. Fix the problem on `main`, prepare the next patch release, and update consumers through a new PR. If a GitHub Release was created for a tag that never became usable, mark it clearly as superseded rather than rewriting the published history.
