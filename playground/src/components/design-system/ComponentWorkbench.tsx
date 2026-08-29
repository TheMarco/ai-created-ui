'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Check,
  Code2,
  Eye,
  Link2,
  RotateCcw,
  SlidersHorizontal,
  SquareTerminal,
} from 'lucide-react';
import { Notice, cn, useTheme } from '@ai-created/ui';
import DSCodeBlock from './DSCodeBlock';
import SpecimenCanvas from './SpecimenCanvas';
import type { ComponentControl, ComponentSpec } from './specs';
import {
  ControlledSpecimen,
  generateWorkbenchCode,
  getDefaultControlValues,
  parseWorkbenchSearchParams,
  writeWorkbenchSearchParams,
} from './spec-workbench';
import type { ControlValue, ControlValues } from './spec-workbench';

type WorkbenchView = 'preview' | 'code' | 'setup';

const views: Array<{ id: WorkbenchView; label: string; icon: typeof Eye }> = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'setup', label: 'Setup', icon: SquareTerminal },
];

const installCommand = 'npm install --install-links "git+https://github.com/TheMarco/ai-created-ui.git#vX.Y.Z"';
const tokenImport = `@import '@ai-created/ui/styles/tokens.css';\n\n@tailwind base;\n@tailwind components;\n@tailwind utilities;`;
const presetCode = `module.exports = {\n  presets: [require('@ai-created/ui/tailwind-preset')],\n  content: [\n    './src/**/*.{js,ts,jsx,tsx,mdx}',\n    './node_modules/@ai-created/ui/src/**/*.{js,ts,jsx,tsx}',\n  ],\n};`;

interface WorkbenchControlProps {
  name: string;
  control: ComponentControl;
  value: ControlValue;
  onChange: (value: ControlValue) => void;
}

