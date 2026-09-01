# Consumer compatibility contract

This contract applies to any application that installs `@ai-created/ui`. A consumer owns its repository, update cadence, continuous integration, deployment, and final adoption decision. The design-system repository publishes immutable releases and compatibility guidance; it does not need to know that the consumer exists.

## Version boundary

Install an explicit public Git tag:

```json
"@ai-created/ui": "git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z"
```

Never install a moving `main` branch. An existing application remains on its installed release until its owner updates both the manifest and lockfile. Publishing a new release cannot silently change a deployed consumer.

## Release update flow

1. `@ai-created/ui` publishes an immutable `vX.Y.Z` tag and matching GitHub Release.
2. An optional dependency updater, such as Renovate, detects the tag and proposes a pull request. Manual updates are also supported.
3. The update changes the consumer manifest and lockfile to the same release and commit.
4. Consumer-owned compatibility checks run in the consumer repository.
5. A reviewer reads the release and migration notes, checks visible or behavioral impact, and merges manually.
6. The consumer's normal deployment system deploys the merged change.
7. The consumer owner smoke-tests the affected deployed workflow.

Automerge should remain disabled. PATCH and MINOR releases still require green checks and review. MAJOR releases require a separate pull request and explicit migration review.

## Required consumer checks

Every consumer chooses commands appropriate to its stack, but its update pull request should prove all applicable parts of this contract:

- dependencies install from the committed lockfile without needing access to private design-system source;
- the application typechecks and lints;
- relevant unit, integration, and accessibility tests pass;
- the design-policy validator scans the application source and reports no unapproved new drift;
- a production-equivalent build completes without deployments, migrations, or external writes;
- visible changes are reviewed at relevant breakpoints and with keyboard interaction when applicable.

Provider previews are useful evidence but do not replace application checks. Likewise, a green dependency-status monitor proves version freshness, not product behavior. Repositories may enforce checks with branch protection; otherwise the reviewer must wait for them before merging.

## Consumer setup checklist

1. Install an explicit `git+https` `#vX.Y.Z` dependency and commit the matching lockfile.
2. For Next.js, add `@ai-created/ui` to `transpilePackages` when required by the installed framework version.
3. Import `@ai-created/ui/styles/tokens.css` once before consumer overrides.
4. Use the shared Tailwind preset and include the package source in content scanning where the Tailwind version requires it.
5. Add consumer-owned typecheck, lint, test, accessibility, production-build, and design-policy commands.
6. Run those commands in a pull-request workflow without production secrets, schema changes, deployments, or other external writes.
7. Optionally configure Renovate using `docs/examples/consumer-renovate.json` and the public setup guide in `docs/consumer-update-automation.md`.
8. Optionally schedule `npx --no-install ai-created-ui-agent consumer-status` to make an outdated installed release visible.
9. Name the person or team responsible for dependency review, deployment, and post-deployment verification.

No registration in this repository is required. A team with many applications may keep its own inventory, shared Renovate preset, or organization dashboard, but those are consumer-owned operational choices rather than package requirements.

## Failure policy

A failed consumer update blocks only that consumer from adopting the release. If the shared package caused the problem, report it and use a new patch release to fix forward. If the consumer caused it, repair the consumer in the update pull request.

Do not move a published tag, bypass failed checks, weaken a build merely to make an update pass, or expose production credentials to dependency pull requests. If compatibility passes but a preview or production deployment fails, investigate the consumer's deployment configuration separately.

The update is complete only after the manifest and lockfile agree, consumer checks pass, a person merges the change, deployment succeeds, and the affected workflow has been verified.
