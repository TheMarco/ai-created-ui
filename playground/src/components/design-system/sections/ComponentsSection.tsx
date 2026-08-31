'use client';

import { useState } from 'react';
import DSSection from '../DSSection';
import DSComponentDemo from '../DSComponentDemo';
import ComponentCoverageDemos from '../ComponentCoverageDemos';
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Dropdown,
  FieldGroup,
  FieldHint,
  FieldLabel,
  FieldLegend,
  Notice,
  RadioGroup,
  Skeleton,
  Slider,
  Surface,
  Tabs,
  TextArea,
  TextInput,
  Toggle,
  Tooltip,
  useTabPanelProps,
  buttonStyles,
} from '@ai-created/ui';
import type { BadgeVariant, DropdownOption, RadioOption, Tab } from '@ai-created/ui';

const componentRules = [
  'Start with shared primitives: Button, Surface, TextInput, and TextArea carry the interaction contract.',
  'Prefer existing shells before inventing a new card style.',
  'Do not add checklist components for completeness. A new shared component should answer a real product need, not a hypothetical one.',
  'Keep metadata systems compact and mono-driven: status, platform, date, category, read time.',
  'For multi-tool product surfaces, prefer overview cards plus one active workspace instead of stacking every tool vertically.',
  'If an action has nowhere useful to go yet, disable it or replace it with explanatory copy. Do not ship dead-end clicks.',
  'Dense toolbars should use same-height controls and shared alignment before introducing custom flourishes.',
  'Use the accent token for emphasis and state. Use the action token for filled controls with the on-action foreground.',
  'Route-level composition counts as a component decision. Shared shells are part of the system, not implementation trivia.',
  'Interactive components need visible focus, explicit naming, and correct HTML semantics before they are considered done.',
  'If a component only appears on one route, question whether it should be part of the design system at all.',
];

const componentAdmissionRules = [
  'First use: solve the product problem with existing primitives and route-level composition.',
  'Second similar use: identify the repeated interaction, content shape, and accessibility contract.',
  'Shared or repeated use: promote it into a canonical component, then document it here and in DESIGN-SYSTEM.md in the same pass.',
  'Patterns learned from shipped product flows belong here once they repeat: capacity states, status-first settings cards, overview-plus-workspace, and honest empty states.',
  'Badges, dropdowns, radio groups, sliders, toggles, dialogs, and tooltips are shared primitives. Tooltip + Badge is the standard composition for interactive status pills.',
];

const accessibilityByComponent = [
  'Buttons and links must keep visible focus and communicate destination or action clearly.',
  'Buttons ship with default, hover, focus-visible, loading, and disabled states. The design system should show those states, not imply them.',
  'Disabled actions should communicate why they are unavailable when the user needs more context. Do not force navigation into empty destinations.',
  'Cards that act as links should expose one clear accessible name and treat supporting imagery as decorative.',
  'Forms require labels, helper copy when needed, autocomplete where appropriate, and success/error announcements.',
  'Browse controls should use real fieldsets, legends, pressed states, and live feedback when results change.',
  'Workflow tabs and utility actions should not share the same semantic tablist unless they represent the same kind of destination.',
  'Mixed toolbars still need consistent hit targets and alignment. Buttons, dropdowns, and icon actions should share height when they occupy one control row.',
  'Modals must trap focus, restore focus on close, support Escape to dismiss, and use role="dialog" with aria-modal and aria-labelledby.',
  'Tabs use role="tablist" with arrow-key navigation, Home/End support, and roving tabindex. Each tab has role="tab", aria-selected, and aria-controls linking to its panel.',
  'Checkboxes pair a visually hidden native input with a styled indicator. Focus-visible outlines render on the visual box via peer selectors. Labels are always required.',
  'Empty states must communicate clearly to screen readers. Avoid placeholder SVGs without alt text.',
  'Breadcrumbs use nav with aria-label="Breadcrumb" and plain text for the current page.',
  'Dropdowns use Headless UI Listbox with full keyboard navigation (Arrow Up/Down, Enter, Escape, type-ahead). Selected option shows a check icon.',
  'Radio groups use native radio inputs in a fieldset with legend. Arrow keys move selection. Styled indicators mirror the checkbox pattern with a centered dot.',
  'Sliders use native range input with a styled track and thumb. The filled portion uses the accent action color. aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext are set.',
  'Toggles use role="switch" with aria-checked. Visually distinct from checkboxes with a sliding track. Focus-visible outline on the track.',
  'Dialogs use Headless UI Dialog with automatic focus trap, Escape to close, backdrop click to close, and transition animations. Close button has an aria-label.',
  'Tooltips appear on hover and focus with a configurable delay. Use role="tooltip" with aria-describedby on the trigger. Positioned top/bottom/left/right.',
  'Badges are inline semantic labels. When wrapped in Tooltip, add cursor-help so users know hover detail is available. The Tooltip provides aria-describedby on the Badge automatically.',
];

