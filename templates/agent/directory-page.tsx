'use client';

import {
  Badge,
  Button,
  EmptyState,
  ErrorReport,
  FieldGroup,
  FieldLabel,
  Skeleton,
  Surface,
  TextInput,
} from '@ai-created/ui';

export type DirectoryPageStatus = 'loading' | 'ready' | 'empty' | 'error' | 'forbidden';

export interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  status: string;
  metadata: string;
}

export interface DirectoryPageProps {
  title: string;
  description: string;
  status: DirectoryPageStatus;
  items: DirectoryItem[];
  query: string;
  errorMessage?: string;
  onQueryChange: (query: string) => void;
  onCreate: () => void;
  onOpen: (id: string) => void;
  onRetry: () => void;
}

function DirectoryLoading() {
  return (
    <div aria-busy="true" aria-label="Loading records" className="space-y-3">
      {[0, 1, 2].map((item) => (
        <Surface key={item} padding="md" className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </Surface>
      ))}
    </div>
  );
}

export default function DirectoryPage({
  title,
  description,
  status,
  items,
  query,
  errorMessage = 'The records could not be loaded. Try again.',
  onQueryChange,
  onCreate,
  onOpen,
  onRetry,
}: DirectoryPageProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleItems = normalizedQuery
    ? items.filter((item) =>
        [item.title, item.description, item.status, item.metadata]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      )
    : items;
  const resolvedStatus = status === 'ready' && visibleItems.length === 0 ? 'empty' : status;

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-8xl px-5 py-10 md:px-8 md:py-16">
        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-text3">Directory</p>
            <h1 className="font-heading text-4xl tracking-tightest text-text md:text-5xl">{title}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-text2">{description}</p>
          </div>
          <Button onClick={onCreate}>Create record</Button>
        </header>

        <section aria-labelledby="directory-results" className="py-8">
          <h2 id="directory-results" className="sr-only">Records</h2>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-lg">
              <FieldGroup>
                <FieldLabel htmlFor="directory-search">Search records</FieldLabel>
                <TextInput
                  id="directory-search"
                  type="search"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search by name, status, or metadata"
                />
              </FieldGroup>
            </div>
            <p className="font-mono text-xs text-text3" aria-live="polite">
              {resolvedStatus === 'ready' ? `${visibleItems.length} records` : 'Results unavailable'}
            </p>
          </div>

          {resolvedStatus === 'loading' ? <DirectoryLoading /> : null}

          {resolvedStatus === 'error' ? (
            <div className="space-y-4">
              <ErrorReport message={errorMessage} />
              <Button variant="secondary" onClick={onRetry}>Try again</Button>
            </div>
          ) : null}

          {resolvedStatus === 'forbidden' ? (
            <EmptyState
              title="Access required"
              description="Ask a workspace administrator for permission to view these records."
            />
          ) : null}

          {resolvedStatus === 'empty' ? (
            <EmptyState
              title={query ? 'No matching records' : 'No records yet'}
              description={query ? 'Try a broader search term.' : 'Create the first record to begin.'}
            >
              {query ? (
                <Button variant="secondary" onClick={() => onQueryChange('')}>Clear search</Button>
              ) : (
                <Button onClick={onCreate}>Create record</Button>
              )}
            </EmptyState>
          ) : null}

          {resolvedStatus === 'ready' ? (
            <ul className="divide-y divide-border border-y border-border">
              {visibleItems.map((item) => (
                <li key={item.id} className="py-5">
                  <article className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-heading text-xl text-text">{item.title}</h2>
                        <Badge variant="muted">{item.status}</Badge>
                      </div>
                      <p className="max-w-3xl text-sm leading-relaxed text-text2">{item.description}</p>
                      <p className="font-mono text-xs text-text3">{item.metadata}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => onOpen(item.id)}>
                      View details
                    </Button>
                  </article>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}
