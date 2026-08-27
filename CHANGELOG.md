# Changelog

Notable changes to `@ai-created/ui` are recorded here. Entries are written and reviewed by people when the change is made. Versions are not inferred from commit messages.

## [Unreleased]

### Added

- MIT licensing, contribution guidance, and a private vulnerability-reporting policy for the public source repository.

### Changed

- Consumer installation and CI guidance now use credential-free public HTTPS Git tags while npm registry publication remains disabled.

## [1.1.0] - 2026-08-27

### Added

- Root quality gates for typechecking, linting, component behavior, accessibility, production builds, package contents, browser smoke tests, and visual regression.
- A minimal reference and semantic token architecture with documented token-creation rules.
- Audited component contracts, keyboard coverage, accessibility behavior, and exported public types.
- A complete playground component reference with reviewed API, state, composition, and accessibility guidance.
- GitHub-only SemVer release governance, tag validation, and consumer update guidance.
- Consumer-local compatibility contracts, CI templates, and onboarding guidance for current and future applications.

### Changed

- The package remains raw TypeScript source, but its public package boundary is now verified before release.
- Dialog and modal families share a tested Headless UI behavior foundation without changing their public composition APIs.

## [1.0.0] - 2026-04-10

### Added

- Initial private GitHub-distributed design-system package.
