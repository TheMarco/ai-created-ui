# Contributing

Thanks for helping improve `@ai-created/ui`. This repository is the source of truth for the components, tokens, motion helpers, documentation, and live playground used across AI-Created products.

## Before opening a pull request

1. Read `AGENTS.md` before implementation. Query `design-system.manifest.json` instead of inferring component, token, guideline, or template contracts from portal markup.
2. Start from the latest `main` branch and keep the change focused.
3. Preserve existing public component, prop, token, and behavior contracts unless the change is intentionally breaking and includes migration guidance.
4. Update the complete reviewed contract when public behavior changes: runtime source, compact docs, detailed spec, construction guidance, controls, live specimen, synchronized code, and applicable tests.
5. Add or update component, accessibility, and browser coverage in proportion to the change.
6. Update the specification portal and principal guidelines when shared behavior, visual language, content rules, or governance changes.
7. Run `npm run agent:export`, inspect every generated token, manifest, and context diff, and commit those generated changes with their canonical source changes.
8. Add a concise release-worthy note under `Unreleased` in `CHANGELOG.md`.
9. Run the required checks:

   ```bash
   npm ci
   npm ci --prefix playground --install-links
   npm run agent:check
   npm run validate
   npx playwright install chromium
   npm run test:browser
   ```

`npm run agent:check` and `npm run validate` are blocking drift gates, not cleanup commands. Visual baseline changes must be intentional and reviewed. Do not regenerate snapshots to hide an unexplained difference.

## Design-system boundaries

Promote a component or token here when it is generic, reusable, and likely to serve more than one product. Keep product-specific composition, data models, and business behavior in the consumer application.

See `DESIGN-SYSTEM.md` for the visual and interaction contract, `README.md` for integration guidance, and `RELEASING.md` for maintainer release steps.

## Generated artifacts

`styles/tokens.css`, runtime source, component registries, principal guidelines, and `AGENTS.md` are canonical. Generated JSON and agent context files are derived projections. Regenerate them with `npm run agent:export`; never hand-edit a generated projection to disagree with its source.

Pull requests must pass the required `Validate design system` status check before merge. The check runs the complete non-browser validation and real-browser suites against the proposed commit.