const demoTabs: Tab<'overview' | 'details' | 'related'>[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'details', label: 'Details' },
  { key: 'related', label: 'Related' },
];

function TabsDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'related'>('overview');
  const tabsId = 'demo-tabs';
  const overviewPanel = useTabPanelProps('overview', activeTab, tabsId);
  const detailsPanel = useTabPanelProps('details', activeTab, tabsId);
  const relatedPanel = useTabPanelProps('related', activeTab, tabsId);

  return (
    <DSComponentDemo
      title="Tabs"
      description="Horizontal tab bar for switching between related views. Uses roving tabindex with arrow-key navigation, Home/End support, and proper ARIA tab pattern."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <Tabs
            id={tabsId}
            tabs={demoTabs}
            active={activeTab}
            onChange={setActiveTab}
            label="Demo tabs"
          />
          <div {...overviewPanel} className="mt-4 text-sm text-text2">Overview panel content.</div>
          <div {...detailsPanel} className="mt-4 text-sm text-text2">Details panel content.</div>
          <div {...relatedPanel} className="mt-4 text-sm text-text2">Related panel content.</div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Keyboard</span>
            <span className="text-xs text-text2 leading-relaxed">Arrow Left/Right moves focus and selection. Home/End jump to first/last tab.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">ARIA</span>
            <span className="text-xs text-text2 leading-relaxed">role=&quot;tablist&quot;, role=&quot;tab&quot;, aria-selected, aria-controls, roving tabindex</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function CheckboxDemo() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <DSComponentDemo
      title="Checkbox"
      description="Binary toggle with a visually hidden native input and a styled indicator. Focus-visible outlines appear on the visual box. Labels are always required for accessibility."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="space-y-3">
            <Checkbox checked={checked1} onChange={setChecked1} label="Unchecked by default" />
            <Checkbox checked={checked2} onChange={setChecked2} label="Checked by default" />
            <Checkbox checked={false} onChange={() => {}} label="Disabled checkbox" disabled />
            <Checkbox checked={true} onChange={() => {}} label="Disabled and checked" disabled />
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Focus</span>
            <span className="text-xs text-text2 leading-relaxed">Native input is sr-only; focus-visible outline renders on the visual box via peer selector.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">States</span>
            <span className="text-xs text-text2 leading-relaxed">Unchecked, checked (action fill), hover (border brightens), disabled (opacity 50%).</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Semantics</span>
            <span className="text-xs text-text2 leading-relaxed">Native &lt;input type=&quot;checkbox&quot;&gt; with &lt;label&gt; linked by generated id.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

const dropdownOptions: DropdownOption[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'react', label: 'React' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'framer', label: 'Framer Motion' },
  { value: 'three', label: 'Three.js', disabled: true },
];

const releaseStatusOptions: DropdownOption<'proposed' | 'approved' | 'released'>[] = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'approved', label: 'Approved' },
  { value: 'released', label: 'Released' },
];

