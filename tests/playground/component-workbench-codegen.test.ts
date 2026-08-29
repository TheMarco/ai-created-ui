import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import {
  generateWorkbenchCode,
  getDefaultControlValues,
  parseWorkbenchSearchParams,
  writeWorkbenchSearchParams,
} from '../../playground/src/components/design-system/spec-workbench';
import { componentSpecs } from '../../playground/src/components/design-system/specs';
import type { ComponentControl } from '../../playground/src/components/design-system/specs';

describe('component workbench code generation', () => {
  it('generates a complete package example for all 22 specification ids', () => {
    expect(componentSpecs).toHaveLength(22);

    for (const spec of componentSpecs) {
      const code = generateWorkbenchCode(spec.id, getDefaultControlValues(spec.controls));
      expect(code, spec.id).toContain("from '@ai-created/ui'");
      expect(code, spec.id).not.toContain('TODO');
      expect(code.trim().length, spec.id).toBeGreaterThan(100);

      const compiled = ts.transpileModule(code, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
        },
        reportDiagnostics: true,
        fileName: `${spec.id}.tsx`,
      });
      const syntaxErrors = (compiled.diagnostics ?? []).filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
      );
      expect(syntaxErrors, spec.id).toEqual([]);
    }
  });

  it('escapes editable text as a JavaScript string inside JSX', () => {
    const label = 'Save <draft> {now} "please"\nnext line';
    const code = generateWorkbenchCode('button', { label });

    expect(code).toContain(`{${JSON.stringify(label)}}`);
    expect(code).not.toContain('Save <draft> {now} "please"\nnext line');
  });

  it('omits optional default props where the public API supplies them', () => {
    const code = generateWorkbenchCode('button', {});

    expect(code).not.toContain('variant=');
    expect(code).not.toContain('size=');
    expect(code).not.toContain('disabled=');
    expect(code).not.toContain('fullWidth=');
  });

  it('places composite controls on the public child that owns them', () => {
    const modal = generateWorkbenchCode('modal', { scroll: false });
    const slider = generateWorkbenchCode('slider', { showValue: false });

    expect(modal).toContain('<ModalBody scroll={false}>');
    expect(modal).not.toMatch(/<Modal(?:Overlay|Panel)[^>]*\bscroll=/);
    expect(slider).toContain('showValue={false}');
  });

  it('generates icon-only buttons with a normalized size and accessible name', () => {
    const code = generateWorkbenchCode('button', {
      variant: 'icon',
      size: 'lg',
      label: 'Save draft',
    });

    expect(code).toContain("import { Save } from 'lucide-react';");
    expect(code).toContain('variant={"icon"}');
    expect(code).toContain('size={"icon"}');
    expect(code).toContain('aria-label={"Save draft"}');
    expect(code).not.toContain('{"Save draft"}\n');
  });

  it('wraps group-interactive surfaces in a group parent', () => {
    const code = generateWorkbenchCode('surface', { interaction: 'group' });

    expect(code).toContain('<div className="group">');
    expect(code).toContain('interaction={"group"}');
  });
});

describe('component workbench URL state', () => {
  const controls = {
    variant: {
      type: 'select',
      label: 'Variant',
      defaultValue: 'primary',
      options: ['primary', 'secondary'],
    },
    label: { type: 'text', label: 'Label', defaultValue: 'Save' },
    disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
    count: { type: 'number', label: 'Count', defaultValue: 2, min: 0, max: 10, step: 2 },
  } satisfies Record<string, ComponentControl>;

  it('returns typed defaults for every control kind', () => {
    expect(getDefaultControlValues(controls)).toEqual({
      variant: 'primary',
      label: 'Save',
      disabled: false,
      count: 2,
    });
    expect(getDefaultControlValues(undefined)).toEqual({});
  });

  it('round trips non-default values while preserving unrelated parameters', () => {
    const values = { variant: 'secondary', label: 'Ship & share', disabled: true, count: 8 };
    const original = new URLSearchParams('panel=code&arg.unknown=keep');
    const written = writeWorkbenchSearchParams(controls, values, original);

    expect(written.get('panel')).toBe('code');
    expect(written.get('arg.unknown')).toBe('keep');
    expect(written.get('arg.variant')).toBe('secondary');
    expect(written.get('arg.label')).toBe('Ship & share');
    expect(written.get('arg.disabled')).toBe('true');
    expect(written.get('arg.count')).toBe('8');
    expect(parseWorkbenchSearchParams(controls, written)).toEqual(values);
    expect(original.toString()).toBe('panel=code&arg.unknown=keep');
  });

  it('omits defaults and removes stale known arguments', () => {
    const original = new URLSearchParams(
      'ref=docs&arg.variant=secondary&arg.label=Changed&arg.disabled=true&arg.count=8'
    );
    const written = writeWorkbenchSearchParams(
      controls,
      getDefaultControlValues(controls),
      original
    );

    expect(written.toString()).toBe('ref=docs');
  });

  it('ignores invalid select, number, and boolean query values', () => {
    const parsed = parseWorkbenchSearchParams(
      controls,
      new URLSearchParams(
        'arg.variant=unknown&arg.disabled=yes&arg.count=3&arg.label=Accepted'
      )
    );

    expect(parsed).toEqual({
      variant: 'primary',
      label: 'Accepted',
      disabled: false,
      count: 2,
    });
  });

  it('does not serialize invalid programmatic values', () => {
    const written = writeWorkbenchSearchParams(
      controls,
      { variant: 'unknown', disabled: 'yes', count: 12, label: 'Valid text' },
      new URLSearchParams()
    );

    expect(written.toString()).toBe('arg.label=Valid+text');
  });
});
