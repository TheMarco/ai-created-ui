'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  FileText,
  Image as ImageIcon,
  Inbox,
  Layers3,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  Dialog,
  Dropdown,
  EmptyState,
  ErrorReport,
  FieldGroup,
  FieldHint,
  FieldLabel,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  Notice,
  RadioGroup,
  Skeleton,
  Slider,
  Surface,
  Tabs,
  TextArea,
  TextInput,
  ThemedHeroImage,
  ThemeToggle,
  Toggle,
  Tooltip,
  borderHoverMotion,
  buttonStyles,
  cn,
  fadeUpMotion,
  motionDuration,
  motionEase,
  motionOffset,
  staggerDelay,
  subtleHoverMotion,
  surfaceStyles,
  useTabPanelProps,
  useTheme,
} from '@ai-created/ui';
import type {
  BadgeVariant,
  ButtonSize,
  ButtonVariant,
  DropdownOption,
  NoticeVariant,
  RadioOption,
  SurfaceVariant,
  Tab,
} from '@ai-created/ui';

const iconClass = 'h-4 w-4';

function SpecimenStage({
  children,
  className,
  status,
}: {
  children: ReactNode;
  className?: string;
  status?: ReactNode;
}) {
  return (
    <div className={cn('space-y-5', className)}>
      {children}
      {status ? (
        <p className="min-h-5 text-xs text-text3" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function SpecimenLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-medium text-text3">{children}</p>;
}

function ButtonSpecimen() {
  const [lastAction, setLastAction] = useState('No action selected yet.');
  const variants: Array<{ value: ButtonVariant; label: string }> = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'destructive', label: 'Destructive' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'filter', label: 'Filter' },
    { value: 'filter-active', label: 'Filter active' },
  ];
  const sizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];

  return (
    <SpecimenStage status={lastAction}>
      <div>
        <SpecimenLabel>Variants</SpecimenLabel>
        <div className="flex flex-wrap items-center gap-3">
          {variants.map(({ value, label }) => (
            <Button key={value} variant={value} onClick={() => setLastAction(`${label} action selected.`)}>
              {value === 'primary' ? <Save className={iconClass} aria-hidden="true" /> : null}
              {value === 'destructive' ? <Trash2 className={iconClass} aria-hidden="true" /> : null}
              {label}
            </Button>
          ))}
          <Button
            variant="icon"
            size="icon"
            aria-label="Add item"
            onClick={() => setLastAction('Icon action selected.')}
          >
            <Plus className={iconClass} aria-hidden="true" />
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <SpecimenLabel>Size scale</SpecimenLabel>
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} size={size} variant="secondary" onClick={() => setLastAction(`${size.toUpperCase()} size selected.`)}>
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </SpecimenStage>
  );
}

const badgeVariants: BadgeVariant[] = ['default', 'muted', 'success', 'warning', 'error', 'info'];

