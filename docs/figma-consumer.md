# Update Figma for a release

Say **“Release vX.Y.Z”** in this project. The agent includes the Figma update in that release task. To update only the kit for a specified version, say **“Update Figma for vX.Y.Z.”** This does not itself request a new code release.

The agent reviews all changes since the last audited snapshot, updates the existing [AI-Created UI library](https://www.figma.com/design/JArZlZoEHCZh5SdZ9FFOMA/AI-Created-UI), checks light and dark mode, and publishes the library and its existing [Community resource](https://www.figma.com/community/file/1677871391096215128) after source acceptance. Ordinary development and pull requests can proceed without a Figma sync. There is no schedule, watcher or background process.

The update runs during the requested project task using the authenticated Figma MCP. Declaring a version outside that task, such as pushing a Git tag directly, does not invoke the MCP. Release CI verifies the recorded audit and publication evidence and blocks an incomplete release; it does not edit Figma.

## Release workflow

1. **Select the requested version.** Confirm the package version and canonical source match the requested release. For an existing immutable tag, use that tag's source, not newer working-tree changes. For a new release, finalize its version metadata before auditing. Run `npm run agent:export`, then `npm run figma:plan` to identify accumulated additions, changes and removals since the recorded snapshot.
2. **Update the library.** Read the changed canonical sources and complete component contracts. Use the `figma-use` and `figma-generate-library` skills to reconcile affected variables, styles, components, states, templates and documentation through the Figma MCP. Preserve IDs, connected instances, overrides, auto layout and editable properties. Add coverage for new public components; treat deletions and incompatible property changes as compatibility work.
3. **Review the result.** Inspect actual screenshots, light/dark modes, affected accents, desktop/mobile compositions and applicable exceptional states. Check variant coverage, aliases, bindings and text wrapping. Explain runtime-only changes with no Figma impact. Save real audit evidence under `figma/audits/` and record it with `npm run figma:record -- --evidence figma/audits/<audit>.json`. Run the required source validations. Source changes during review require another affected review.
4. **Publish and verify.** Once the release source is accepted on main, publish the source library and update the existing Community resource. Verify both in Figma. Record the exact fingerprint and ISO `verifiedAt` in the audit's `publication.library` and `publication.community`, then run `npm run figma:record -- --evidence figma/audits/<audit>.json --published-library --published-community`. Even a release with no visual changes requires verification that the published kit remains correct. Connected library users review updates; Community duplicates remain independent.
5. **Finish the release.** Update website kit facts and real previews if affected. Commit the verified receipts before creating a new immutable release tag, then run `npm run release:check -- vX.Y.Z`. For an existing tag, retain that immutable source and record the verified Figma catch-up separately; do not move the tag or mix newer source into its audit. Report the synced version, Figma link and any remaining blocker.

## Checks and evidence

| Command | Purpose |
| --- | --- |
| `npm run figma:plan` | Read-only diff against the last audited source; exits successfully even when changes are pending. |
| `npm run figma:check` | Explicitly check audit freshness; not part of ordinary `agent:check` or `validate`. |
| `npm run figma:record -- --evidence <audit.json>` | Record a verified audit; never edits or publishes Figma. |
| `npm run figma:release-check` | Require a current audit and both publication receipts; also runs inside `release:check`. |

`figma/consumer.json` identifies the consumer. The generated `figma/consumer.lock.json` records source content, package version, observed assets, review evidence and separate publication receipts. The initial baseline includes reviewed working-tree improvements beyond the immutable v1.4.0 tag; its version alone is not proof of release parity.

The fingerprint covers package source, styles, runtime/peer dependencies, shared Tailwind mapping, component and principal contracts, component documentation, reference styling, the design-system guide and agent templates. Website marketing copy, tests, build tooling and generated artifacts do not invalidate it by themselves. Changes accumulate until the next release or explicit Figma update.

Use the baseline audit as the schema example. An audit must contain the exact source fingerprint and file key, ISO audit time, reviewer, all reviewed component IDs, five passed checks, evidence references, observed asset IDs/names, variable/style counts and theme collections. Carry forward unaffected evidence explicitly. Never hand-edit the lock, relabel an old audit with a new fingerprint, or claim a complete fresh inspection after reviewing only a subset. These checks establish recorded review and publication status; they do not independently prove visual parity.

Source remains canonical. Preserve unrelated work, shared assets and exact fonts. Existing blocked migrations remain pending. Authentication, fonts, account entitlements or an approval block may prevent completion; report the exact blocker and leave the release pending. Do not auto-merge source changes or publish unaccepted source. The standing authorization for verified library and Community publication applies to accepted changes on main.
