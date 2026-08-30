'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export function fieldGroupStyles(className?: string) {
  return cn('flex flex-col gap-2', className);
}

export function fieldLabelStyles(className?: string) {
  return cn('block text-sm font-medium text-text2', className);
}

export function fieldLegendStyles(className?: string) {
  return cn('block text-xs font-mono uppercase tracking-wider text-text2', className);
}

export function fieldHintStyles(className?: string) {
  return cn('text-xs text-text2', className);
}

export function inputStyles(className?: string) {
  return cn(
    'w-full rounded-md border border-border bg-surface2 px-4 py-3 text-sm text-text placeholder-text3 transition-colors duration-200 hover:border-border-strong focus:border-red-border disabled:cursor-not-allowed disabled:opacity-50',
    className
  );
}

export type FieldGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(function FieldGroup(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={fieldGroupStyles(className)} {...props} />;
});

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref
) {
  // Association is supplied by the consumer through htmlFor or nested control composition.
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label ref={ref} className={fieldLabelStyles(className)} {...props} />;
});

export type FieldLegendProps = React.HTMLAttributes<HTMLSpanElement>;

export const FieldLegend = forwardRef<HTMLSpanElement, FieldLegendProps>(function FieldLegend(
  { className, ...props },
  ref
) {
  return <span ref={ref} className={fieldLegendStyles(className)} {...props} />;
});

export type FieldHintProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldHint = forwardRef<HTMLParagraphElement, FieldHintProps>(function FieldHint(
  { className, ...props },
  ref
) {
  return <p ref={ref} className={fieldHintStyles(className)} {...props} />;
});

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={inputStyles(className)} {...props} />;
});

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, ...props },
  ref
) {
  return <textarea ref={ref} className={inputStyles(cn('resize-none', className))} {...props} />;
});