function FieldSpacingDemo() {
  const [releaseStatus, setReleaseStatus] = useState<'proposed' | 'approved' | 'released'>('proposed');
  const longLabel = 'Approval owner for proposed changes requiring security and accessibility review';

  return (
    <DSComponentDemo
      title="Form Controls"
      description="FieldGroup owns one vertical spacing rhythm so text controls, hints, and adjacent Dropdown triggers stay aligned across content and states."
    >
      <div className="max-w-3xl space-y-6">
        <div data-field-spacing-primary className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FieldGroup>
            <FieldLabel htmlFor="ds-demo-search">Search proposed changes</FieldLabel>
            <TextInput
              id="ds-demo-search"
              type="search"
              placeholder="Search by title or owner"
              aria-describedby="ds-demo-search-hint"
              readOnly
              aria-readonly="true"
            />
            <FieldHint id="ds-demo-search-hint">Results update as you type.</FieldHint>
          </FieldGroup>
          <Dropdown
            options={releaseStatusOptions}
            value={releaseStatus}
            onChange={setReleaseStatus}
            label="Release status"
          />
        </div>

        <div data-field-spacing-states className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FieldGroup>
            <FieldLabel htmlFor="ds-demo-message">Implementation notes</FieldLabel>
            <TextArea
              id="ds-demo-message"
              rows={3}
              placeholder="Add review context"
              aria-describedby="ds-demo-message-hint"
              readOnly
              aria-readonly="true"
            />
            <FieldHint id="ds-demo-message-hint">Keep the rationale concise and actionable.</FieldHint>
          </FieldGroup>
          <FieldGroup data-field-without-hint>
            <FieldLabel htmlFor="ds-demo-disabled">Inherited release channel</FieldLabel>
            <TextInput id="ds-demo-disabled" value="Stable" disabled readOnly />
          </FieldGroup>
        </div>

        <div data-field-spacing-wrapped className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FieldGroup>
            <FieldLabel htmlFor="ds-demo-invalid">{longLabel}</FieldLabel>
            <TextInput
              id="ds-demo-invalid"
              aria-invalid="true"
              aria-describedby="ds-demo-invalid-error"
              className="border-error-border focus:border-error-border"
              value=""
              readOnly
            />
            <FieldHint id="ds-demo-invalid-error" role="alert" className="text-error">
              Choose an owner before release.
            </FieldHint>
          </FieldGroup>
          <Dropdown
            options={releaseStatusOptions}
            value={releaseStatus}
            onChange={setReleaseStatus}
            label={longLabel}
            disabled
          />
        </div>
      </div>
    </DSComponentDemo>
  );
}

const radioOptions: RadioOption[] = [
  { value: 'all', label: 'All categories' },
  { value: 'apps', label: 'Apps' },
  { value: 'games', label: 'Games' },
  { value: 'experiments', label: 'Experiments' },
];

