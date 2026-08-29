'use client';

import {
  Badge,
  Button,
  FieldGroup,
  FieldHint,
  FieldLabel,
  Notice,
  Surface,
  TextInput,
} from '@ai-created/ui';

export type OnboardingPageStatus = 'ready' | 'saving' | 'error' | 'forbidden' | 'complete';

export interface OnboardingStep {
  id: string;
  label: string;
}

export interface OnboardingPageProps {
  status: OnboardingPageStatus;
  steps: OnboardingStep[];
  activeStep: number;
  workspaceName: string;
  teamPurpose: string;
  onWorkspaceNameChange: (value: string) => void;
  onTeamPurposeChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onRetry: () => void;
  onExit: () => void;
}

export default function OnboardingPage({
  status,
  steps,
  activeStep,
  workspaceName,
  teamPurpose,
  onWorkspaceNameChange,
  onTeamPurposeChange,
  onBack,
  onContinue,
  onRetry,
  onExit,
}: OnboardingPageProps) {
  const safeStep = Math.min(Math.max(activeStep, 0), Math.max(steps.length - 1, 0));
  const isSaving = status === 'saving';

  if (status === 'complete') {
    return (
      <main className="flex min-h-screen items-center bg-bg px-5 py-10 text-text md:px-8">
        <Surface variant="accent" padding="responsive" className="mx-auto w-full max-w-3xl text-center">
          <Badge variant="success">Setup complete</Badge>
          <h1 className="mt-5 font-heading text-4xl tracking-tightest text-text md:text-5xl">Your workspace is ready</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text2">Invite your team or begin with the first workflow.</p>
          <div className="mt-8"><Button onClick={onExit}>Open workspace</Button></div>
        </Surface>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-8xl px-5 py-10 md:px-8 md:py-16">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-text3">Workspace setup</p>
          <h1 className="mt-3 font-heading text-4xl tracking-tightest text-text md:text-5xl">Create a shared foundation</h1>
        </header>

        <div className="grid gap-10 py-8 lg:grid-cols-3">
          <nav aria-label="Setup progress">
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center gap-3">
                  <Badge variant={index === safeStep ? 'default' : index < safeStep ? 'success' : 'muted'}>
                    {index + 1}
                  </Badge>
                  <span className={index === safeStep ? 'text-sm font-medium text-text' : 'text-sm text-text2'}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          <section aria-labelledby="setup-step-title" className="lg:col-span-2">
            {status === 'forbidden' ? (
              <Notice variant="warning" title="Setup permission required">
                Only workspace owners can finish setup. Ask an owner to continue or exit this flow.
                <div className="mt-3"><Button variant="secondary" size="sm" onClick={onExit}>Exit setup</Button></div>
              </Notice>
            ) : (
              <Surface padding="lg">
                <p className="font-mono text-xs uppercase tracking-wider text-text3">Step {safeStep + 1} of {steps.length}</p>
                <h2 id="setup-step-title" className="mt-3 font-heading text-3xl text-text">Name your workspace</h2>
                <p className="mt-3 text-sm leading-relaxed text-text2">Use a short, durable name and explain what this team owns.</p>

                {status === 'error' ? (
                  <Notice variant="error" title="Progress was not saved" className="mt-6">
                    Check your connection and try again.
                    <div className="mt-3"><Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button></div>
                  </Notice>
                ) : null}

                <div className="mt-8 space-y-6">
                  <FieldGroup>
                    <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                    <TextInput
                      id="workspace-name"
                      value={workspaceName}
                      onChange={(event) => onWorkspaceNameChange(event.target.value)}
                      autoComplete="organization"
                      maxLength={60}
                      required
                      aria-describedby="workspace-name-hint"
                    />
                    <FieldHint id="workspace-name-hint">{workspaceName.length} of 60 characters</FieldHint>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="team-purpose">Team purpose</FieldLabel>
                    <TextInput
                      id="team-purpose"
                      value={teamPurpose}
                      onChange={(event) => onTeamPurposeChange(event.target.value)}
                      maxLength={120}
                      required
                      aria-describedby="team-purpose-hint"
                    />
                    <FieldHint id="team-purpose-hint">Describe the outcome this workspace supports.</FieldHint>
                  </FieldGroup>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                  <Button variant="secondary" onClick={onBack} disabled={isSaving || safeStep === 0}>Back</Button>
                  <Button onClick={onContinue} disabled={isSaving || !workspaceName.trim() || !teamPurpose.trim()}>
                    {isSaving ? 'Saving…' : safeStep === steps.length - 1 ? 'Finish setup' : 'Continue'}
                  </Button>
                </div>
              </Surface>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
