# Consumer dependency update automation

## Supported consumers

`consumers.json` is the canonical inventory. The current supported repositories are:

| Product | Repository | Required validation |
|---|---|---|
| ai-created.com | `TheMarco/ai-created.com` | `npm run validate:ui-update` |
| Human, Actually | `TheMarco/human-actually` | `npm run validate:ui-update` |

Both install an explicit immutable release tag:

```json
"@ai-created/ui": "git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z"
```

The design-system release does not edit, merge, or deploy consumer repositories directly.

## Normal scheduled flow

```text
@ai-created/ui GitHub Release
    -> Renovate detects the newer SemVer tag
    -> Renovate opens one manifest and lockfile PR per consumer
    -> registered consumer compatibility check runs
    -> reviewer checks release notes and product impact
    -> reviewer merges
    -> consumer deployment provider deploys from main
    -> product owner verifies the deployed consumer
```

The reviewed configuration in `docs/examples/consumer-renovate.json` checks before 9am Pacific on Monday. It tracks only `@ai-created/ui`, pins SemVer tags, separates major releases, and keeps automerge disabled. With the normal flow, no dashboard action is needed. Wait for the scheduled Renovate run, then review the PR.

## Adopt a release immediately

Renovate's Dependency Dashboard uses two separate actions when an update is outside the configured schedule:

1. Open the Dependency Dashboard issue in the consumer repository while signed into GitHub with access to that private repository.
2. Check **Trigger a request for Renovate to run again**. This is a rescan. It discovers the new tag but might not create a PR because the normal Monday schedule still applies.
3. Wait for the dashboard to refresh. A second checkbox appears for the specific `@ai-created/ui` update, typically titled `fix(deps): update dependency @ai-created/ui to vX.Y.Z`.
4. Check that update-specific box. This bypasses the schedule for that update and asks Renovate to create the PR now.
5. Repeat the same two-action sequence in every supported consumer that should adopt the release immediately.

A private GitHub repository or issue can return `404 Not Found` when the browser session is signed out or signed into an account without access. A 404 does not prove that the Dependency Dashboard is missing. Sign into the authorized GitHub account and reopen the repository's Issues page.

## Review the consumer PR

The expected PR changes both `package.json` and `package-lock.json`. Confirm that the manifest names `#vX.Y.Z` and that the lockfile resolves the commit behind the same tag. A lockfile-only SHA refresh is not a version adoption.

The contractually required design-system gate is each consumer's registered compatibility check. In both current consumers, the workflow is named **Quality** and its PR job is **Validate application**; that job runs `npm run validate:ui-update`. It covers the consumer's design-policy lint, TypeScript validation, production-equivalent build, and relevant tests. Do not confuse it with deployment-provider checks such as Vercel preview, preview comments, or other integration statuses. Provider checks can be useful for visual review, but they do not replace the compatibility check. The current consumer `main` branches do not mechanically enforce this through branch protection, so the reviewer must wait for it by policy before merging.

Before merging:

1. Read the design-system release notes, especially migrations and visible or behavioral changes.
2. Confirm that both the manifest and lockfile changed to the intended tag.
3. Wait for **Quality / Validate application**, the required consumer compatibility check, to pass.
4. Inspect the provider preview when the change has visible impact or the consumer requires it.
5. Merge manually. Automerge remains disabled for every design-system update.

After merge, the consumer's normal deployment integration deploys `main`. Verify the actual consumer, not only the preview:

- ai-created.com: verify the production deployment from `TheMarco/ai-created.com` and smoke-test the affected public UI.
- Human, Actually: verify the production deployment from `TheMarco/human-actually` and smoke-test the affected authenticated workflow without running schema or data mutations as part of compatibility validation.

## Currency monitoring

Every registered consumer calls the reusable currency workflow on a daily schedule and when its manifest changes:

```yaml
name: Design-system currency

on:
  schedule:
    - cron: '17 15 * * *'
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - package.json
      - package-lock.json

permissions:
  contents: read

jobs:
  currency:
    uses: TheMarco/ai-created-ui/.github/workflows/consumer-currency.yml@vX.Y.Z
```

The reusable workflow installs without lifecycle scripts and runs `npx --no-install ai-created-ui-agent consumer-status`. It fails whenever the installed immutable tag is older than the latest reviewed GitHub Release. The monitor makes staleness visible; it does not open, merge, or deploy an update. Keep the workflow reference on a reviewed release and update that reference only when the monitoring contract itself changes.

## Failure and recovery

| Symptom | Meaning | Recovery |
|---|---|---|
| Dependency Dashboard link returns 404 | Browser lacks access to the private repository, or the issue link is wrong | Sign into the authorized GitHub account and open the repository's Issues page to find its Dependency Dashboard |
| Rescan completes but no PR appears | Renovate found the release but the update is still outside its schedule | Check the new update-specific schedule-bypass box on the refreshed dashboard |
| No update-specific box appears | Renovate has not discovered the tag, the app lacks repository access, or the dependency/configuration is not recognized | Confirm the GitHub Release exists, the dependency uses `#vX.Y.Z`, Renovate has consumer access, and the dashboard reports `github-tags` with SemVer |
| PR changes only the lockfile | The manifest was not advanced to the new release contract | Do not merge as adoption; correct the manifest and regenerate the lockfile together |
| Required compatibility check fails | The release is not yet proven in that consumer | Read the failing command, reproduce `npm run validate:ui-update`, then fix the consumer or publish a new design-system patch when the package is responsible |
| Provider preview fails but compatibility passes | Deployment configuration or preview environment needs attention | Investigate the provider failure separately and follow the consumer's branch-protection and deployment policy |
| Currency workflow stays red after merge | The merged manifest or lockfile is stale, or the monitor is reading a different package state | Run `npx --no-install ai-created-ui-agent consumer-status`, confirm both files resolve the adopted tag, and rerun the workflow |
| Production verification fails | The consumer deployed but the release caused a real integration regression | Roll forward with a consumer fix or a new design-system patch. Never move a published tag |

## Activation checklist for a new consumer

1. Install the latest reviewed `#vX.Y.Z` tag and commit the matching lockfile.
2. Add the reviewed `renovate.json` configuration from `docs/examples/consumer-renovate.json`.
3. Authorize Renovate for the consumer repository and confirm the dashboard recognizes `TheMarco/ai-created-ui` through `github-tags` with SemVer.
4. Add a safe `validate:ui-update` command and the workflow from `docs/examples/consumer-quality.yml`.
5. Add the daily currency workflow.
6. Register the canonical repository, owner, manifest, and validation command in `consumers.json`.
7. Keep automerge disabled and name the human responsible for review and production verification.

The complete acceptance contract is in `docs/consumer-compatibility.md`.

## Update policy

- PATCH and MINOR updates may share the same Renovate PR stream, but still require green checks and review.
- MAJOR updates must be separate, include migration notes, and never auto-merge.
- The manifest and lockfile change together.
- Published tags are immutable. Consumers never follow `main`.
