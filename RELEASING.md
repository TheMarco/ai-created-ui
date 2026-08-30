# Releasing `@ai-created/ui`

This open-source package is distributed from the public GitHub repository and is not published to npm. A release is an immutable `vX.Y.Z` Git tag whose version matches `package.json`, plus human-reviewed notes in `CHANGELOG.md` and a GitHub Release created by automation. `private: true` remains an npm-publication guard only.

## Choose the version

- PATCH: a bug fix or visual correction that preserves meaningful API, token, and behavior contracts.
- MINOR: an additive component, variant, prop, export, or documented capability.
- MAJOR: a removed or renamed export, incompatible prop or callback change, token removal, or behavior change that requires consumer migration.

Use the highest impact in the release. Do not infer the version from commit messages. Changesets are intentionally not used while this remains one GitHub-tag-distributed package with a small release surface.

## Prepare the release

1. Confirm every release-worthy change has a concise entry under `Unreleased` in `CHANGELOG.md`.
2. Run `npm run agent:export`, review the generated token, manifest, and agent context diffs, and commit them with their canonical source changes. The release commit must not contain stale or unreviewed generated artifacts.
3. Run `npm run validate` and `npm run test:browser` from the repository root.
4. Update the version without creating a tag yet:

   ```bash
   npm version minor --no-git-tag-version
   ```

   Replace `minor` with `patch`, `major`, or an exact stable version. This updates both `package.json` and `package-lock.json`.
5. Move the relevant `Unreleased` notes into a dated heading such as `## [1.1.0] - 2026-08-27`. Leave an empty `Unreleased` section at the top.
6. Verify the package boundary and release metadata:

   ```bash
   npm run release:check -- vX.Y.Z
   npm run package:check
   npm run release:notes -- vX.Y.Z
   ```
7. Commit the version, lockfile, and changelog together. Review and merge that commit to `main` through the required `Validate design system` status check.

## Tag and publish the GitHub Release

Tag the exact validated commit on `main`:

```bash
git tag -a vX.Y.Z -m "@ai-created/ui vX.Y.Z"
git push origin vX.Y.Z
```

Pushing a `v*.*.*` tag runs `.github/workflows/release.yml`. The workflow repeats the complete quality and browser gates, verifies that the tag, package version, lockfile, and changelog agree, checks the packed file boundary, and then creates the GitHub Release from that version's changelog section.

The workflow's write permission exists only in the final release job after validation. Pull request code and dependency installation run with read-only repository access.

## Update consumers

After the GitHub Release exists, Renovate opens a tag update PR in each registered consumer on its configured schedule. The expected manifest shape is:

```json
{
  "dependencies": {
    "@ai-created/ui": "git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z"
  }
}
```

For normal adoption, wait for the scheduled PR. For immediate adoption, use the two Dependency Dashboard actions in order: request a Renovate rescan, then check the update-specific schedule-bypass box after the dashboard refreshes. A private repository dashboard may return 404 until the browser is signed into an authorized GitHub account.

For every consumer:

1. Confirm the PR changes `package.json` and `package-lock.json` to the same release.
2. Wait for the registered consumer compatibility check to pass. In both current consumers, this is **Quality / Validate application**, which runs `npm run validate:ui-update`. Vercel is separate and does not replace it. The current consumer branches do not mechanically enforce this check, so the reviewer must.
3. Read the release notes and inspect visible or behavioral impact.
4. Merge manually. Major updates are always reviewed and no design-system update auto-merges.
5. Confirm the consumer's normal deployment completes from `main`, then smoke-test the affected production workflow.
6. Confirm the daily currency workflow returns to green.

See `docs/consumer-update-automation.md` for the exact scheduled and immediate runbooks, private-repository access note, and recovery table. See `docs/consumer-compatibility.md` for the required current and future consumer checks.

## Correct a bad release

Do not move or delete a published tag. Fix the problem on `main`, prepare the next patch release, and update consumers through a new PR. If a GitHub Release was created for a tag that never became usable, mark it clearly as superseded rather than rewriting the published history.
