# Keeping a consumer site up to date

This guide is for anyone whose application installs `@ai-created/ui` from a
published Git tag. It explains how to hear about new releases and have
Renovate prepare an update for review.

## What happens when a release is published?

Existing applications stay on the version they installed. A release never
changes a consumer automatically, and published Git tags are immutable.

If Renovate is enabled, it notices a newer release and opens a pull request.
The pull request updates the manifest and lockfile together. You review the
release notes, run the application's checks, inspect any visual changes, and
merge manually when ready. Your normal deployment then takes the change live.

Without Renovate (or another dependency updater), nothing happens until you
choose to update the dependency yourself or subscribe to release notifications.

## Set up Renovate from scratch

1. Install a reviewed immutable tag in the application:

   ```json
   "@ai-created/ui": "git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z"
   ```

   Keep the `vX.Y.Z` tag. Do not install from `main`.

2. Add the example configuration from
   [`docs/examples/consumer-renovate.json`](examples/consumer-renovate.json)
   as `renovate.json` in the application repository.

3. Enable Renovate for the repository using the Renovate GitHub App or your
   organization's Renovate runner. Give it permission to read the package
   repository's releases/tags and open pull requests in the application.

4. Check the Renovate Dependency Dashboard. It should recognize the package
   through the `github-tags` datasource and SemVer versioning.

5. Commit the configuration. The first eligible release will produce a PR.

The example does not disable or reschedule unrelated dependencies. It only
adds a focused rule for `@ai-created/ui`.

## Add the rule to an existing Renovate configuration

Keep your existing `extends`, managers, schedules, and package rules. Copy
only the `@ai-created/ui` rule from the example into your existing
`packageRules` array. Do not replace your whole configuration unless you are
starting from scratch. Ensure that another rule does not disable this
dependency, and keep `automerge: false`.

Renovate opens eligible updates without a project-specific schedule. If you
prefer a cadence, add a schedule to this package rule, such as
`"schedule": ["every weekend"]`, or use your existing organization-wide
schedule. A schedule changes when the PR is opened; it does not change the
immutable-tag contract.

## Request an update immediately

If your configuration uses Renovate's Dependency Dashboard, open it in the
application repository and use its generic rescan or update-now action. The
exact button wording depends on your Renovate version. If the update is held
by a configured schedule, approve the specific update from the dashboard.

You can also run Renovate's normal on-demand job in your own CI setup. These
actions request discovery or a PR; they never merge or deploy it.

## Review and merge the pull request

Before merging, confirm:

1. `package.json` points to the intended `#vX.Y.Z` tag.
2. `package-lock.json` (or your package manager's lockfile) resolves the
   commit behind that same tag.
3. Release notes and migration notes have been read.
4. The consumer-owned tests, typecheck, production build, and design-policy
   checks pass.
5. Visible changes have been reviewed in a local or preview build, including
   responsive and keyboard behavior where relevant.
6. A person has manually approved and merged the PR.

After merging, perform a smoke test on the deployed application. Keep major
updates separate: they may require migration work and should never be
automerged.

## Optional currency monitoring

You may add a scheduled workflow that runs the package's released currency
check. It can report when the application's immutable tag is behind the
latest release. This is a monitor only: it does not open, merge, or deploy a
PR. Keep its reusable-workflow reference pinned to a reviewed immutable tag,
and update that reference as part of your normal dependency review.

## Troubleshooting

| Symptom | What to check |
|---|---|
| No PR appears | Renovate is enabled, the package uses `github-tags` and SemVer, the release tag exists, and the dashboard has repository access. |
| Update is delayed | A schedule may apply. Run the dashboard's update-now action or wait for the configured window. |
| Only the lockfile changes | Do not merge. The manifest and lockfile must adopt the same immutable tag. |
| Checks fail | Read the failing consumer test, build, accessibility, or policy check and fix the application or investigate a package regression. |
| Preview fails while checks pass | Treat deployment configuration and preview infrastructure as a separate consumer concern. |
| Currency monitor is red | Confirm the manifest and lockfile agree, then rerun the monitor after the update is merged. |
| A deployed smoke test fails | Roll forward with a consumer fix or a new package release. Never move an already-published tag. |

## Remove the automation

To stop Renovate updates for this package, remove the package rule (or set
the package rule's `enabled` value to `false`) and remove any optional
currency-monitor workflow. Existing installed versions remain unchanged.

## Safety contract

- Consumers install reviewed immutable `git+https` tags, never `main`.
- The manifest and lockfile are reviewed together.
- PATCH and MINOR updates still require passing checks and human review.
- MAJOR updates are separated and require migration review.
- Automerge is disabled for design-system updates.
