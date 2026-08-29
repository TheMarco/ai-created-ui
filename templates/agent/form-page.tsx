'use client';

import {
  Button,
  Checkbox,
  FieldGroup,
  FieldHint,
  FieldLabel,
  Notice,
  Surface,
  TextArea,
  TextInput,
} from '@ai-created/ui';

export type FormPageStatus = 'ready' | 'saving' | 'success' | 'error' | 'forbidden';

export interface FormValues {
  name: string;
  email: string;
  description: string;
  acknowledged: boolean;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export interface FormPageProps {
  title: string;
  description: string;
  status: FormPageStatus;
  values: FormValues;
  errors: FormErrors;
  onChange: <Key extends keyof FormValues>(field: Key, value: FormValues[Key]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

export default function FormPage({
  title,
  description,
  status,
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  onRetry,
}: FormPageProps) {
  const isSaving = status === 'saving';

  if (status === 'forbidden') {
    return (
      <main className="min-h-screen bg-bg px-5 py-10 text-text md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Notice variant="warning" title="Editing is restricted">
            You can view this resource, but your role does not allow changes. Ask an owner for edit access.
          </Notice>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-16">
        <header className="space-y-3 border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-text3">Form</p>
          <h1 className="font-heading text-4xl tracking-tightest text-text md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-text2">{description}</p>
        </header>

        <form
          className="py-8"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Surface padding="lg" className="space-y-6">
            {status === 'success' ? (
              <Notice variant="success" title="Changes saved">Your information is up to date.</Notice>
            ) : null}
            {status === 'error' ? (
              <Notice variant="error" title="Changes were not saved">
                Check your connection and try again.
                <div className="mt-3"><Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button></div>
              </Notice>
            ) : null}

            <FieldGroup>
              <FieldLabel htmlFor="record-name">Name</FieldLabel>
              <TextInput
                id="record-name"
                name="name"
                autoComplete="organization"
                required
                value={values.name}
                onChange={(event) => onChange('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'record-name-error' : 'record-name-hint'}
              />
              {errors.name ? (
                <FieldHint id="record-name-error" role="alert" className="text-error">{errors.name}</FieldHint>
              ) : (
                <FieldHint id="record-name-hint">Use the name people recognize.</FieldHint>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
              <TextInput
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(event) => onChange('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : 'contact-email-hint'}
              />
              {errors.email ? (
                <FieldHint id="contact-email-error" role="alert" className="text-error">{errors.email}</FieldHint>
              ) : (
                <FieldHint id="contact-email-hint">We use this address for account notices only.</FieldHint>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="record-description">Description</FieldLabel>
              <TextArea
                id="record-description"
                name="description"
                rows={5}
                maxLength={500}
                value={values.description}
                onChange={(event) => onChange('description', event.target.value)}
                aria-describedby="record-description-hint"
              />
              <FieldHint id="record-description-hint">{values.description.length} of 500 characters</FieldHint>
            </FieldGroup>

            <Checkbox
              checked={values.acknowledged}
              onChange={(checked) => onChange('acknowledged', checked)}
              label="I have reviewed the information above"
            />
            {errors.acknowledged ? <p role="alert" className="text-xs text-error">{errors.acknowledged}</p> : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save changes'}</Button>
            </div>
          </Surface>
        </form>
      </div>
    </main>
  );
}
