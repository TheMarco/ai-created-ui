'use client';

import { useState } from 'react';
import { Inbox } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorReport,
  FieldGroup,
  FieldLabel,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  Notice,
  Surface,
  TextInput,
  ThemedHeroImage,
} from '@ai-created/ui';
import DSComponentDemo from './DSComponentDemo';

function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DSComponentDemo
      id="modal"
      title="Modal composition"
      description="The composable Modal family keeps flexible header, body, and footer layouts while owning portal, focus, Escape, backdrop, and restoration behavior."
    >
      <Button variant="primary" onClick={() => setOpen(true)}>Open Modal</Button>
      {open ? (
        <ModalOverlay onClose={() => setOpen(false)}>
          <ModalPanel size="md">
            <ModalHeader
              heading="Create workspace"
              description="A realistic multi-section modal assembled from the shared primitives."
              onClose={() => setOpen(false)}
            />
            <ModalBody>
              <FieldGroup>
                <FieldLabel htmlFor="modal-workspace-name">Workspace name</FieldLabel>
                <TextInput id="modal-workspace-name" defaultValue="Research library" />
              </FieldGroup>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setOpen(false)}>Create workspace</Button>
            </ModalFooter>
          </ModalPanel>
        </ModalOverlay>
      ) : null}
    </DSComponentDemo>
  );
}

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('No action selected.');

  return (
    <DSComponentDemo
      id="confirm-dialog"
      title="ConfirmDialog"
      description="Use the pre-composed alert dialog when an action needs an explicit confirm or cancel decision."
    >
      <div className="space-y-4">
        <Button variant="secondary" onClick={() => setOpen(true)}>Open confirmation</Button>
        <p role="status" className="text-sm text-text2">{result}</p>
      </div>
      <ConfirmDialog
        open={open}
        title="Archive this project?"
        description="The project leaves the active workspace but can be restored later."
        confirmLabel="Archive project"
        onCancel={() => {
          setOpen(false);
          setResult('Archive cancelled.');
        }}
        onConfirm={() => {
          setOpen(false);
          setResult('Project archived.');
        }}
      />
    </DSComponentDemo>
  );
}

function FeedbackDemo() {
  return (
    <DSComponentDemo
      id="semantic-feedback"
      title="Semantic feedback"
      description="Notice variants communicate system state through text, role, icon, border, surface, and color together."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Notice title="Draft saved">Neutral progress that does not need urgency.</Notice>
        <Notice variant="info" title="Import running">We will keep this page updated.</Notice>
        <Notice variant="success" title="Changes published">The new version is now live.</Notice>
        <Notice variant="warning" title="Review required">Two fields still need attention.</Notice>
        <Notice variant="error" title="Publish failed">Check the connection and try again.</Notice>
      </div>
    </DSComponentDemo>
  );
}

function EmptyStateDemo() {
  return (
    <DSComponentDemo
      id="empty-state"
      title="EmptyState"
      description="The shared empty-state primitive pairs direct explanation with one useful next action."
    >
      <EmptyState
        icon={Inbox}
        title="No projects yet"
        description="Create a project when you are ready to collect sources and notes."
      >
        <Button size="sm">Create project</Button>
      </EmptyState>
    </DSComponentDemo>
  );
}

function ErrorReportDemo() {
  return (
    <DSComponentDemo
      id="error-report"
      title="ErrorReport"
      description="An actionable error surface with optional progressive disclosure and copyable debug context."
    >
      <ErrorReport
        message="The workspace could not be synchronized."
        details="The upstream service returned status 503."
        timestamp="2026-08-27T17:00:00.000Z"
      />
    </DSComponentDemo>
  );
}

function HeroMediaDemo() {
  return (
    <DSComponentDemo
      id="themed-hero-image"
      title="ThemedHeroImage live state"
      description="This constrained preview uses the same decorative, theme-aware media primitive as the page hero."
    >
      <Surface className="relative min-h-64 overflow-hidden" aria-label="Theme-aware hero preview">
        <ThemedHeroImage
          darkSrc="/images/hero/designsystem-hero.png"
          lightSrc="/images/hero/designsystem-hero-light.png"
          overlay="soft"
          fadeBottom
        />
        <div className="relative z-10 max-w-lg p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] hero-text-dim">Decorative media</p>
          <p className="mt-3 font-display text-3xl hero-text">One composition, both themes.</p>
          <p className="mt-3 text-sm leading-relaxed hero-text-muted">
            Images stay outside the reading order while overlays preserve readable foreground content.
          </p>
        </div>
      </Surface>
    </DSComponentDemo>
  );
}

export default function ComponentCoverageDemos() {
  return (
    <>
      <ModalDemo />
      <ConfirmDialogDemo />
      <FeedbackDemo />
      <EmptyStateDemo />
      <ErrorReportDemo />
      <HeroMediaDemo />
    </>
  );
}
