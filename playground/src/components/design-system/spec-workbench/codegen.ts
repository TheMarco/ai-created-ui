import { componentSpecById } from '../specs/registry';
import type { ComponentControl, ComponentSpecId } from '../specs/types';

export type ControlValue = string | number | boolean;
export type ControlValues = Record<string, ControlValue>;

type Controls = Record<string, ComponentControl> | undefined;

const ARG_PREFIX = 'arg.';

export function getDefaultControlValues(controls: Controls): ControlValues {
  return Object.fromEntries(
    Object.entries(controls ?? {}).map(([name, control]) => [name, control.defaultValue])
  );
}

function isStepAligned(value: number, control: Extract<ComponentControl, { type: 'number' }>) {
  if (control.step === undefined || control.step <= 0) return true;
  const base = control.min ?? 0;
  const quotient = (value - base) / control.step;
  return Math.abs(quotient - Math.round(quotient)) < 1e-8;
}

function isValidControlValue(control: ComponentControl, value: unknown): value is ControlValue {
  switch (control.type) {
    case 'boolean':
      return typeof value === 'boolean';
    case 'text':
      return typeof value === 'string';
    case 'select':
      return typeof value === 'string' && control.options.includes(value);
    case 'number':
      return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        (control.min === undefined || value >= control.min) &&
        (control.max === undefined || value <= control.max) &&
        isStepAligned(value, control)
      );
  }
}

function parseControlValue(control: ComponentControl, value: string): ControlValue | undefined {
  if (control.type === 'boolean') {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }

  if (control.type === 'number') {
    if (value.trim() === '') return undefined;
    const parsed = Number(value);
    return isValidControlValue(control, parsed) ? parsed : undefined;
  }

  return isValidControlValue(control, value) ? value : undefined;
}

/**
 * Reads valid workbench arguments and overlays them on the control defaults.
 * Unknown, malformed, or out-of-range values are ignored.
 */
export function parseWorkbenchSearchParams(
  controls: Controls,
  searchParams: URLSearchParams
): ControlValues {
  const values = getDefaultControlValues(controls);

  for (const [name, control] of Object.entries(controls ?? {})) {
    const rawValue = searchParams.get(`${ARG_PREFIX}${name}`);
    if (rawValue === null) continue;
    const parsed = parseControlValue(control, rawValue);
    if (parsed !== undefined) values[name] = parsed;
  }

  return values;
}

/**
 * Returns a new query object with current, non-default workbench arguments.
 * Parameters outside the workbench namespace are preserved.
 */
export function writeWorkbenchSearchParams(
  controls: Controls,
  values: ControlValues,
  searchParams: URLSearchParams
): URLSearchParams {
  const next = new URLSearchParams(searchParams);

  for (const [name, control] of Object.entries(controls ?? {})) {
    const key = `${ARG_PREFIX}${name}`;
    next.delete(key);

    const value = values[name];
    if (!isValidControlValue(control, value) || value === control.defaultValue) continue;
    next.set(key, String(value));
  }

  return next;
}

function resolveValues(componentId: ComponentSpecId, values: ControlValues): ControlValues {
  const controls = componentSpecById[componentId].controls;
  const resolved = getDefaultControlValues(controls);

  for (const [name, control] of Object.entries(controls ?? {})) {
    const value = values[name];
    if (isValidControlValue(control, value)) resolved[name] = value;
  }

  return resolved;
}

function text(values: ControlValues, name: string) {
  return String(values[name] ?? '');
}

function bool(values: ControlValues, name: string) {
  return values[name] === true;
}

function number(values: ControlValues, name: string) {
  const value = values[name];
  return typeof value === 'number' ? value : 0;
}

function jsxString(value: string) {
  return `{${JSON.stringify(value)}}`;
}

function optionalStringProp(name: string, value: string, defaultValue: string) {
  return value === defaultValue ? '' : ` ${name}=${jsxString(value)}`;
}

function booleanProp(name: string, value: boolean, defaultValue = false) {
  return value === defaultValue ? '' : value ? ` ${name}` : ` ${name}={false}`;
}

function clientExample(imports: string, body: string) {
  return `'use client';\n\n${imports}\n\n${body}\n`;
}

type CodeGenerator = (values: ControlValues) => string;

