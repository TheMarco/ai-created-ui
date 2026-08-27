# Contributing

Thanks for helping improve `@ai-created/ui`. This repository is the source of truth for the components, tokens, motion helpers, documentation, and live playground used across AI-Created products.

## Before opening a pull request

1. Start from the latest `main` branch and keep the change focused.
2. Preserve existing public component, prop, token, and behavior contracts unless the change is intentionally breaking and includes migration guidance.
3. Add or update component, accessibility, and browser coverage in proportion to the change.
4. Update the live playground and reviewed component documentation when public behavior changes.
5. Add a concise release-worthy note under `Unreleased` in `CHANGELOG.md`.
6. Run the required checks:

   ```bash
   npm ci
   npm ci --prefix playground --install-links
   npm run validate
   npx playwright install chromium
   npm run test:browser
   ```

Visual baseline changes must be intentional and reviewed. Do not regenerate snapshots to hide an unexplained difference.

## Design-system boundaries

Promote a component or token here when it is generic, reusable, and likely to serve more than one product. Keep product-specific composition, data models, and business behavior in the consumer application.

See `DESIGN-SYSTEM.md` for the visual and interaction contract, `README.md` for integration guidance, and `RELEASING.md` for maintainer release steps.
