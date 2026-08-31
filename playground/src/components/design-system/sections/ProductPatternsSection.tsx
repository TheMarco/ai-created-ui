'use client';

import { useState } from 'react';
import DSSection from '../DSSection';
import DSComponentDemo from '../DSComponentDemo';
import {
  Badge,
  Button,
  Surface,
  Tabs,
} from '@ai-created/ui';
import {
  BookOpen,
  ChevronDown,
  Download,
  HelpCircle,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';

type WorkflowTab = 'sources' | 'evidence' | 'analysis' | 'outputs';
type WorkspaceKey = 'resume' | 'cover' | 'stories' | 'answers';

const patternCards = [
  {
    title: 'Workflow vs Utility',
    body:
      'Primary navigation should represent the actual work. Help, settings, and other support utilities belong adjacent to the workflow, not inside it as fake peer steps.',
  },
  {
    title: 'Calm Capacity States',
    body:
      'When users hit a limit, prefer a composed capacity component and an unavailable affordance with immediate actions. Avoid warning banners that make the product feel brittle.',
  },
  {
    title: 'Overview + Workspace',
    body:
      'If a page contains multiple tools or outputs, start with a compact overview and open one focused workspace at a time. Do not stack four mini-products in one endless scroll.',
  },
  {
    title: 'Honest Empty States',
    body:
      'If an action has nowhere useful to go yet, disable it or replace it with explanatory copy. Do not make users click into emptiness just to learn there is nothing there.',
  },
  {
    title: 'Control Center Settings',
    body:
      'Settings should read like a calm control center: status-first cards, expandable editing, and danger-zone actions demoted out of the main IA.',
  },
  {
    title: 'Dense, Aligned Toolbars',
    body:
      'In horizontal action rows, controls should share height and family resemblance. If one control expands to fill remaining width, it should still look like it belongs to the same toolbar.',
  },
];

const workflowTabs = [
  { key: 'sources' as WorkflowTab, label: 'Sources' },
  { key: 'evidence' as WorkflowTab, label: 'Evidence' },
  { key: 'analysis' as WorkflowTab, label: 'Analysis' },
  { key: 'outputs' as WorkflowTab, label: 'Outputs' },
];

const workspaceCards = [
  {
    key: 'resume' as WorkspaceKey,
    title: 'Resume',
    status: 'Ready',
    variant: 'success' as const,
    meta: 'Updated 2h ago',
  },
  {
    key: 'cover' as WorkspaceKey,
    title: 'Cover Letter',
    status: 'Stale',
    variant: 'warning' as const,
    meta: 'Needs refresh',
  },
  {
    key: 'stories' as WorkspaceKey,
    title: 'Stories',
    status: 'Ready',
    variant: 'success' as const,
    meta: '6 stories ready',
  },
  {
    key: 'answers' as WorkspaceKey,
    title: 'Application Answers',
    status: 'Missing',
    variant: 'muted' as const,
    meta: 'No saved answers yet',
  },
];

const workspacePanels: Record<WorkspaceKey, { title: string; body: string }> = {
  resume: {
    title: 'Resume workspace',
    body:
      'Preview, QA, download, and refine the resume without competing against the cover letter or application answers in the same vertical stack.',
  },
  cover: {
    title: 'Cover letter workspace',
    body:
      'A focused place for tone controls, rewrite guidance, and evidence-backed copy instead of burying the letter under other outputs.',
  },
  stories: {
    title: 'Interview stories workspace',
    body:
      'A single surface for the story bank so it feels like its own useful artifact rather than an “other materials” appendix.',
  },
  answers: {
    title: 'Application answers workspace',
    body:
      'A dedicated area for screening-question responses so form answers do not feel pasted into the bottom of a broader outputs page.',
  },
};

function NavigationHierarchyDemo() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('sources');

  return (
    <DSComponentDemo
      title="Workflow Navigation + Utility Actions"
      description="Task navigation stays in the tab system. Help and settings stay adjacent as utilities, not disguised as peer workflow steps."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md" className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <Tabs
                tabs={workflowTabs}
                active={activeTab}
                onChange={(value) => setActiveTab(value as WorkflowTab)}
                label="Workflow sections"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-3.5 w-3.5" />
                Help
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Button>
            </div>
          </div>
          <p className="text-sm text-text2">
            Active workflow: <span className="font-medium text-text capitalize">{activeTab}</span>
          </p>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Use this for</span>
            <span className="text-xs text-text2 leading-relaxed">Core task flows where users move between known stages of work.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Avoid</span>
            <span className="text-xs text-text2 leading-relaxed">Putting Help, Settings, or other support utilities inside the workflow tablist unless they are true destinations.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function CapacityStateDemo() {
  return (
    <DSComponentDemo
      title="Capacity State"
      description="Capacity should feel managed and intentional. Calm heading, short helper copy, unavailable affordance, and direct recovery actions."
    >
      <Surface variant="default" padding="md" className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-display text-text">10 of 10 cases used</h4>
              <Badge variant="muted">Full</Badge>
            </div>
            <p className="max-w-2xl text-sm text-text2">
              Make room before creating another case. Auto-delete is secondary information, not the headline.
            </p>
          </div>
          <Button variant="secondary" size="sm" disabled>
            <Plus className="h-3.5 w-3.5" />
            New Case
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm">
            <Download className="h-3.5 w-3.5" />
            Export oldest
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-3.5 w-3.5" />
            Delete oldest
          </Button>
        </div>
      </Surface>
    </DSComponentDemo>
  );
}

function WorkspacePatternDemo() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>('resume');

  return (
    <DSComponentDemo
      title="Overview + Workspace"
      description="For pages with multiple outputs or tools, use a scan-friendly overview row and open one focused workspace below it."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {workspaceCards.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveWorkspace(card.key)}
              className={`rounded-md border p-4 text-left transition-colors ${
                activeWorkspace === card.key
                  ? 'border-border-strong bg-surface'
                  : 'border-border bg-surface2 hover:border-border-strong hover:bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-text">{card.title}</p>
                <Badge variant={card.variant}>{card.status}</Badge>
              </div>
              <p className="mt-3 text-xs text-text3">{card.meta}</p>
            </button>
          ))}
        </div>

        <Surface variant="default" padding="md" className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-base font-heading font-medium text-text">{workspacePanels[activeWorkspace].title}</h4>
            <Button variant="secondary" size="sm">Open</Button>
          </div>
          <p className="text-sm text-text2 leading-relaxed">
            {workspacePanels[activeWorkspace].body}
          </p>
        </Surface>
      </div>
    </DSComponentDemo>
  );
}

function ControlCenterDemo() {
  return (
    <DSComponentDemo
      title="Control Center Settings"
      description="Status-first cards with expandable actions are calmer and more legible than one long undifferentiated settings form."
    >
      <div className="space-y-3">
        {[
          { title: 'AI Provider', summary: 'OpenAI connected · Highest quality mode', status: 'Connected', variant: 'success' as const, action: 'Manage' },
          { title: 'Base Resume', summary: 'resume-marco-2026.pdf', status: 'Connected', variant: 'success' as const, action: 'Replace' },
          { title: 'Portfolio Website', summary: 'marco.design · marked as portfolio', status: 'Connected', variant: 'success' as const, action: 'Edit' },
          { title: 'LinkedIn Recommendations', summary: 'No file added yet', status: 'Not Added', variant: 'muted' as const, action: 'Add' },
        ].map((item) => (
          <Surface key={item.title} variant="default" padding="md" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text">{item.title}</p>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
              <p className="text-sm text-text2">{item.summary}</p>
            </div>
            <Button variant="secondary" size="sm">{item.action}</Button>
          </Surface>
        ))}

        <Surface variant="muted" padding="sm" className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text">Danger Zone</p>
            <p className="text-xs text-text3">Keep destructive actions demoted and collapsible.</p>
          </div>
          <Button variant="ghost" size="sm">Show</Button>
        </Surface>
      </div>
    </DSComponentDemo>
  );
}

function DenseToolbarDemo() {
  return (
    <DSComponentDemo
      title="Dense, Aligned Toolbars"
      description="Toolbar controls should share height and family resemblance. One trailing control may flex to fill remaining width, but it should still feel like part of the same row."
    >
      <div className="space-y-5">
        <Surface variant="default" padding="md" className="space-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3 lg:flex-nowrap">
            <Button variant="secondary" size="md" className="shrink-0">
              Replace Resume
            </Button>
            <Button variant="secondary" size="md" className="shrink-0">
              LinkedIn
            </Button>
            <Button variant="secondary" size="md" className="shrink-0">
              Website
            </Button>
            <div className="min-w-[14rem] flex-1 lg:min-w-0">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                className="justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  Add Evidence
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </div>
          </div>
        </Surface>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Use this for</span>
            <span className="text-xs text-text2 leading-relaxed">Action rows where most controls are fixed-width and one contextual action should occupy the remaining space.</span>
          </Surface>
          <Surface variant="muted" padding="sm">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Avoid</span>
            <span className="text-xs text-text2 leading-relaxed">Mixing different heights or dropping the flexible control onto its own full-width row when enough horizontal space still exists.</span>
          </Surface>
        </div>
      </div>
    </DSComponentDemo>
  );
}

function HonestEmptyStateDemo() {
  return (
    <DSComponentDemo
      title="Honest Empty State"
      description="When a panel has nothing meaningful to show yet, keep the message clear and disable dead-end actions instead of inviting a pointless click."
    >
      <Surface variant="default" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-text3" />
            <p className="text-base font-medium text-text">Evidence Library</p>
            <Badge variant="default">0 saved answers</Badge>
          </div>
          <p className="max-w-2xl text-sm text-text2">
            Saved answers from guided questions and chat will appear here so they can be reused across cases.
          </p>
        </div>
        <Button variant="secondary" size="sm" disabled>
          Open library
        </Button>
      </Surface>
    </DSComponentDemo>
  );
}

const patternRules = [
  'Promote the primary metric or task. Do not bury the most important state in helper text.',
  'Remove duplicate labels and low-value system chrome before adding more explanation.',
  'If a page contains multiple tools, scan first, work second: overview row on top, one focused workspace below.',
  'Prefer embedded action states over broad warning banners for expected product conditions like limits or stale data.',
  'Keep empty states honest by disabling or replacing actions that cannot do anything useful yet.',
  'Settings should group reusable sources and system configuration into compact status cards, with danger-zone actions demoted.',
];

interface ProductPatternsSectionProps {
  onInView?: (id: string) => void;
}

export default function ProductPatternsSection({ onInView }: ProductPatternsSectionProps) {
  return (
    <DSSection
      id="product-ux"
      title="Product UX Patterns"
      subtitle="Production learnings from product surfaces like Human, Actually should be part of the system contract, not buried in one app’s implementation history."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
        {patternCards.map((pattern) => (
          <Surface key={pattern.title} variant="default" padding="md" className="space-y-2">
            <h3 className="text-base font-heading font-medium text-text">{pattern.title}</h3>
            <p className="text-sm text-text2 leading-relaxed">{pattern.body}</p>
          </Surface>
        ))}
      </div>

      <div className="space-y-8">
        <NavigationHierarchyDemo />
        <CapacityStateDemo />
        <DenseToolbarDemo />
        <WorkspacePatternDemo />
        <ControlCenterDemo />
        <HonestEmptyStateDemo />
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Product UX Rules
        </h3>
        <ul className="space-y-2">
          {patternRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