function DropdownDemo() {
  const [selected, setSelected] = useState('next');

  return (
    <DSComponentDemo
      title="Dropdown"
      description="Single-select dropdown built on Headless UI Listbox. Full keyboard navigation with Arrow Up/Down, Enter/Space to select, Escape to close, and type-ahead search."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="max-w-xs">
            <Dropdown
              options={dropdownOptions}
              value={selected}
              onChange={setSelected}
              label="Framework"
              placeholder="Choose a framework"
            />
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Keyboard</span>
            <span className="text-xs text-text2 leading-relaxed">Arrow Up/Down navigates, Enter/Space selects, Escape closes, type-ahead jumps.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">ARIA</span>
            <span className="text-xs text-text2 leading-relaxed">Headless UI Listbox provides role, aria-selected, aria-activedescendant automatically.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">States</span>
            <span className="text-xs text-text2 leading-relaxed">Closed, open, active option (bg-surface2), selected (check icon), disabled (opacity 50%).</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function RadioGroupDemo() {
  const [value, setValue] = useState('all');

  return (
    <DSComponentDemo
      title="Radio Group"
      description="Single-select group using native radio inputs in a fieldset. Arrow keys move selection. Styled indicators follow the checkbox visual pattern with a centered dot."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioGroup
              options={radioOptions}
              value={value}
              onChange={setValue}
              legend="Category"
              orientation="vertical"
            />
            <RadioGroup
              options={radioOptions}
              value={value}
              onChange={setValue}
              legend="Horizontal"
              orientation="horizontal"
            />
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Keyboard</span>
            <span className="text-xs text-text2 leading-relaxed">Arrow keys move selection within the group. Tab moves focus out of the group.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Semantics</span>
            <span className="text-xs text-text2 leading-relaxed">Native &lt;fieldset&gt; with &lt;legend&gt;, native &lt;input type=&quot;radio&quot;&gt; with shared name.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">States</span>
            <span className="text-xs text-text2 leading-relaxed">Unselected, selected (action fill + on-action dot), hover (border brightens), disabled (opacity 50%).</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function SliderDemo() {
  const [volume, setVolume] = useState(65);
  const [price, setPrice] = useState(250);

  return (
    <DSComponentDemo
      title="Slider"
      description="Range input with a styled track and thumb. The filled portion uses the accent action color. Includes an output element for the current value with aria-valuetext for screen readers."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="max-w-md space-y-6">
            <Slider
              value={volume}
              onChange={setVolume}
              label="Volume"
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
            />
            <Slider
              value={price}
              onChange={setPrice}
              label="Max price"
              min={0}
              max={1000}
              step={10}
              formatValue={(v) => `$${v}`}
            />
            <Slider
              value={50}
              onChange={() => {}}
              label="Disabled"
              disabled
            />
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Track</span>
            <span className="text-xs text-text2 leading-relaxed">Filled portion uses the action color, unfilled uses surface2. Border matches input fields.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Thumb</span>
            <span className="text-xs text-text2 leading-relaxed">Red-solid fill, bg border for contrast. Scales up on hover for better grab target.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">ARIA</span>
            <span className="text-xs text-text2 leading-relaxed">aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext with formatted display value.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function ToggleDemo() {
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(true);

  return (
    <DSComponentDemo
      title="Toggle"
      description="On/off switch visually distinct from checkboxes. Uses role='switch' with aria-checked. Sliding track animation with the accent action color for the on state."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="space-y-3">
            <Toggle checked={enabled1} onChange={setEnabled1} label="Dark mode" />
            <Toggle checked={enabled2} onChange={setEnabled2} label="Notifications" />
            <Toggle checked={false} onChange={() => {}} label="Disabled toggle" disabled />
            <Toggle checked={true} onChange={() => {}} label="Disabled and on" disabled />
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Semantics</span>
            <span className="text-xs text-text2 leading-relaxed">role=&quot;switch&quot; with aria-checked. Native &lt;button&gt; for keyboard activation.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">States</span>
            <span className="text-xs text-text2 leading-relaxed">Off (surface2 track), on (action track + translated knob), hover (border brightens), disabled (opacity 50%).</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Focus</span>
            <span className="text-xs text-text2 leading-relaxed">Focus-visible outline on the track, not a wrapper. 2px outline, 3px offset.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DSComponentDemo
      title="Dialog"
      description="Modal dialog built on Headless UI with automatic focus trap, Escape to close, backdrop click to close, and transition animations. Size variants from sm to xl."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" onClick={() => setOpen(true)}>
              Open Dialog
            </Button>
          </div>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            title="Confirm action"
            description="This dialog demonstrates focus trapping, keyboard navigation, and transition animations."
            size="md"
          >
            <div className="space-y-4">
              <p className="text-sm text-text2">
                Press Escape or click outside to close. Tab cycles through focusable elements inside the dialog. Focus returns to the trigger on close.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </Dialog>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Focus</span>
            <span className="text-xs text-text2 leading-relaxed">Headless UI traps focus inside the dialog. Focus restores to the trigger on close.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Keyboard</span>
            <span className="text-xs text-text2 leading-relaxed">Escape closes, Tab/Shift+Tab cycles focusable elements.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">ARIA</span>
            <span className="text-xs text-text2 leading-relaxed">role=&quot;dialog&quot;, aria-modal, aria-labelledby from DialogTitle, aria-describedby optional.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Sizes</span>
            <span className="text-xs text-text2 leading-relaxed">sm (max-w-sm), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl).</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

const badgeDemoItems: { label: string; variant: BadgeVariant }[] = [
  { label: 'Default', variant: 'default' },
  { label: 'Muted', variant: 'muted' },
  { label: 'Success', variant: 'success' },
  { label: 'Warning', variant: 'warning' },
  { label: 'Error', variant: 'error' },
  { label: 'Info', variant: 'info' },
];

function BadgeDemo() {
  return (
    <DSComponentDemo
      title="Badge"
      description="Pill-shaped semantic label for status indicators, counters, and metadata tags. Six variants map to the semantic color system."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-3">Variants</span>
              <div className="flex flex-wrap items-center gap-2">
                {badgeDemoItems.map(({ label, variant }) => (
                  <Badge key={variant} variant={variant}>{label}</Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-3">Status row</span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">completed</Badge>
                <Badge variant="info">extracting</Badge>
                <Badge variant="warning">partial success</Badge>
                <Badge variant="error">failed</Badge>
                <Badge variant="muted">queued</Badge>
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Shape</span>
            <span className="text-xs text-text2 leading-relaxed">rounded-full with border, px-2 py-0.5, 11px font. Compact enough for inline use.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Colors</span>
            <span className="text-xs text-text2 leading-relaxed">Maps to semantic color triplets: border, surface, and text for each variant.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Composable</span>
            <span className="text-xs text-text2 leading-relaxed">Wrap in Tooltip for hover detail. Override rounded-full with className for square badges.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function TooltipBadgeDemo() {
  return (
    <DSComponentDemo
      title="Tooltip + Badge"
      description="Badges wrapped in Tooltip create interactive status pills with explanatory hover text. Use cursor-help to signal the tooltip is available. This composition is the standard pattern for audit metadata and status indicators."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-3">Status with detail</span>
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip content="All source pages have been fetched and processed successfully.">
                  <Badge variant="success" className="cursor-help">completed</Badge>
                </Tooltip>
                <Tooltip content="Document text is being extracted from the uploaded file.">
                  <Badge variant="info" className="cursor-help">extracting</Badge>
                </Tooltip>
                <Tooltip content="Some pages could not be reached. Partial data was saved.">
                  <Badge variant="warning" className="cursor-help">partial success</Badge>
                </Tooltip>
                <Tooltip content="The source could not be processed. Check the URL and try again.">
                  <Badge variant="error" className="cursor-help">failed</Badge>
                </Tooltip>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-3">Fit assessment</span>
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip content="Strong signal: candidate experience directly matches the requirement with concrete evidence.">
                  <Badge variant="success" className="rounded px-1.5 py-0.5 text-[10px] cursor-help">strong fit</Badge>
                </Tooltip>
                <Tooltip content="Moderate signal: related experience exists but is not a direct match.">
                  <Badge variant="warning" className="rounded px-1.5 py-0.5 text-[10px] cursor-help">partial fit</Badge>
                </Tooltip>
                <Tooltip content="No supporting evidence found in the available sources.">
                  <Badge variant="error" className="rounded px-1.5 py-0.5 text-[10px] cursor-help">no evidence</Badge>
                </Tooltip>
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Pattern</span>
            <span className="text-xs text-text2 leading-relaxed">Tooltip wraps Badge. Add cursor-help to signal interactivity.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">When to use</span>
            <span className="text-xs text-text2 leading-relaxed">Status labels, fit assessments, and audit metadata where a one-word label needs supporting context.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Overrides</span>
            <span className="text-xs text-text2 leading-relaxed">Use className to swap rounded-full for rounded, adjust text size, or change padding for compact rows.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function TooltipDemo() {
  return (
    <DSComponentDemo
      title="Tooltip"
      description="Contextual hint that appears on hover and focus. Configurable position and delay. Uses role='tooltip' with aria-describedby for screen reader support."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md">
          <div className="flex flex-wrap items-center gap-6">
            <Tooltip content="Tooltip on top" position="top">
              <Button variant="secondary" size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Tooltip on bottom" position="bottom">
              <Button variant="secondary" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="Tooltip on left" position="left">
              <Button variant="secondary" size="sm">Left</Button>
            </Tooltip>
            <Tooltip content="Tooltip on right" position="right">
              <Button variant="secondary" size="sm">Right</Button>
            </Tooltip>
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Trigger</span>
            <span className="text-xs text-text2 leading-relaxed">Shows on hover and focus. Configurable delay (default 300ms). Hides on mouse leave and blur.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">ARIA</span>
            <span className="text-xs text-text2 leading-relaxed">role=&quot;tooltip&quot; on the popup, aria-describedby on the trigger when visible.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Position</span>
            <span className="text-xs text-text2 leading-relaxed">Top, bottom, left, or right. Centered on the trigger axis.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

interface ComponentsSectionProps {
  onInView?: (id: string) => void;
}

export default function ComponentsSection({ onInView }: ComponentsSectionProps) {
  return (
    <DSSection
      id="components"
      title="Components"
      subtitle="These are the shared production patterns exported from @ai-created/ui."
      onInView={onInView}
    >
      <Surface variant="default" padding="lg" className="mb-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Component Rules
        </h3>
        <ul className="space-y-2">
          {componentRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </Surface>

      <div className="space-y-8">
        <DSComponentDemo
          title="Buttons & Links"
          description="One shared button primitive with variant and size options. Primary buttons use the semantic action fill. Secondary actions are bordered and quieter. Tertiary actions are text links."
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="md">Primary Action</Button>
              <Button variant="secondary" size="md">Secondary Action</Button>
              <button type="button" className={buttonStyles({ variant: 'ghost', size: 'inline' })}>Text Link</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Surface variant="default" padding="sm">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                  Focus-visible
                </span>
                <Button type="button" variant="primary" size="md" style={{ outline: '2px solid var(--color-focus)', outlineOffset: '3px' }}>
                  Keyboard Focus
                </Button>
              </Surface>

              <Surface variant="default" padding="sm">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                  Loading
                </span>
                <Button type="button" aria-busy="true" variant="primary" size="md">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
                  Sending
                </Button>
              </Surface>

              <Surface variant="default" padding="sm">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                  Disabled
                </span>
                <Button type="button" disabled variant="primary" size="md">
                  Unavailable
                </Button>
              </Surface>
            </div>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="Shared UI Primitives"
          description="The reusable building blocks exported from @ai-created/ui."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Surface variant="default" padding="md">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                Button
              </span>
              <p className="text-sm text-text2 leading-relaxed mb-4">
                Handles primary, secondary, ghost, filter, and icon styles with consistent sizing and disabled states.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="icon" size="icon" aria-label="Icon button">
                  <span aria-hidden="true">+</span>
                </Button>
              </div>
            </Surface>

            <Surface variant="default" padding="md">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                Surface
              </span>
              <p className="text-sm text-text2 leading-relaxed mb-4">
                Encodes the shared shell language for cards, panels, notices, and accent modules instead of repeating border and background recipes inline.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-text3">
                <Surface variant="default" padding="sm">default</Surface>
                <Surface variant="muted" padding="sm">muted</Surface>
                <Surface variant="accent" padding="sm">accent</Surface>
                <Surface variant="info" padding="sm">info</Surface>
              </div>
            </Surface>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="When to Add a Component"
          description="This system grows by product pressure, not by checklist completeness. New components should be promoted when the pattern is real, repeated, or clearly cross-route."
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4">
            <Surface variant="default" padding="md">
              <h4 className="text-lg font-heading font-medium text-text mb-3">
                Component admission rule
              </h4>
              <ul className="space-y-2">
                {componentAdmissionRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
                    <span className="text-accent mt-0.5">-</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Surface>

            <Surface variant="muted" padding="md">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-text3 mb-3">
                Promotion checklist
              </span>
              <div className="space-y-2 text-sm text-text2 leading-relaxed">
                <p>Use the real product need first.</p>
                <p>Add the shared primitive or variant.</p>
                <p>Ship the full accessibility and state contract.</p>
                <p>Document it in the playground and in DESIGN-SYSTEM.md.</p>
              </div>
            </Surface>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="Status & Loading"
          description="Async feedback uses a shared notice primitive and a small skeleton primitive instead of ad hoc status markup."
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Notice variant="success" title="Saved changes">
                A small semantic surface for confirmations and success states.
              </Notice>
              <Notice variant="info" title="Sync in progress">
                Informational updates stay distinct from brand actions and error states.
              </Notice>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="aspect-video" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Surface variant="muted" padding="sm" className="text-xs font-mono text-text2">
                Use skeletons for content that is genuinely loading. Keep them quiet, structural, and motion-light.
              </Surface>
            </div>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="ThemedHeroImage"
          description="Shared hero media wrapper. Every route-level hero uses this single primitive. It handles dark/light image swapping, overlay strength, edge fade gradients, and transparent-PNG blending, all backed by design system tokens."
        >
          <Surface variant="default" padding="md">
            <Surface variant="muted" padding="sm" className="space-y-2 text-xs font-mono text-text3">
              <div>darkSrc / lightSrc</div>
              <div>overlay: default | strong | soft | none</div>
              <div>fadeTop: gradient from bg to transparent</div>
              <div>fadeBottom: gradient from bg to transparent</div>
              <div>blendLight: multiply blend for transparent PNGs in light mode</div>
              <div>theme-aware image swap + hero text colors</div>
            </Surface>
            <div className="mt-4 space-y-1.5 text-sm text-text2">
              <p><span className="text-text font-medium">default</span> is the standard overlay for most browse pages.</p>
              <p><span className="text-text font-medium">strong</span> is heavier, used for high-contrast moments.</p>
              <p><span className="text-text font-medium">soft</span> is 20% more transparent than strong, for subtler image presence.</p>
              <p><span className="text-text font-medium">fadeBottom</span> blends the hero edge into the page background.</p>
              <p><span className="text-text font-medium">fadeTop</span> same effect at the top.</p>
              <p><span className="text-text font-medium">blendLight</span> uses mix-blend-multiply on images in light mode so transparent PNGs blend into the warm beige background.</p>
            </div>
          </Surface>
        </DSComponentDemo>

        <FieldSpacingDemo />

        <DSComponentDemo
          title="Browse Controls"
          description="Search plus low-friction filters are the preferred pattern when a route needs more than a simple grid."
        >
          <Surface variant="default" padding="md" className="max-w-3xl">
            <div className="space-y-4">
              <TextInput
                type="search"
                placeholder="Search products, concepts, or capabilities"
                readOnly
                aria-readonly="true"
              />
              <FieldGroup>
                <FieldLegend>Type</FieldLegend>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="filter-active" size="sm">All</Button>
                  <Button type="button" variant="filter" size="sm">Apps</Button>
                  <Button type="button" variant="filter" size="sm">Games</Button>
                </div>
              </FieldGroup>
            </div>
          </Surface>
        </DSComponentDemo>
        <TabsDemo />
        <CheckboxDemo />
        <DropdownDemo />
        <RadioGroupDemo />
        <SliderDemo />
        <ToggleDemo />
        <BadgeDemo />
        <DialogDemo />
        <ComponentCoverageDemos />
        <TooltipDemo />
        <TooltipBadgeDemo />

        <DSComponentDemo
          title="Card Hover System"
          description="Cards follow a consistent hover progression: border brightens, text lifts in contrast, and images scale subtly. Use the group selector for coordinated effects."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Surface variant="default" padding="md" className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-2">Default</span>
                <span className="text-sm text-text2">border-border</span>
              </Surface>
              <Surface variant="default" padding="md" className="border-border-strong text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-2">Hover</span>
                <span className="text-sm text-text">border-border-strong</span>
              </Surface>
              <Surface variant="accent" padding="md" className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent block mb-2">Featured Hover</span>
                <span className="text-sm text-text">border-accent-muted</span>
              </Surface>
            </div>
            <Surface variant="default" padding="sm" className="space-y-1 text-xs font-mono text-text3">
              <div>Border: border-border → border-border-strong</div>
              <div>Text: text-text2 → text-text</div>
              <div>Image: group-hover:scale-[1.02] duration-500</div>
              <div>Lift: whileHover=&#123;&#123; y: -2 &#125;&#125; (Framer Motion)</div>
              <div>Featured: border-accent-border → border-accent-muted</div>
            </Surface>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="Dividers"
          description="Three divider weights for different contexts. Structural for lists, decorative for subtle breaks, accent for emphasis."
        >
          <div className="space-y-8 max-w-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-3">Structural</span>
              <div className="border-t border-border" />
              <span className="text-xs font-mono text-text3 mt-2 block">border-t border-border</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-3">Decorative</span>
              <div className="h-px bg-highlight" />
              <span className="text-xs font-mono text-text3 mt-2 block">h-px bg-highlight</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-3">Accent</span>
              <div className="h-px w-20 bg-accent" />
              <span className="text-xs font-mono text-text3 mt-2 block">h-px w-20 bg-accent</span>
            </div>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="Empty States"
          description="When filters or search return nothing, show a direct, non-cute message. Always provide context or a way forward."
        >
          <div className="max-w-md mx-auto text-center py-12">
            <p className="text-text2 text-base mb-2">No articles found.</p>
            <p className="text-text3 text-sm">Try adjusting your search or clearing filters.</p>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="Breadcrumbs"
          description="Used on detail pages to show route context. Mono font, slash separators, current page is not linked."
        >
          <nav aria-label="Breadcrumb demo" className="flex items-center gap-2 text-sm font-mono">
            <span className="text-text2">Products</span>
            <span className="text-text3">/</span>
            <span className="text-text3">Current Page</span>
          </nav>
        </DSComponentDemo>

        <DSComponentDemo
          title="Icon Sizing"
          description="Icons follow three size tiers. Small for inline metadata, medium for interactive controls, large for decorative or standalone use."
        >
          <div className="flex items-end gap-8">
            <div className="text-center">
              <svg className="w-4 h-4 text-text2 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-[10px] font-mono text-text3">w-4 h-4</span>
              <span className="text-[10px] font-mono text-text3 block">inline</span>
            </div>
            <div className="text-center">
              <svg className="w-5 h-5 text-text2 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="text-[10px] font-mono text-text3">w-5 h-5</span>
              <span className="text-[10px] font-mono text-text3 block">controls</span>
            </div>
            <div className="text-center">
              <svg className="w-8 h-8 text-text2 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-[10px] font-mono text-text3">w-8 h-8</span>
              <span className="text-[10px] font-mono text-text3 block">decorative</span>
            </div>
          </div>
        </DSComponentDemo>
      </div>

      <Surface variant="default" padding="lg" className="mt-12">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Accessibility By Component
        </h3>
        <ul className="space-y-2">
          {accessibilityByComponent.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Surface>
    </DSSection>
  );
}
