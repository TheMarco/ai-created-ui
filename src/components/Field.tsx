'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export function fieldGroupStyles(className?: string) {
  return cn('space-y-2.5', className);
}

export function fieldLabelStyles(className?: string) {
  return cn('mb-2 block text-sm font-medium text-text2', className);
}

export function fieldLegendStyles(className?: string) {
  return cn('mb-2 block text-xs font-mono uppercase tracking-wider text-text2', className);
}

export function fieldHintStyles(className?: string) {
  return cn('mt-2 text-xs text-text2', className);
}

export function inputStyles(className?: string) {
  return cn(
    'w-full rounded-md border border-border bg-surface2 px-4 py-3 text-sm text-text placeholder-text3 transition-colors duration-200 hover:border-border-strong focus:border-red-border disabled:cursor-not-allowed disabled:opacity-50',
    className
  );
}

export type FieldGroupProps = React.HTMLAttributes<HTMLDivElement>;

export function FieldGroup({ className, ...props }: FieldGroupProps) {
  return <div className={fieldGroupStyles(className)} {...props} />;
}

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <label className={fieldLabelStyles(className)} {...props} />;
}

export type FieldLegendProps = React.HTMLAttributes<HTMLSpanElement>;

export function FieldLegend({ className, ...props }: FieldLegendProps) {
  return <span className={fieldLegendStyles(className)} {...props} />;
}

export type FieldHintProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FieldHint({ className, ...props }: FieldHintProps) {
  return <p className={fieldHintStyles(className)} {...props} />;
}

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
