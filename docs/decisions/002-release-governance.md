# 002: GitHub-only release governance

Date: 2026-08-27

Status: Superseded in part by decision 004. GitHub-tag release governance remains current; private-repository authentication does not.

## Context

At the time of this decision, `@ai-created/ui` was a private, raw TypeScript source package used by ai-created.com and Human, Actually. Both consumers installed it from GitHub and their lockfiles resolved an exact commit. The repository had a `1.0.0` package version but no release tags, changelog, release checks, or consumer update automation. Public npm publication was not a product need.

## Decision

Keep GitHub distribution. Mark the package private in npm metadata to block accidental registry publication. Use stable SemVer in `package.json`, a matching annotated `vX.Y.Z` tag, dated human-reviewed changelog notes, and an automated GitHub Release after the complete quality gate passes.

Do not infer versions from commit messages. Do not add Changesets while this remains a single package with a small release surface. Reconsider it if concurrent release authors, multiple versioned packages, or release frequency make manual note aggregation unreliable.

Consumers should depend on explicit SemVer tags. Renovate is the preferred updater because its npm manager supports GitHub tag dependencies and lockfile updates. Consumer PRs are reviewed, and major updates are never auto-merged.

## Why

- Tags give consumers a stable, visible version instead of an unnamed moving commit.
- The changelog captures API intent at the time of change without adding a publishing pipeline.
- `private: true` makes the npm-registry distribution boundary enforceable.
- A separate write-capable release job prevents untrusted pull request code and dependency installation from receiving release permissions.
- Renovate fits the current GitHub dependency shape without moving the package to a registry.

## Consequences

- Consumers still compile the package's raw TypeScript source and need the documented Next.js and Tailwind integration.
- A release requires a deliberate version and changelog update before its tag is pushed.
- Tags are immutable. Corrections ship as a new patch release.
- Renovate access requirements were superseded when the design-system repository became public; each consumer still copies the reviewed configuration template.
- Candidate-against-consumer testing, safe consumer CI commands, and compatibility enforcement remain Phase 6 work.
- Publishing to npm later requires a separate decision that removes the private guard, defines a build artifact, and documents a migration plan.
