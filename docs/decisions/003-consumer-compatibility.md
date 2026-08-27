# 003: Consumer update pull requests as compatibility tests

Date: 2026-08-27

## Context

The design system serves two private applications with different build and deployment constraints. ai-created.com is a mostly static Next.js application. Human, Actually uses Prisma, Vercel, a Fly worker, and production schema synchronization. Testing both unreleased consumers centrally from the design-system repository would require cross-repository credentials and consumer environment knowledge.

The release roadmap offers two compatibility models: centrally checking out consumers, or treating dependency update pull requests as the compatibility check.

## Decision

Use consumer-local release update pull requests as the compatibility mechanism.

Renovate tracks `@ai-created/ui` SemVer tags and updates each consumer's manifest and lockfile. Each consumer owns a `validate:ui-update` command and a read-only GitHub Actions workflow that performs a clean install, typecheck, safe production-equivalent build, and relevant tests. Reviewers merge only after those checks and release-note review pass.

Keep automerge disabled. Major versions always use separate, explicitly reviewed pull requests with migration notes.

## Why

- Each application is validated in its real dependency and build environment.
- Consumer credentials and environment policy remain inside the consumer repository.
- Human, Actually can provide a verification build that never mutates its database.
- Failures appear where their fixes and deployment consequences are easiest to understand.
- The design-system workflow needs no cross-repository token or consumer production secret.

## Consequences

- Compatibility feedback arrives after a release tag exists rather than before every design-system merge.
- A release is not considered adopted until both consumer update pull requests pass and are reviewed.
- Consumers must maintain their validation scripts when their build architecture changes.
- The private Git dependency requires a narrowly scoped read token during installation. Workflows install with scripts disabled, remove the credential, and only then run lifecycle scripts and validation.
- Adding a consumer requires completing the checklist in `docs/consumer-compatibility.md`.
- Central candidate testing remains deferred. Reconsider it only if consumer update failures become frequent enough to justify the extra credentials and orchestration.
