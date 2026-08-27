# Component Contract Audit

Audit date: 2026-08-27

This is the Phase 3 inventory of the public exports from `src/index.ts`. The audit was written before broad API work, then updated to record the compatibility-safe fixes accepted in this phase. “Ref status” identifies the exposed native root or shared foundation. “Current coverage” reflects this repository and its playground, not external application test coverage.

| Component/family | Native root/foundation | State model | Ref status | Current coverage | Phase 3 disposition |
| --- | --- | --- | --- | --- | --- |
| Button / `buttonStyles` | Native `button`, `forwardRef` | Native button events | Button ref | Native type override, ref, click, disabled, axe, variants, and playground demos | Preserved props and styles; documented accessible names for icon controls |
| Badge | Native `span` with HTML attributes | Stateless | Span ref | Native attributes/ref test, variants, and playground demo | Exported props; preserved variants and className |
| Surface / `surfaceStyles` | Native `div` with HTML attributes | Stateless; interaction classes are declarative | Div ref | Native attributes/ref test, variants, padding, interaction modes, and playground demo | Exported props/options; preserved style helper |
| Notice | `Surface` over a native `div` | Stateless; derives role and `aria-live` | Div ref | Native attributes/ref test, variants, icons, role, and live-region behavior | Preserved announcement defaults and added root ref consistency |
| Skeleton | Native `div` with HTML attributes | Stateless | Div ref | Native attributes/ref and `aria-hidden` test plus playground demo | Preserved decorative loading contract |
| EmptyState | `Surface` over a native `div` | Stateless | Div ref | Native attributes/ref test, decorative icon, composition, and playground demo | Exported props; made optional icon explicitly decorative |
| ErrorReport | `Notice` composition | Internal `expanded` and `copied` state | No public ref | Direct disclosure test and playground use | Exported props; fixed implicit form submission and added disclosure ARIA |
| Field primitives: `FieldGroup`, `FieldLabel`, `FieldLegend`, `FieldHint`, `TextInput`, `TextArea` and style helpers | Native `div`, `label`, `span`, `p`, `input`, and `textarea` | Native form state | Each primitive exposes its native root | Native association/attribute/ref tests, axe, and playground forms | Exported all props; documented explicit label and hint associations |
| Checkbox | Native checkbox input with styled wrapper | Controlled `checked`; `onChange(checked)` | Input ref | Click, disabled, label association, axe, and playground states | Preserved callback and native semantics; broader input attributes remain deferred |
| RadioGroup | Native fieldset, legend, and radio inputs | Controlled selected value; `onChange(value)` | Fieldset ref | Selection, disabled options, axe, and playground orientations | Preserved generic controlled API and native grouping |
| Toggle | Native button with switch semantics and visible label | Controlled `checked`; `onChange(checked)` | Button ref | Space/click, ref, disabled, axe, and playground states | Replaced an invalid label-for-button relationship without changing props |
| Slider | Native range input | Controlled numeric value; `onChange(number)` | Input ref | Value formatting/change, zero-width range, axe, and playground states | Preserved API; clamped progress styling to a finite 0-100 range |
| Dropdown | Headless UI Listbox over button/listbox primitives | Controlled selected value; `onChange(value)` | Button ref | Pointer, Enter/Arrow selection, disabled, axe, and playground states | Preserved generic API and Headless UI keyboard foundation |
| Tabs / `useTabPanelProps` | Native buttons with tablist/tab semantics | Controlled active key; `onChange(key)` | No public root ref | Click, roving focus, Arrow/Home/End, empty-list guard, linked panels, axe, and playground demo | Preserved key API; stable shared id remains explicit |
| Dialog | Headless UI Dialog | Controlled `open`; `onClose()` | No public ref | Label/description, focus trap, Escape, restoration, tab loop, axe, and playground demo | Registered description with the dialog context |
| Modal family: `ModalOverlay`, `ModalPanel`, `ModalHeader`, `ModalBody`, `ModalFooter` | Headless UI Dialog foundation with composable native layout roots | Mounted overlay; declarative panel composition | Overlay and every layout primitive expose their native roots | Label/description, focus trap, Escape, restoration, backdrop policy, nesting, and direct tests | Preserved names/composition; added the accessibility behavior already promised by docs |
| ConfirmDialog | Modal composition with `alertdialog` | Controlled `open`; confirm/cancel callbacks; loading lock | No public root ref | Alert-dialog name/description, actions, loading dismissal, custom loading label, and axe | Preserved callbacks; moved semantics to dialog root and fixed generic loading copy |
| Tooltip | Cloned child plus positioned tooltip element | Internal visible state from hover/focus/touch timing | Child ref depends on clone contract | Focus/blur, delayed visibility, `aria-describedby`, axe, and playground positions | Preserved current API; portal/collision/Escape work remains deferred |
| ThemedHeroImage | Next Image/container composition | Theme is read through CSS; overlay is declarative | No public ref | Theme-aware source, overlay, fade, and hero token usage | Exported props; preserved intentionally decorative image contract |
| ThemeProvider / `useTheme` | React context and DOM `html.light` class | Internal theme state plus localStorage/DOM synchronization | Context API, no DOM ref | Saved theme, pre-hydration class, persistence, and reduced-motion tests | Exported types; synchronized provider state with the document contract |
| ThemeToggle | Button using `useTheme` | Reads and toggles provider theme | No public ref | Saved-theme accessible label, provider persistence, and playground demo | Preserved behavior; label now follows synchronized provider state |

## Stable conventions

- Preserve existing `onChange` names and callback value shapes. `Checkbox` and `Toggle` emit booleans, `Slider` emits a number, and `Dropdown`, `RadioGroup`, and `Tabs` emit the selected value or key.
- Keep `className` as the consumer escape hatch wherever the current component exposes it. Additive class support must not remove the existing defaults.
- Pass through native attributes where the current root type supports them, especially for fields, buttons, labels, and content containers.
- Prefer additive changes and compatibility aliases. Do not rename or remove an exported component, helper, prop, or theme name in this phase without consumer evidence and a migration path.
- Decorative icons must retain accessible names through their surrounding label or control. Icons that are not the accessible name should remain hidden from assistive technology.

## Compatibility-safe work

Phase 3 exported previously hidden public prop/style types, added refs to native-root content primitives, fixed concrete semantic and edge-case defects, and expanded behavior coverage from 24 to 38 tests. Existing component names, callback names, state ownership, variants, class names, and style helpers remain available. The playground remains the public reference at `ui.ai-created.com`; its full per-component documentation and browser visual coverage are Phase 4 work.

Known consumers in repository guidance are `ai-created.com` through the `ai-created-nextjs` app and `applyanator` through `human-actually.com`. Both consume `@ai-created/ui` from the GitHub repository and pin a commit in their lockfiles. This makes additive changes and preserved names the compatibility baseline.

## Deferred decisions

- Whether controlled primitives should also support uncontrolled defaults.
- Whether narrow controlled controls need native-attribute escape hatches such as `inputProps`; add them only for a demonstrated form-integration need.
- Whether Tabs should expose a root ref or richer orientation/keyboard contract beyond its current controlled horizontal API.
- Whether Tooltip should gain Escape dismissal, portal positioning, and collision handling. Those changes need an explicit positioning contract rather than incremental patches.
- Whether custom modal headers should gain a named title primitive. Today they must label `ModalOverlay` explicitly.
- Whether appearance-named color props or variants need intent aliases beyond the token compatibility layer.
- Whether changes to public generic types require a major release or can remain additive.

These decisions require consumer evidence or an explicit API proposal and remain deferred.
