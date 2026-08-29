'use client';

import { Button, Notice, Surface, Toggle } from '@ai-created/ui';

export type SettingsPageStatus = 'ready' | 'saving' | 'saved' | 'error' | 'forbidden';

export interface SettingsValues {
  productUpdates: boolean;
  securityAlerts: boolean;
  weeklySummary: boolean;
  publicProfile: boolean;
}

export interface SettingsPageProps {
  status: SettingsPageStatus;
  values: SettingsValues;
  onChange: (setting: keyof SettingsValues, checked: boolean) => void;
  onSave: () => void;
  onRetry: () => void;
}

const settings: Array<{
  key: keyof SettingsValues;
  title: string;
  description: string;
  section: 'Notifications' | 'Privacy';
}> = [
  { key: 'productUpdates', title: 'Product updates', description: 'Receive significant product and workflow changes.', section: 'Notifications' },
  { key: 'securityAlerts', title: 'Security alerts', description: 'Receive important account and access notices.', section: 'Notifications' },
  { key: 'weeklySummary', title: 'Weekly summary', description: 'Receive a compact summary of activity each week.', section: 'Notifications' },
  { key: 'publicProfile', title: 'Public profile', description: 'Allow other workspace members to discover your profile.', section: 'Privacy' },
];

export default function SettingsPage({ status, values, onChange, onSave, onRetry }: SettingsPageProps) {
  const isSaving = status === 'saving';

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-8xl px-5 py-10 md:px-8 md:py-16">
        <header className="max-w-3xl space-y-3 border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-text3">Account</p>
          <h1 className="font-heading text-4xl tracking-tightest text-text md:text-5xl">Settings</h1>
          <p className="text-base leading-relaxed text-text2">Control notification and privacy preferences for your account.</p>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-3">
          <nav aria-label="Settings sections">
            <ul className="space-y-2 text-sm">
              <li><a href="#notifications" className="text-text2 hover:text-text">Notifications</a></li>
              <li><a href="#privacy" className="text-text2 hover:text-text">Privacy</a></li>
            </ul>
          </nav>

          <div className="space-y-8 lg:col-span-2">
            {status === 'forbidden' ? (
              <Notice variant="warning" title="Settings are managed by your organization">
                Contact a workspace administrator to request a change.
              </Notice>
            ) : (
              <>
                {status === 'saved' ? <Notice variant="success" title="Settings saved" /> : null}
                {status === 'error' ? (
                  <Notice variant="error" title="Settings were not saved">
                    Check your connection and try again.
                    <div className="mt-3"><Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button></div>
                  </Notice>
                ) : null}

                {(['Notifications', 'Privacy'] as const).map((section) => (
                  <section key={section} id={section.toLocaleLowerCase()} aria-labelledby={`${section.toLocaleLowerCase()}-title`}>
                    <h2 id={`${section.toLocaleLowerCase()}-title`} className="font-heading text-2xl text-text">{section}</h2>
                    <Surface padding="none" className="mt-4 divide-y divide-border">
                      {settings.filter((setting) => setting.section === section).map((setting) => (
                        <div key={setting.key} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="max-w-xl">
                            <h3 className="text-sm font-medium text-text">{setting.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-text2">{setting.description}</p>
                          </div>
                          <Toggle
                            checked={values[setting.key]}
                            onChange={(checked) => onChange(setting.key, checked)}
                            label={setting.title}
                            disabled={isSaving}
                            className="shrink-0"
                          />
                        </div>
                      ))}
                    </Surface>
                  </section>
                ))}

                <div className="flex justify-end border-t border-border pt-6">
                  <Button onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save settings'}</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