function BadgeSpecimen() {
  const [compact, setCompact] = useState(false);

  return (
    <SpecimenStage status={compact ? 'Compact labels are active.' : 'Standard labels are active.'}>
      <div className="flex flex-wrap gap-3">
        {badgeVariants.map((variant) => (
          <Badge key={variant} variant={variant} className={compact ? 'px-1.5' : undefined}>
            {variant === 'default' ? 'Default' : variant[0].toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </div>
      <Button variant="secondary" size="sm" onClick={() => setCompact((value) => !value)}>
        Toggle compact spacing
      </Button>
    </SpecimenStage>
  );
}

const surfaceVariants: SurfaceVariant[] = [
  'default',
  'muted',
  'accent',
  'inset',
  'success',
  'warning',
  'info',
  'error',
];

function SurfaceSpecimen() {
  const [selected, setSelected] = useState('accent');

  return (
    <SpecimenStage status={`${selected[0].toUpperCase() + selected.slice(1)} surface selected.`}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {surfaceVariants.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setSelected(variant)}
            aria-pressed={selected === variant}
            className="group rounded-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px]"
          >
            <Surface
              variant={variant}
              padding="sm"
              interaction="group"
              className={cn('h-full', selected === variant && 'ring-1 ring-red-border')}
            >
              <p className="text-sm font-medium text-text">{variant[0].toUpperCase() + variant.slice(1)}</p>
              <p className="mt-1 text-xs text-text3">Border and semantic surface tokens.</p>
            </Surface>
          </button>
        ))}
      </div>
    </SpecimenStage>
  );
}

const noticeVariants: NoticeVariant[] = ['default', 'info', 'success', 'warning', 'error'];

function NoticeSpecimen() {
  const [variantIndex, setVariantIndex] = useState(1);
  const [centered, setCentered] = useState(false);
  const variant = noticeVariants[variantIndex];

  return (
    <SpecimenStage>
      <Notice variant={variant} title={`${variant[0].toUpperCase() + variant.slice(1)} notice`} centered={centered}>
        The component coordinates icon, tone, live region, and supporting copy.
      </Notice>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={() => setVariantIndex((value) => (value + 1) % noticeVariants.length)}>
          Next tone
        </Button>
        <Button variant={centered ? 'filter-active' : 'filter'} size="sm" onClick={() => setCentered((value) => !value)}>
          Center content
        </Button>
      </div>
    </SpecimenStage>
  );
}

function SkeletonSpecimen() {
  const [loading, setLoading] = useState(true);

  return (
    <SpecimenStage status={loading ? 'Loading preview is visible.' : 'Loaded content is visible.'}>
      <Surface padding="md" className="min-h-40">
        {loading ? (
          <div className="flex gap-4" aria-label="Loading profile">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="w-full space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full max-w-lg" />
              <Skeleton className="h-3 w-4/5 max-w-md" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface2 text-text2">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-text">Component library</p>
              <p className="mt-1 max-w-lg text-sm leading-relaxed text-text2">
                Content occupies the same geometry as its loading placeholder.
              </p>
              <Button className="mt-4" size="sm" variant="secondary">View release</Button>
            </div>
          </div>
        )}
      </Surface>
      <Button variant="secondary" size="sm" onClick={() => setLoading((value) => !value)}>
        <RefreshCw className={iconClass} aria-hidden="true" />
        {loading ? 'Show loaded state' : 'Show loading state'}
      </Button>
    </SpecimenStage>
  );
}

function EmptyStateSpecimen() {
  const [created, setCreated] = useState(false);

  return (
    <SpecimenStage status={created ? 'A first project has been created.' : 'The collection is empty.'}>
      {created ? (
        <Surface padding="md" variant="success">
          <div className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 text-success" aria-hidden="true" />
            <div>
              <p className="font-medium text-text">Research library</p>
              <p className="mt-1 text-sm text-text2">Your first project is ready for sources and notes.</p>
              <Button variant="ghost" size="inline" className="mt-3" onClick={() => setCreated(false)}>
                Reset specimen
              </Button>
            </div>
          </div>
        </Surface>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No projects yet"
          description="Create a project when you are ready to collect sources and notes."
        >
          <Button size="sm" onClick={() => setCreated(true)}>
            <Plus className={iconClass} aria-hidden="true" />
            Create project
          </Button>
        </EmptyState>
      )}
    </SpecimenStage>
  );
}

function ErrorReportSpecimen() {
  return (
    <ErrorReport
      message="The workspace could not be synchronized."
      details="The upstream service returned status 503. Retry after the connection is restored."
      timestamp="2026-08-29T17:00:00.000Z"
    />
  );
}

function FieldSpecimen() {
  const emailHintId = useId();
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !email.includes('@');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 md:grid-cols-2">
      <FieldGroup>
        <FieldLabel htmlFor="spec-email">Email address</FieldLabel>
        <TextInput
          id="spec-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={emailHintId}
          aria-invalid={invalid}
          className={invalid ? 'border-error-border focus:border-error-border' : undefined}
          placeholder="name@example.com"
        />
        <FieldHint id={emailHintId} className={invalid ? 'text-error' : undefined}>
          {invalid ? 'Enter a valid email address.' : 'Used only for release notes.'}
        </FieldHint>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel htmlFor="spec-notes">Implementation notes</FieldLabel>
        <TextArea
          id="spec-notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add context for the team"
        />
        <FieldHint>{notes.length}/120 characters</FieldHint>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel htmlFor="spec-disabled">Disabled field</FieldLabel>
        <TextInput id="spec-disabled" value="Inherited from workspace" disabled readOnly />
      </FieldGroup>
      <div className="flex items-end">
        <Button type="submit">Validate fields</Button>
      </div>
    </form>
  );
}

