'use client';

import {
  Badge,
  Button,
  EmptyState,
  ErrorReport,
  Notice,
  Skeleton,
  Surface,
} from '@ai-created/ui';

export type DetailPageStatus = 'loading' | 'ready' | 'not-found' | 'error' | 'forbidden';

export interface DetailRecord {
  title: string;
  summary: string;
  status: string;
  owner: string;
  updatedAt: string;
  attributes: Array<{ label: string; value: string }>;
  notes: string[];
}

export interface DetailPageProps {
  status: DetailPageStatus;
  record?: DetailRecord;
  errorMessage?: string;
  onBack: () => void;
  onEdit: () => void;
  onRetry: () => void;
}

function DetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading record" className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Surface padding="lg" className="grid gap-6 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-12 w-full" />)}
      </Surface>
    </div>
  );
}

export default function DetailPage({
  status,
  record,
  errorMessage = 'This record could not be loaded. Try again.',
  onBack,
  onEdit,
  onRetry,
}: DetailPageProps) {
  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-8xl px-5 py-10 md:px-8 md:py-16">
        <Button variant="ghost" size="inline" onClick={onBack}>Back to directory</Button>

        <div className="mt-8">
          {status === 'loading' ? <DetailLoading /> : null}
          {status === 'error' ? (
            <div className="space-y-4">
              <ErrorReport message={errorMessage} />
              <Button variant="secondary" onClick={onRetry}>Try again</Button>
            </div>
          ) : null}
          {status === 'forbidden' ? (
            <Notice variant="warning" title="Access required">
              You do not have permission to view this record. Ask its owner or a workspace administrator for access.
            </Notice>
          ) : null}
          {status === 'not-found' ? (
            <EmptyState title="Record not found" description="It may have moved, been archived, or never existed.">
              <Button variant="secondary" onClick={onBack}>Return to directory</Button>
            </EmptyState>
          ) : null}

          {status === 'ready' && record ? (
            <article>
              <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-text3">Record detail</p>
                    <Badge variant="muted">{record.status}</Badge>
                  </div>
                  <h1 className="font-heading text-4xl tracking-tightest text-text md:text-5xl">{record.title}</h1>
                  <p className="text-base leading-relaxed text-text2">{record.summary}</p>
                </div>
                <Button onClick={onEdit}>Edit record</Button>
              </header>

              <div className="grid gap-8 py-8 lg:grid-cols-3">
                <section aria-labelledby="record-details" className="lg:col-span-2">
                  <h2 id="record-details" className="font-heading text-2xl text-text">Details</h2>
                  <dl className="mt-5 divide-y divide-border border-y border-border">
                    {record.attributes.map((attribute) => (
                      <div key={attribute.label} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                        <dt className="font-mono text-xs uppercase tracking-wider text-text3">{attribute.label}</dt>
                        <dd className="text-sm text-text sm:col-span-2">{attribute.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <aside aria-labelledby="record-context">
                  <Surface variant="muted" padding="md">
                    <h2 id="record-context" className="font-heading text-xl text-text">Context</h2>
                    <dl className="mt-5 space-y-4">
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-wider text-text3">Owner</dt>
                        <dd className="mt-1 text-sm text-text2">{record.owner}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-wider text-text3">Last updated</dt>
                        <dd className="mt-1 text-sm text-text2">{record.updatedAt}</dd>
                      </div>
                    </dl>
                  </Surface>
                </aside>
              </div>

              <section aria-labelledby="record-notes" className="border-t border-border pt-8">
                <h2 id="record-notes" className="font-heading text-2xl text-text">Notes</h2>
                {record.notes.length > 0 ? (
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text2">
                    {record.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-text3">No notes have been added.</p>
                )}
              </section>
            </article>
          ) : null}
        </div>
      </div>
    </main>
  );
}
