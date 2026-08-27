# 004: Public source with GitHub-tag distribution

Date: 2026-08-27

## Context

Version 1.1.0 established GitHub-only SemVer releases and consumer compatibility checks while the source repository was private. Private distribution required cross-repository read tokens in every consumer and extra credential handling during installation.

The design system is now intended to be open source. Public source removes that operational burden and makes the implementation, contracts, playground, and contribution process available to other teams. A registry publishing pipeline is still a separate concern because the package intentionally ships raw TypeScript source.

## Decision

Publish the repository under the MIT License and keep immutable GitHub SemVer tags as the distribution channel.

Consumers install an explicit public HTTPS Git tag such as `git+https://github.com/TheMarco/ai-created-ui.git#v1.1.0`. They do not follow `main`, and their lockfiles must resolve the exact tagged commit.

Keep `private: true` in `package.json` as an npm-registry publication guard. Here, “private” describes registry publication only; it does not describe repository visibility or source licensing. Publishing compiled artifacts to npm requires a separate decision and migration plan.

This decision supersedes the private-repository authentication portions of decisions 002 and 003. Their SemVer, release-gate, compatibility-PR, and no-automerge decisions remain in force.

## Consequences

- Consumer CI uses credential-free `npm ci --ignore-scripts`, followed by lifecycle rebuild and application validation.
- No `AI_CREATED_UI_READ_TOKEN` or repository credential rewrite is required.
- Renovate needs access only to each consumer repository; the public release tags are readable without design-system repository authorization.
- Contributions are accepted through reviewed pull requests that pass the same quality, accessibility, browser, and visual gates as maintainer changes.
- Consumers still need Next.js transpilation and Tailwind source scanning because the package remains raw TypeScript source.