function CheckboxSpecimen() {
  const [email, setEmail] = useState(true);
  const [product, setProduct] = useState(false);

  return (
    <SpecimenStage status={`${Number(email) + Number(product)} optional notification channels selected.`}>
      <Surface padding="md" className="space-y-3">
        <Checkbox checked={email} onChange={setEmail} label="Email release notes" />
        <Checkbox checked={product} onChange={setProduct} label="Product announcements" />
        <Checkbox checked={true} onChange={() => {}} label="Required security updates" disabled />
      </Surface>
    </SpecimenStage>
  );
}

const densityOptions: RadioOption<'comfortable' | 'compact' | 'system'>[] = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
  { value: 'system', label: 'Match system', disabled: true },
];

function RadioGroupSpecimen() {
  const [density, setDensity] = useState<'comfortable' | 'compact' | 'system'>('comfortable');

  return (
    <SpecimenStage status={`Interface density: ${density}.`}>
      <RadioGroup
        options={densityOptions}
        value={density}
        onChange={setDensity}
        legend="Interface density"
        orientation="horizontal"
      />
    </SpecimenStage>
  );
}

function ToggleSpecimen() {
  const [notifications, setNotifications] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  return (
    <SpecimenStage status={notifications ? 'Notifications are on.' : 'Notifications are off.'}>
      <Surface padding="md" className="space-y-2">
        <Toggle checked={notifications} onChange={setNotifications} label="Project notifications" />
        <Toggle checked={weeklySummary} onChange={setWeeklySummary} label="Weekly summary" />
        <Toggle checked={false} onChange={() => {}} label="Managed by organization" disabled />
      </Surface>
    </SpecimenStage>
  );
}

function SliderSpecimen() {
  const [volume, setVolume] = useState(68);
  const [spacing, setSpacing] = useState(16);

  return (
    <SpecimenStage status={`Preview uses ${spacing}px spacing and ${volume}% volume.`}>
      <div className="grid gap-6 md:grid-cols-2">
        <Slider label="Notification volume" value={volume} onChange={setVolume} formatValue={(value) => `${value}%`} />
        <Slider label="Layout spacing" min={8} max={32} step={4} value={spacing} onChange={setSpacing} formatValue={(value) => `${value}px`} />
      </div>
      <Surface variant="muted" className="flex items-center" style={{ gap: `${spacing}px`, padding: `${spacing}px` }}>
        <span className="h-8 flex-1 rounded-sm bg-highlight" />
        <span className="h-8 flex-1 rounded-sm bg-highlight" />
        <span className="h-8 flex-1 rounded-sm bg-highlight" />
      </Surface>
    </SpecimenStage>
  );
}

const frameworkOptions: DropdownOption<'next' | 'react' | 'tailwind' | 'unavailable'>[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'react', label: 'React' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'unavailable', label: 'Unavailable option', disabled: true },
];

