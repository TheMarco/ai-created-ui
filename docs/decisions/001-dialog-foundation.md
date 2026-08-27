# 001: Shared dialog foundation

Date: 2026-08-27

## Context

The package had two modal APIs. `Dialog` used Headless UI and inherited focus trapping, Escape handling, scroll locking, nested-dialog stacking, and focus restoration. The composable `ModalOverlay` family used a custom portal and backdrop click handler, even though the design-system contract promised the same keyboard and focus behavior. `ConfirmDialog` depended on the custom family, so its alert-dialog role did not provide modal focus behavior by itself.

The composable Modal API is already used extensively by Human, Actually. Replacing its component names or composition model would create unnecessary consumer churn.

## Decision

Keep `ModalOverlay`, `ModalPanel`, `ModalHeader`, `ModalBody`, and `ModalFooter` as the public composition API. Implement `ModalOverlay` on Headless UI Dialog internally. Register `ModalHeader` heading and description with the Headless UI context, forward refs from each native-root primitive, and keep `closeOnBackdrop` as an explicit policy implemented inside the dialog panel.

`Dialog` remains the compact pre-composed API. `ConfirmDialog` remains the confirmation-specific composition and uses `role="alertdialog"` on the semantic dialog root.

## Why

- Consumers keep their current imports, prop names, size variants, and layout composition.
- Both modal paths now inherit one tested focus and keyboard foundation.
- Nested modals, focus restoration, Escape, and scroll locking no longer require custom implementations.
- `closeOnBackdrop={false}` remains independent from Escape behavior.

## Consequences

- `@headlessui/react` is the behavior foundation for both modal APIs and remains a peer dependency.
- `ModalHeader` must be rendered inside `ModalOverlay` because it registers a dialog title and description.
- Custom headers that do not use `ModalHeader` must provide `aria-label` on `ModalOverlay`.
- A modal without `onClose` is intentionally non-dismissible. Consumers should reserve that mode for genuinely blocking work.
- Focus, backdrop policy, nested layers, accessible naming, and loading dismissal are covered by component tests.