const codeGenerators: Record<ComponentSpecId, CodeGenerator> = {
  button: (values) => {
    const variant = text(values, 'variant');
    const size = text(values, 'size');
    const label = text(values, 'label');
    const iconOnly = variant === 'icon' || size === 'icon';
    const resolvedSize = iconOnly ? 'icon' : size;
    return `import { Save } from 'lucide-react';\nimport { Button } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <Button${optionalStringProp('variant', variant, 'primary')}${optionalStringProp('size', resolvedSize, 'md')}${iconOnly ? ` aria-label=${jsxString(label)}` : ''}${booleanProp('disabled', bool(values, 'disabled'))}${booleanProp('fullWidth', bool(values, 'fullWidth'))}>\n      <Save className="h-4 w-4" aria-hidden="true" />${iconOnly ? '' : `\n      ${jsxString(label)}`}\n    </Button>\n  );\n}\n`;
  },

  badge: (values) => `import { Badge } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <Badge${optionalStringProp('variant', text(values, 'variant'), 'default')}>\n      ${jsxString(text(values, 'label'))}\n    </Badge>\n  );\n}\n`,

  surface: (values) => {
    const interaction = text(values, 'interaction');
    const surface = `<Surface${optionalStringProp('variant', text(values, 'variant'), 'default')}${optionalStringProp('padding', text(values, 'padding'), 'none')}${optionalStringProp('interaction', interaction, 'none')}>\n      <h2>Project status</h2>\n      <p>Related content belongs inside the surface.</p>\n    </Surface>`;
    const content = interaction === 'group'
      ? `<div className="group">\n      ${surface}\n    </div>`
      : surface;
    return `import { Surface } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    ${content}\n  );\n}\n`;
  },

  notice: (values) => `import { Notice } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <Notice${optionalStringProp('variant', text(values, 'variant'), 'default')} title=${jsxString(text(values, 'title'))}${booleanProp('centered', bool(values, 'centered'))}${booleanProp('hideIcon', bool(values, 'hideIcon'))}>\n      Check the supporting details before continuing.\n    </Notice>\n  );\n}\n`,

  skeleton: (values) => {
    const shape = text(values, 'shape');
    const widthClass = text(values, 'width') === 'short'
      ? 'max-w-xs'
      : text(values, 'width') === 'medium'
        ? 'max-w-lg'
        : 'max-w-full';

    if (shape === 'avatar') {
      return `import { Skeleton } from '@ai-created/ui';\n\nexport function Example() {\n  return <Skeleton className="h-16 w-16 rounded-full" />;\n}\n`;
    }

    if (shape === 'text') {
      return `import { Skeleton } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <div aria-label="Loading text" className="space-y-3 ${widthClass}">\n      <Skeleton className="h-4 w-2/5" />\n      <Skeleton className="h-3 w-full" />\n      <Skeleton className="h-3 w-4/5" />\n    </div>\n  );\n}\n`;
    }

    return `import { Skeleton } from '@ai-created/ui';\n\nexport function Example() {\n  return <Skeleton className="h-40 w-full ${widthClass}" />;\n}\n`;
  },

  'empty-state': (values) => `import { Button, EmptyState } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <EmptyState\n      title=${jsxString(text(values, 'title'))}\n      description=${jsxString(text(values, 'description'))}\n    >\n      <Button size="sm">Create project</Button>\n    </EmptyState>\n  );\n}\n`,

  'error-report': (values) => `import { ErrorReport } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <ErrorReport\n      title=${jsxString(text(values, 'title'))}\n      message=${jsxString(text(values, 'message'))}\n      details=${jsxString(text(values, 'details'))}\n    />\n  );\n}\n`,

  field: (values) => {
    const component = text(values, 'control') === 'textarea' ? 'TextArea' : 'TextInput';
    return clientExample(
      `import { useId } from 'react';\nimport { FieldGroup, FieldHint, FieldLabel, ${component} } from '@ai-created/ui';`,
      `export function Example() {\n  const hintId = useId();\n\n  return (\n    <FieldGroup>\n      <FieldLabel htmlFor="example-field">${jsxString(text(values, 'label'))}</FieldLabel>\n      <${component}\n        id="example-field"\n        aria-describedby={hintId}\n        placeholder="Enter a value"${booleanProp('disabled', bool(values, 'disabled'))}\n      />\n      <FieldHint id={hintId}>${jsxString(text(values, 'hint'))}</FieldHint>\n    </FieldGroup>\n  );\n}`
    );
  },

  checkbox: (values) => clientExample(
    `import { useState } from 'react';\nimport { Checkbox } from '@ai-created/ui';`,
    `export function Example() {\n  const [checked, setChecked] = useState(${bool(values, 'checked')});\n\n  return (\n    <Checkbox\n      checked={checked}\n      onChange={setChecked}\n      label=${jsxString(text(values, 'label'))}${booleanProp('disabled', bool(values, 'disabled'))}\n    />\n  );\n}`
  ),

  'radio-group': (values) => clientExample(
    `import { useState } from 'react';\nimport { RadioGroup } from '@ai-created/ui';`,
    `const options = [\n  { value: 'design', label: 'Design' },\n  { value: 'engineering', label: 'Engineering' },\n  { value: 'research', label: 'Research' },\n];\n\nexport function Example() {\n  const [value, setValue] = useState(${JSON.stringify(text(values, 'value'))});\n\n  return (\n    <RadioGroup\n      options={options}\n      value={value}\n      onChange={setValue}\n      legend="Team discipline"${optionalStringProp('orientation', text(values, 'orientation'), 'vertical')}${booleanProp('disabled', bool(values, 'disabled'))}\n    />\n  );\n}`
  ),

  toggle: (values) => clientExample(
    `import { useState } from 'react';\nimport { Toggle } from '@ai-created/ui';`,
    `export function Example() {\n  const [checked, setChecked] = useState(${bool(values, 'checked')});\n\n  return (\n    <Toggle\n      checked={checked}\n      onChange={setChecked}\n      label=${jsxString(text(values, 'label'))}${booleanProp('disabled', bool(values, 'disabled'))}\n    />\n  );\n}`
  ),

  slider: (values) => clientExample(
    `import { useState } from 'react';\nimport { Slider } from '@ai-created/ui';`,
    `export function Example() {\n  const [value, setValue] = useState(${number(values, 'value')});\n\n  return (\n    <Slider\n      label="Completion"\n      value={value}\n      onChange={setValue}${booleanProp('showValue', bool(values, 'showValue'), true)}${booleanProp('disabled', bool(values, 'disabled'))}\n    />\n  );\n}`
  ),

  dropdown: (values) => clientExample(
    `import { useState } from 'react';\nimport { Dropdown } from '@ai-created/ui';`,
    `const options = [\n  { value: 'recent', label: 'Most recent' },\n  { value: 'name', label: 'Name' },\n  { value: 'status', label: 'Status' },\n];\n\nexport function Example() {\n  const [value, setValue] = useState(${JSON.stringify(text(values, 'value'))});\n\n  return (\n    <Dropdown\n      options={options}\n      value={value}\n      onChange={setValue}\n      label=${jsxString(text(values, 'label'))}${booleanProp('disabled', bool(values, 'disabled'))}\n    />\n  );\n}`
  ),

  tabs: (values) => clientExample(
    `import { useState } from 'react';\nimport { Tabs, useTabPanelProps } from '@ai-created/ui';`,
    `const tabs = [\n  { key: 'overview', label: 'Overview' },\n  { key: 'activity', label: 'Activity' },\n  { key: 'settings', label: 'Settings' },\n];\n\nexport function Example() {\n  const [active, setActive] = useState(${JSON.stringify(text(values, 'active'))});\n  const panelProps = useTabPanelProps(active, active, 'project-tabs');\n\n  return (\n    <>\n      <Tabs\n        id="project-tabs"\n        tabs={tabs}\n        active={active}\n        onChange={setActive}\n        label="Project sections"\n      />\n      <div {...panelProps}>Content for {active}</div>\n    </>\n  );\n}`
  ),

  dialog: (values) => clientExample(
    `import { useState } from 'react';\nimport { Button, Dialog } from '@ai-created/ui';`,
    `export function Example() {\n  const [open, setOpen] = useState(${bool(values, 'open')});\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Open dialog</Button>\n      <Dialog\n        open={open}\n        onClose={() => setOpen(false)}\n        title=${jsxString(text(values, 'title'))}${optionalStringProp('size', text(values, 'size'), 'md')}\n      >\n        <p>Dialog content belongs here.</p>\n      </Dialog>\n    </>\n  );\n}`
  ),

  modal: (values) => clientExample(
    `import { useState } from 'react';\nimport { Button, ModalBody, ModalFooter, ModalHeader, ModalOverlay, ModalPanel } from '@ai-created/ui';`,
    `export function Example() {\n  const [open, setOpen] = useState(${bool(values, 'open')});\n\n  if (!open) {\n    return <Button onClick={() => setOpen(true)}>Open modal</Button>;\n  }\n\n  return (\n    <ModalOverlay onClose={() => setOpen(false)}${booleanProp('closeOnBackdrop', bool(values, 'closeOnBackdrop'), true)}>\n      <ModalPanel${optionalStringProp('size', text(values, 'size'), 'lg')}>\n        <ModalHeader heading="Edit project" onClose={() => setOpen(false)} />\n        <ModalBody${booleanProp('scroll', bool(values, 'scroll'), true)}>Modal content belongs here.</ModalBody>\n        <ModalFooter>\n          <Button onClick={() => setOpen(false)}>Save changes</Button>\n        </ModalFooter>\n      </ModalPanel>\n    </ModalOverlay>\n  );\n}`
  ),

  'confirm-dialog': (values) => clientExample(
    `import { useState } from 'react';\nimport { Button, ConfirmDialog } from '@ai-created/ui';`,
    `export function Example() {\n  const [open, setOpen] = useState(${bool(values, 'open')});\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Open confirmation</Button>\n      <ConfirmDialog\n        open={open}\n        onConfirm={() => setOpen(false)}\n        onCancel={() => setOpen(false)}\n        title=${jsxString(text(values, 'title'))}${booleanProp('destructive', bool(values, 'destructive'))}${booleanProp('loading', bool(values, 'loading'))}\n        description="This action cannot be undone."\n      />\n    </>\n  );\n}`
  ),

  tooltip: (values) => clientExample(
    `import { Button, Tooltip } from '@ai-created/ui';`,
    `export function Example() {\n  return (\n    <Tooltip\n      content=${jsxString(text(values, 'content'))}${optionalStringProp('position', text(values, 'position'), 'top')}\n      delay={${number(values, 'delay')}}\n    >\n      <Button variant="secondary">Copy</Button>\n    </Tooltip>\n  );\n}`
  ),

  'themed-hero-image': (values) => `import { ThemedHeroImage } from '@ai-created/ui';\n\nexport function Example() {\n  return (\n    <section className="relative min-h-96 overflow-hidden">\n      <ThemedHeroImage\n        darkSrc="/hero-dark.jpg"\n        lightSrc="/hero-light.jpg"${optionalStringProp('overlay', text(values, 'overlay'), 'default')}${booleanProp('fadeTop', bool(values, 'fadeTop'))}${booleanProp('fadeBottom', bool(values, 'fadeBottom'))}${booleanProp('blendLight', bool(values, 'blendLight'))}\n      />\n      <h1 className="relative z-10">Build with confidence</h1>\n    </section>\n  );\n}\n`,

  theme: () => clientExample(
    `import { ThemeProvider, ThemeToggle } from '@ai-created/ui';`,
    `export function App() {\n  return (\n    <ThemeProvider>\n      <header>\n        <ThemeToggle />\n      </header>\n      <main>Your application</main>\n    </ThemeProvider>\n  );\n}`
  ),

  cn: (values) => `import { cn } from '@ai-created/ui';\n\nexport function Example() {\n  const base = ${JSON.stringify(text(values, 'base'))};\n  const conditional = ${JSON.stringify(text(values, 'conditional'))};\n  const enabled = ${bool(values, 'enabled')};\n\n  return (\n    <div className={cn(base, enabled && conditional)}>\n      Merged class output\n    </div>\n  );\n}\n`,

  'motion-helpers': (values) => clientExample(
    `import { motion } from 'framer-motion';\nimport { fadeUpMotion } from '@ai-created/ui';`,
    `export function Example() {\n  return (\n    <motion.section {...fadeUpMotion(${number(values, 'delay')}, ${number(values, 'offset')}, ${number(values, 'duration')})}>\n      Motion follows shared timing and distance conventions.\n    </motion.section>\n  );\n}`
  ),
};

/** Generates a complete, copy-ready TSX example for every documented public API. */
export function generateWorkbenchCode(
  componentId: ComponentSpecId,
  values: ControlValues
): string {
  return codeGenerators[componentId](resolveValues(componentId, values));
}