function DropdownSpecimen() {
  const [framework, setFramework] = useState<'next' | 'react' | 'tailwind' | 'unavailable'>('next');
  const selected = frameworkOptions.find((option) => option.value === framework)?.label;

  return (
    <SpecimenStage status={`${selected} selected.`}>
      <div className="max-w-sm">
        <Dropdown options={frameworkOptions} value={framework} onChange={setFramework} label="Rendering framework" />
      </div>
    </SpecimenStage>
  );
}

type SpecTab = 'overview' | 'activity' | 'settings';

const specimenTabs: Tab<SpecTab>[] = [
  { key: 'overview', label: 'Overview', icon: <Layers3 className={iconClass} /> },
  { key: 'activity', label: 'Activity', icon: <FileText className={iconClass} /> },
  { key: 'settings', label: 'Settings', icon: <Settings2 className={iconClass} /> },
];

function TabsSpecimen() {
  const [active, setActive] = useState<SpecTab>('overview');
  const tabsId = useId();
  const overview = useTabPanelProps('overview', active, tabsId);
  const activity = useTabPanelProps('activity', active, tabsId);
  const settings = useTabPanelProps('settings', active, tabsId);

  return (
    <Surface padding="md">
      <Tabs id={tabsId} tabs={specimenTabs} active={active} onChange={setActive} label="Project sections" />
      <div {...overview} className="mt-5 text-sm leading-relaxed text-text2">Overview content shares the same route and context.</div>
      <div {...activity} className="mt-5 text-sm leading-relaxed text-text2">Activity records the latest edits and decisions.</div>
      <div {...settings} className="mt-5 text-sm leading-relaxed text-text2">Settings change how this project behaves.</div>
    </Surface>
  );
}

function DialogSpecimen() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Research library');
  const [savedName, setSavedName] = useState('Research library');

  return (
    <SpecimenStage status={`Current project name: ${savedName}.`}>
      <Button onClick={() => setOpen(true)}>Rename project</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename project"
        description="Use a short name that is easy to recognize."
        size="sm"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSavedName(name);
            setOpen(false);
          }}
          className="space-y-5"
        >
          <FieldGroup>
            <FieldLabel htmlFor="dialog-project-name">Project name</FieldLabel>
            <TextInput id="dialog-project-name" value={name} onChange={(event) => setName(event.target.value)} />
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save name</Button>
          </div>
        </form>
      </Dialog>
    </SpecimenStage>
  );
}

function ModalSpecimen() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState('Design operations');
  const [created, setCreated] = useState('No workspace created in this specimen.');

  return (
    <SpecimenStage status={created}>
      <Button onClick={() => setOpen(true)}>
        <Plus className={iconClass} aria-hidden="true" />
        Create workspace
      </Button>
      {open ? (
        <ModalOverlay onClose={() => setOpen(false)}>
          <ModalPanel size="md">
            <ModalHeader
              heading="Create workspace"
              description="Modal regions compose a flexible application workflow."
              onClose={() => setOpen(false)}
            />
            <ModalBody>
              <FieldGroup>
                <FieldLabel htmlFor="modal-workspace-name">Workspace name</FieldLabel>
                <TextInput id="modal-workspace-name" value={workspace} onChange={(event) => setWorkspace(event.target.value)} />
                <FieldHint>Visible to everyone invited to the workspace.</FieldHint>
              </FieldGroup>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={() => {
                  setCreated(`${workspace} was created.`);
                  setOpen(false);
                }}
              >
                Create workspace
              </Button>
            </ModalFooter>
          </ModalPanel>
        </ModalOverlay>
      ) : null}
    </SpecimenStage>
  );
}

