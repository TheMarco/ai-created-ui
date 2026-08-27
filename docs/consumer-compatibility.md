# Consumer compatibility contract

`@ai-created/ui` is compatible only when its release update passes in every supported consumer. The compatibility mechanism is the release update pull request in each consumer repository.

## Supported consumers

| Consumer | Install | TypeScript | Build | Relevant tests |
|---|---|---|---|---|
| ai-created.com (`ai-created-nextjs`) | `npm ci --ignore-scripts`, credential cleanup, `npm rebuild` | `npm run typecheck` | `npm run build` | `npm run lint`, including its design-system rules |
| Human, Actually (`applyanator`) | `npm ci --ignore-scripts`, credential cleanup, `npm rebuild` | `npm run typecheck` | `npm run build:verify` | `npm run lint` and `npm run test:run` |

Human, Actually's `build:verify` generates Prisma Client and runs `next build`. It never runs `prisma db push`, migrations, workers, deployments, or any command that can write application data. Its CI database URLs point to an unreachable local address and are present only because Prisma validates their shape.

## Release update flow

1. `@ai-created/ui` publishes an immutable `vX.Y.Z` tag and GitHub Release.
2. Renovate opens a consumer pull request that updates both `package.json` and `package-lock.json`.
3. The consumer installs the private package, then removes repository credentials before running dependency lifecycle scripts or project code.
4. The consumer runs its complete `validate:ui-update` command.
5. A reviewer checks the release notes and visible or behavioral impact before merging.

PATCH and MINOR releases still require green checks and review. MAJOR releases require migration notes, a separate pull request, and explicit approval. Automerge remains disabled for every design-system update.

## Private repository authentication

Each consumer stores `AI_CREATED_UI_READ_TOKEN` as a GitHub Actions secret. It must be a fine-grained token with read-only Contents access to `TheMarco/ai-created-ui` and no consumer write permission.

The workflow uses the token only while `npm ci --ignore-scripts` fetches the private Git dependency. It removes the Git credential rewrite before `npm rebuild` or any repository script runs. This limits what install-time code can access and keeps consumer or production credentials out of the design-system repository.

Renovate must also be installed with read access to the private design-system repository and each consumer. Confirm `TheMarco/ai-created-ui` appears in the consumer dependency dashboard through the `github-tags` datasource after the first tag-based dependency is committed.

## Future consumer checklist

A new consumer is supported only after it has all of the following:

1. An explicit dependency on `github:TheMarco/ai-created-ui#vX.Y.Z`, never `main` or an unversioned GitHub spec.
2. `transpilePackages: ['@ai-created/ui']` when using Next.js.
3. The shared Tailwind preset and the package source path in Tailwind content scanning.
4. `@import '@ai-created/ui/styles/tokens.css'` before local CSS rules.
5. A committed lockfile resolving the exact release-tag commit.
6. Dedicated `typecheck`, production-equivalent build, relevant test, and `validate:ui-update` commands.
7. The reviewed Renovate configuration from `docs/examples/consumer-renovate.json`.
8. A consumer-local quality workflow based on `docs/examples/consumer-quality.yml`.
9. No database migration, deployment, production secret, or external write in the compatibility workflow.
10. A named maintainer who reviews breaking changes and visual or behavioral release notes.

## Failure policy

A failed consumer update blocks that consumer from adopting the release. Fix forward in the design system with a new patch when the shared package is at fault. Do not move a published tag, bypass required checks, weaken a consumer build to make an update pass, or expose consumer secrets to design-system pull requests.

The design-system release may still exist while a consumer update is blocked. Compatibility status is therefore represented by the consumer pull requests, not by the release workflow alone.