function WorkbenchControl({ name, control, value, onChange }: WorkbenchControlProps) {
  const inputId = `workbench-control-${name}`;

  if (control.type === 'boolean') {
    return (
      <label
        htmlFor={inputId}
        className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-2 transition-colors hover:bg-surface2"
      >
        <span className="text-sm text-text2">{control.label}</span>
        <input
          id={inputId}
          data-control={name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-red-solid"
        />
      </label>
    );
  }

  if (control.type === 'select') {
    return (
      <div className="space-y-2 px-3 py-2">
        <label htmlFor={inputId} className="block text-xs font-medium text-text2">
          {control.label}
        </label>
        <select
          id={inputId}
          data-control={name}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-10 w-full rounded-sm border border-border bg-surface2 px-3 text-sm text-text transition-colors hover:border-border-strong focus:border-red-border"
        >
          {control.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  if (control.type === 'number') {
    return (
      <div className="space-y-3 px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={inputId} className="text-xs font-medium text-text2">
            {control.label}
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id={inputId}
              data-control={name}
              type="number"
              value={Number(value)}
              min={control.min}
              max={control.max}
              step={control.step}
              onChange={(event) => onChange(Number(event.target.value))}
              className="h-9 w-20 rounded-sm border border-border bg-surface2 px-2 font-mono text-xs text-text focus:border-red-border"
            />
            {control.unit ? <span className="font-mono text-[10px] text-text3">{control.unit}</span> : null}
          </div>
        </div>
        <input
          aria-label={`${control.label} range`}
          type="range"
          value={Number(value)}
          min={control.min}
          max={control.max}
          step={control.step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="slider-input w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2 px-3 py-2">
      <label htmlFor={inputId} className="block text-xs font-medium text-text2">
        {control.label}
      </label>
      <input
        id={inputId}
        data-control={name}
        type="text"
        value={String(value)}
        placeholder={control.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 w-full rounded-sm border border-border bg-surface2 px-3 text-sm text-text placeholder:text-text3 focus:border-red-border"
      />
    </div>
  );
}

function updateBrowserSearch(
  spec: ComponentSpec,
  values: ControlValues,
) {
  if (typeof window === 'undefined') return;
  const nextSearch = writeWorkbenchSearchParams(
    spec.controls,
    values,
    new URLSearchParams(window.location.search),
  );
  const query = nextSearch.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
}

export default function ComponentWorkbench({ spec }: { spec: ComponentSpec }) {
  const defaults = useMemo(() => getDefaultControlValues(spec.controls), [spec.controls]);
  const [values, setValues] = useState<ControlValues>(defaults);
  const valuesRef = useRef<ControlValues>(defaults);
  const [view, setView] = useState<WorkbenchView>('preview');
  const [linkCopied, setLinkCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const controls = Object.entries(spec.controls ?? {});
  const generatedCode = generateWorkbenchCode(spec.id, values);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const parsed = parseWorkbenchSearchParams(spec.controls, search);
    const next = {
      ...valuesRef.current,
      ...parsed,
      ...(spec.id === 'theme' && !search.has('arg.theme') ? { theme } : {}),
    };
    valuesRef.current = next;
    setValues(next);
  }, [spec.controls, spec.id, theme]);

  const changeControl = useCallback((name: string, value: ControlValue) => {
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    updateBrowserSearch(spec, next);

    if (spec.id === 'theme' && name === 'theme' && value !== theme) {
      toggleTheme();
    }
  }, [spec, theme, toggleTheme]);

  function resetControls() {
    const next = {
      ...defaults,
      ...(spec.id === 'theme' ? { theme } : {}),
    };
    valuesRef.current = next;
    setValues(next);
    updateBrowserSearch(spec, next);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1500);
  }

  function moveViewFocus(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = views.findIndex((option) => option.id === view);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % views.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + views.length) % views.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = views.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextView = views[nextIndex].id;
    setView(nextView);
    document.getElementById(`workbench-tab-${nextView}`)?.focus();
  }

  return (
    <div data-workbench={spec.id} className="overflow-hidden rounded-md border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div role="tablist" aria-label="Workbench views" className="flex items-center gap-1">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`workbench-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={view === id}
              aria-controls={`workbench-panel-${id}`}
              tabIndex={view === id ? 0 : -1}
              onClick={() => setView(id)}
              onKeyDown={moveViewFocus}
              className={cn(
                'inline-flex min-h-9 items-center gap-2 rounded-sm px-3 text-xs transition-colors',
                view === id ? 'bg-surface2 text-text' : 'text-text3 hover:bg-surface2 hover:text-text2',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetControls}
            className="inline-flex min-h-9 items-center gap-2 rounded-sm px-3 text-xs text-text3 transition-colors hover:bg-surface2 hover:text-text"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-9 items-center gap-2 rounded-sm px-3 text-xs text-text3 transition-colors hover:bg-surface2 hover:text-text"
          >
            {linkCopied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {linkCopied ? 'Link copied' : 'Copy link'}
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 p-4 sm:p-6">
          <div
            id="workbench-panel-preview"
            role="tabpanel"
            aria-labelledby="workbench-tab-preview"
            hidden={view !== 'preview'}
          >
            <SpecimenCanvas>
              <ControlledSpecimen componentId={spec.id} values={values} onChange={changeControl} />
            </SpecimenCanvas>
          </div>

          <div
            id="workbench-panel-code"
            role="tabpanel"
            aria-labelledby="workbench-tab-code"
            hidden={view !== 'code'}
            className="space-y-7"
          >
            <div>
              <h3 className="font-heading text-lg font-medium text-text">Generated example</h3>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                This JSX stays synchronized with the controls and uses only public package APIs.
              </p>
            </div>
            <DSCodeBlock code={generatedCode} language="tsx" />
            <div>
              <h3 className="font-heading text-lg font-medium text-text">Import</h3>
              <div className="mt-3">
                <DSCodeBlock code={spec.implementation.importStatement} language="tsx" />
              </div>
            </div>
            {spec.implementation.clientComponent ? (
              <Notice variant="info" title="Client boundary">
                Add <code className="font-mono text-xs">&apos;use client&apos;</code> to the file that owns this interactive state.
              </Notice>
            ) : null}
          </div>

          <div
            id="workbench-panel-setup"
            role="tabpanel"
            aria-labelledby="workbench-tab-setup"
            hidden={view !== 'setup'}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading text-lg font-medium text-text">Install from a reviewed release</h3>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                Replace the version placeholder with the release tag your product has reviewed.
              </p>
              <div className="mt-4"><DSCodeBlock code={installCommand} language="shell" /></div>
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium text-text">Load semantic tokens</h3>
              <div className="mt-4"><DSCodeBlock code={tokenImport} language="css" /></div>
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium text-text">Extend Tailwind</h3>
              <div className="mt-4"><DSCodeBlock code={presetCode} language="js" /></div>
            </div>
          </div>
        </div>

        <aside className="border-t border-border bg-bg/30 p-4 xl:border-l xl:border-t-0" aria-label="Component controls">
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <h3 className="inline-flex items-center gap-2 font-heading text-base font-medium text-text">
              <SlidersHorizontal className="h-4 w-4 text-red" aria-hidden="true" />
              Controls
            </h3>
            <span className="font-mono text-[10px] text-text3">{controls.length}</span>
          </div>
          {controls.length ? (
            <fieldset className="mt-2 space-y-1">
              <legend className="sr-only">Configure {spec.name}</legend>
              {controls.map(([name, control]) => (
                <WorkbenchControl
                  key={name}
                  name={name}
                  control={control}
                  value={values[name] ?? control.defaultValue}
                  onChange={(value) => changeControl(name, value)}
                />
              ))}
            </fieldset>
          ) : (
            <p className="px-3 py-4 text-sm leading-relaxed text-text2">
              This entry is a code utility without runtime props. Use the Code tab to inspect its composition.
            </p>
          )}
          <p className="mt-5 border-t border-border px-3 pt-4 text-xs leading-relaxed text-text3">
            Changes are encoded in this page URL, so the current configuration can be shared or reloaded.
          </p>
        </aside>
      </div>
    </div>
  );
}