function ConfirmDialogSpecimen() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('The project is active.');

  useEffect(() => {
    if (!loading) return;
    const timeout = window.setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setResult('The project was archived.');
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  return (
    <SpecimenStage status={result}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className={iconClass} aria-hidden="true" />
        Archive project
      </Button>
      <ConfirmDialog
        open={open}
        title="Archive this project?"
        description="It leaves the active workspace but can be restored later."
        confirmLabel="Archive project"
        loadingLabel="Archiving..."
        destructive
        loading={loading}
        onCancel={() => {
          setOpen(false);
          setResult('Archive cancelled.');
        }}
        onConfirm={() => setLoading(true)}
      />
    </SpecimenStage>
  );
}

function TooltipSpecimen() {
  return (
    <div className="flex min-h-40 flex-wrap items-center justify-center gap-6 py-8">
      <Tooltip content="Copy a direct link" position="top" delay={100}>
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Download specification" position="bottom" delay={100}>
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Previous component" position="left" delay={100}>
        <Button variant="icon" size="icon" aria-label="Previous component">
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
        </Button>
      </Tooltip>
      <Tooltip content="Next component" position="right" delay={100}>
        <Button variant="icon" size="icon" aria-label="Next component">
          <ArrowRight className={iconClass} aria-hidden="true" />
        </Button>
      </Tooltip>
    </div>
  );
}

type HeroOverlay = 'default' | 'strong' | 'soft' | 'none';

function ThemedHeroImageSpecimen() {
  const [overlay, setOverlay] = useState<HeroOverlay>('soft');
  const overlays: HeroOverlay[] = ['none', 'soft', 'default', 'strong'];

  return (
    <SpecimenStage status={`${overlay[0].toUpperCase() + overlay.slice(1)} overlay selected.`}>
      <Surface className="relative min-h-64 overflow-hidden" aria-label="Theme-aware hero preview">
        <ThemedHeroImage
          darkSrc="/images/hero/designsystem-hero.png"
          lightSrc="/images/hero/designsystem-hero-light.png"
          overlay={overlay}
          fadeBottom
        />
        <div className="relative z-10 max-w-lg p-8">
          <ImageIcon className="h-5 w-5 hero-text-dim" aria-hidden="true" />
          <p className="mt-4 font-heading text-2xl font-medium hero-text">One composition, both themes.</p>
          <p className="mt-2 text-sm leading-relaxed hero-text-muted">
            Decorative media stays outside the reading order while overlays protect foreground contrast.
          </p>
        </div>
      </Surface>
      <div className="flex flex-wrap gap-2" aria-label="Hero overlay selection">
        {overlays.map((value) => (
          <Button
            key={value}
            variant={value === overlay ? 'filter-active' : 'filter'}
            size="sm"
            onClick={() => setOverlay(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </Button>
        ))}
      </div>
    </SpecimenStage>
  );
}

function ThemeSpecimen() {
  const { theme } = useTheme();

  return (
    <SpecimenStage status={`The active document theme is ${theme}.`}>
      <Surface padding="md" className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-medium text-text">Theme preference</p>
          <p className="mt-1 text-sm text-text2">The provider persists the choice and updates semantic tokens.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={theme === 'dark' ? 'info' : 'warning'}>{theme === 'dark' ? 'Dark' : 'Light'}</Badge>
          <ThemeToggle />
        </div>
      </Surface>
    </SpecimenStage>
  );
}

function CnSpecimen() {
  const [emphasized, setEmphasized] = useState(false);
  const [wide, setWide] = useState(false);
  const [roundOverride, setRoundOverride] = useState(false);
  const mergedClasses = cn(
    'rounded-md border border-border bg-surface px-4 py-3 text-sm text-text2',
    emphasized && 'border-red-border bg-error-surface text-error',
    wide ? 'w-full' : 'w-fit',
    roundOverride && 'rounded-full px-7'
  );

  return (
    <SpecimenStage>
      <div className={mergedClasses}>Merged class output</div>
      <div className="flex flex-wrap gap-2">
        <Button variant={emphasized ? 'filter-active' : 'filter'} size="sm" onClick={() => setEmphasized((value) => !value)}>
          Semantic tone
        </Button>
        <Button variant={wide ? 'filter-active' : 'filter'} size="sm" onClick={() => setWide((value) => !value)}>
          Full width
        </Button>
        <Button variant={roundOverride ? 'filter-active' : 'filter'} size="sm" onClick={() => setRoundOverride((value) => !value)}>
          Radius override
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-md border border-border bg-bg p-4 text-xs leading-relaxed text-text3">
        <code>{mergedClasses}</code>
      </pre>
    </SpecimenStage>
  );
}

function MotionHelpersSpecimen() {
  const [replay, setReplay] = useState(0);
  const timing = [
    ['Fast', motionDuration.fast],
    ['Base', motionDuration.base],
    ['Reveal', motionDuration.reveal],
  ] as const;

  return (
    <SpecimenStage>
      <div className="grid gap-3 sm:grid-cols-3">
        {timing.map(([label, duration], index) => (
          <motion.div
            key={`${replay}-${label}`}
            {...fadeUpMotion(staggerDelay(index, 0.08), motionOffset.sm, duration)}
            className={surfaceStyles({ variant: index === 1 ? 'accent' : 'muted', padding: 'sm' })}
          >
            <Sparkles className="h-4 w-4 text-red" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-text">{label}</p>
            <p className="mt-1 font-mono text-xs text-text3">{duration}s</p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => setReplay((value) => value + 1)}>
          <RefreshCw className={iconClass} aria-hidden="true" />
          Replay entrance
        </Button>
        <motion.button
          type="button"
          {...subtleHoverMotion()}
          className={buttonStyles({ variant: 'filter', size: 'sm' })}
        >
          Subtle hover
        </motion.button>
        <motion.button
          type="button"
          {...borderHoverMotion()}
          className={buttonStyles({ variant: 'filter', size: 'sm' })}
        >
          Border hover
        </motion.button>
      </div>
      <p className="text-xs text-text3">
        Shared easing: {Array.isArray(motionEase.standard) ? motionEase.standard.join(', ') : motionEase.standard}
      </p>
    </SpecimenStage>
  );
}

function UnknownSpecimen({ componentId }: { componentId: string }) {
  return (
    <Notice title="Specimen unavailable">
      No live specimen is registered for <code className="font-mono text-xs">{componentId}</code>.
    </Notice>
  );
}

/**
 * Renders the real, stateful design-system specimen associated with a component
 * documentation id. Each branch is isolated so only the selected specimen mounts.
 */
export function ComponentLiveSpecimen({ componentId }: { componentId: string }) {
  switch (componentId) {
    case 'button':
      return <ButtonSpecimen />;
    case 'badge':
      return <BadgeSpecimen />;
    case 'surface':
      return <SurfaceSpecimen />;
    case 'notice':
      return <NoticeSpecimen />;
    case 'skeleton':
      return <SkeletonSpecimen />;
    case 'empty-state':
      return <EmptyStateSpecimen />;
    case 'error-report':
      return <ErrorReportSpecimen />;
    case 'field':
      return <FieldSpecimen />;
    case 'checkbox':
      return <CheckboxSpecimen />;
    case 'radio-group':
      return <RadioGroupSpecimen />;
    case 'toggle':
      return <ToggleSpecimen />;
    case 'slider':
      return <SliderSpecimen />;
    case 'dropdown':
      return <DropdownSpecimen />;
    case 'tabs':
      return <TabsSpecimen />;
    case 'dialog':
      return <DialogSpecimen />;
    case 'modal':
      return <ModalSpecimen />;
    case 'confirm-dialog':
      return <ConfirmDialogSpecimen />;
    case 'tooltip':
      return <TooltipSpecimen />;
    case 'themed-hero-image':
      return <ThemedHeroImageSpecimen />;
    case 'theme':
      return <ThemeSpecimen />;
    case 'cn':
      return <CnSpecimen />;
    case 'motion-helpers':
      return <MotionHelpersSpecimen />;
    default:
      return <UnknownSpecimen componentId={componentId} />;
  }
}
