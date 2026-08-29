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

export type DashboardPageStatus = 'loading' | 'ready' | 'empty' | 'error' | 'forbidden';

export interface DashboardMetric {
  label: string;
  value: string;
  context: string;
}

export interface DashboardActivity {
  id: string;
  title: string;
  status: string;
  timestamp: string;
}

export interface DashboardPageProps {
  status: DashboardPageStatus;
  metrics: DashboardMetric[];
  activity: DashboardActivity[];
  errorMessage?: string;
  onPrimaryAction: () => void;
  onRetry: () => void;
}

function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Surface key={item} padding="md" className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-2/3" />
          </Surface>
        ))}
      </div>
      <Surface padding="lg" className="space-y-4">
        {[0, 1, 2].map((item) => <Skeleton key={item} className="h-10 w-full" />)}
      </Surface>
    </div>
  );
}

export default function DashboardPage({
  status,
  metrics,
  activity,
  errorMessage = 'Dashboard data could not be loaded. Try again.',
  onPrimaryAction,
  onRetry,
}: DashboardPageProps) {
  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-8xl px-5 py-10 md:px-8 md:py-16">
        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-text3">Workspace overview</p>
            <h1 className="font-heading text-4xl tracking-tightest text-text md:text-5xl">Dashboard</h1>
            <p className="text-base leading-relaxed text-text2">Monitor the work that needs attention and act on meaningful changes.</p>
          </div>
          <Button onClick={onPrimaryAction}>Create record</Button>
        </header>

        <div className="py-8">
          {status === 'loading' ? <DashboardLoading /> : null}
          {status === 'error' ? (
            <div className="space-y-4">
              <ErrorReport message={errorMessage} />
              <Button variant="secondary" onClick={onRetry}>Try again</Button>
            </div>
          ) : null}
          {status === 'forbidden' ? (
            <Notice variant="warning" title="Dashboard access required">
              Ask a workspace administrator to add the reporting permission to your role.
            </Notice>
          ) : null}
          {status === 'empty' ? (
            <EmptyState title="Nothing to report yet" description="Create the first record to start collecting dashboard activity.">
              <Button onClick={onPrimaryAction}>Create record</Button>
            </EmptyState>
          ) : null}

          {status === 'ready' ? (
            <div className="space-y-10">
              <section aria-labelledby="dashboard-metrics">
                <h2 id="dashboard-metrics" className="sr-only">Key metrics</h2>
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {metrics.map((metric) => (
                    <Surface key={metric.label} padding="md">
                      <dt className="font-mono text-xs uppercase tracking-wider text-text3">{metric.label}</dt>
                      <dd className="mt-3 font-heading text-3xl text-text">{metric.value}</dd>
                      <p className="mt-2 text-xs text-text2">{metric.context}</p>
                    </Surface>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="recent-activity">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 id="recent-activity" className="font-heading text-2xl text-text">Recent activity</h2>
                    <p className="mt-1 text-sm text-text2">The most recent changes across the workspace.</p>
                  </div>
                </div>
                {activity.length > 0 ? (
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {activity.map((item) => (
                      <li key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-text">{item.title}</p>
                          <p className="mt-1 font-mono text-xs text-text3">{item.timestamp}</p>
                        </div>
                        <Badge variant="muted">{item.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-text3">No recent activity.</p>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
