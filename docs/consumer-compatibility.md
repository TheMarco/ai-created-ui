# Consumer compatibility contract

`@ai-created/ui` is compatible only when its release update passes in every supported consumer. The compatibility mechanism is the release update pull request in each consumer repository.

## Supported consumers

| Consumer | Canonical repository | Install | TypeScript | Build | Relevant tests |
|---|---|---|---|---|---|
| ai-created.com | `TheMarco/ai-created.com` | `npm ci --ignore-scripts`, `npm rebuild` | `npm run typecheck` | `npm run build` | `npm run lint`, including its design-system rules |
| Human, Actually | `TheMarco/human-actually` | `npm ci --ignore-scripts`, `npm rebuild` | `npm run typecheck` | `npm run build:verify` | `npm run lint` and `npm run test:run` |

Human, Actually's `build:verify` generates Prisma Client and runs `next build`. It never runs `prisma db push`, migrations, workers, deployments, or any command that can write application data. Its CI database URLs point to an unreachable local address and are present only because Prisma validates their shape.

## Release update flow

1. `@ai-created/ui` publishes an immutable `vX.Y.Z` tag and GitHub Release.
2. On its configured schedule, Renovate opens a consumer pull request that updates both `package.json` and `package-lock.json`. An operator can request immediate adoption through the two-step Dependency Dashboard flow documented in `docs/consumer-update-automation.md`.
3. The consumer installs the public HTTPS Git dependency with lifecycle scripts disabled, then runs lifecycle scripts without any repository credential.
4. The consumer's registered compatibility check runs its complete `validate:ui-update` command. In both current consumers, this is the **Validate application** job in the **Quality** workflow.
5. A reviewer distinguishes that required compatibility result from provider previews, checks the release notes and visible or behavioral impact, then merges manually.
6. The consumer's normal provider deploys the merged `main` branch and the product owner verifies the affected production workflow.
7. The scheduled currency workflow returns to green after the release tag is adopted.

PATCH and MINOR releases still require green checks and review. MAJOR releases require migration notes, a separate pull request, and explicit approval. Automerge remains disabled for every design-system update.

The update is complete only when the manifest and lockfile resolve the same release, the registered compatibility check is green, the PR is merged, the production deployment succeeds, and the affected workflow has been verified. A green Vercel preview or other provider status does not replace `validate:ui-update`. A green currency monitor proves version freshness, not product behavior. The current consumer `main` branches do not mechanically require the compatibility check through branch protection, so reviewers enforce it as release policy.

## Public repository installation

Consumers install an explicit public HTTPS Git tag. No `AI_CREATED_UI_READ_TOKEN`, SSH deploy key, or cross-repository credential is required.

The workflow still uses `npm ci --ignore-scripts` before `npm rebuild`. This preserves the install-time safety boundary without introducing a repository credential that lifecycle code could access.

Renovate needs access to each consumer repository. The public design-system tags are readable without separate repository authorization. Confirm `TheMarco/ai-created-ui` appears in the consumer dependency dashboard through the `github-tags` datasource after the first tag-based dependency is committed.

## Future consumer checklist

A new consumer is supported only after it has all of the following:

1. An explicit dependency on `git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z`, never `main` or an unversioned GitHub spec.
2. `transpilePackages: ['@ai-created/ui']` when using Next.js.
3. The shared Tailwind preset and the package source path in Tailwind content scanning.
4. `@import '@ai-created/ui/styles/tokens.css'` before local CSS rules.
5. A committed lockfile resolving the exact release-tag commit.
6. Dedicated `typecheck`, production-equivalent build, relevant test, and `validate:ui-update` commands.
7. The reviewed Renovate configuration from `docs/examples/consumer-renovate.json`.
8. A consumer-local quality workflow based on `docs/examples/consumer-quality.yml`.
9. No database migration, deployment, production secret, or external write in the compatibility workflow.
10. A named maintainer who reviews breaking changes and visual or behavioral release notes.
11. A scheduled call to the released `consumer-currency.yml` reusable workflow.
12. A documented production deployment owner and smoke-test target.

## Failure policy

A failed consumer update blocks that consumer from adopting the release. Fix forward in the design system with a new patch when the shared package is at fault. Do not move a published tag, bypass required checks, weaken a consumer build to make an update pass, or expose consumer secrets to design-system pull requests. If a provider preview or production deployment fails while compatibility passes, investigate the consumer's deployment configuration separately and follow its recovery policy.

The design-system release may still exist while a consumer update is blocked. Compatibility status is therefore represented by the consumer pull requests and post-merge verification, not by the release workflow alone. The daily currency workflow makes delayed adoption visible but does not create a PR, merge it, deploy it, or certify the product workflow.
