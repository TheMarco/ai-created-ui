# Consumer dependency update automation

## Target flow

```text
@ai-created/ui GitHub Release
    -> Renovate sees a newer SemVer tag
    -> consumer manifest and lockfile update PR
    -> consumer CI and review
    -> merge
```

The known consumers are ai-created.com in `ai-created-nextjs` and Human, Actually in `applyanator`. Both currently resolve a GitHub commit. The target dependency is an explicit immutable release tag:

```json
"@ai-created/ui": "github:TheMarco/ai-created-ui#v1.1.0"
```

## Why Renovate

Renovate's npm manager supports the `github-tags` datasource and npm lockfile maintenance. This matches the existing private GitHub dependency without introducing a package registry. Dependabot remains suitable for registry packages and GitHub Actions, but its documented npm flow does not establish the same explicit tag-update contract for this repository shape.

The reviewed starting configuration is `docs/examples/consumer-renovate.json`. Copy it to `renovate.json` in each consumer repository. The Renovate GitHub App must have access to the design-system repository as well as the consumer so it can read private tags and update the lockfile.

## Activation checklist

For each consumer:

1. Change the manifest from an unversioned or commit-pinned GitHub dependency to the latest released `#vX.Y.Z` tag.
2. Run `npm install` so `package-lock.json` resolves the exact commit behind that tag.
3. Add the reviewed Renovate configuration and install or authorize Renovate for both private repositories.
4. Confirm the Renovate dependency dashboard recognizes `TheMarco/ai-created-ui` through `github-tags` with SemVer versioning.
5. Require the consumer's install, TypeScript, production build, and relevant tests on update PRs.
6. Keep automerge disabled. Review every major release and any visual or behavioral change.

## Current consumer contracts

- ai-created.com has a dedicated typecheck command and a `validate:ui-update` contract covering design-system lint, TypeScript, and its production build.
- Human, Actually has a non-mutating `build:verify` that generates Prisma Client and builds with unreachable local database URLs. Its `validate:ui-update` also runs lint and the current Vitest suite.
- Both consumers include read-only quality workflows and Renovate configuration scoped only to `@ai-created/ui`.
- The workflows remove private-repository credentials before lifecycle scripts or repository code runs.

Activation still requires the first governed `v1.1.0` tag, the `AI_CREATED_UI_READ_TOKEN` secret in each consumer, and Renovate GitHub App access to all three private repositories. The complete acceptance and future-consumer contract is in `docs/consumer-compatibility.md`.

## Update policy

- PATCH and MINOR updates may share the same Renovate PR stream, but still require green checks and review.
- MAJOR updates must be separate, include migration notes, and never auto-merge.
- The manifest and lockfile change together. A lockfile-only SHA refresh is not a version upgrade contract.
- Published tags are immutable. Renovate should never be asked to follow `main`.
