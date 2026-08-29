'use client';

import { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  Check,
  Inbox,
  Layers3,
  Save,
  Settings2,
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
  cn,
  fadeUpMotion,
  useTabPanelProps,
  useTheme,
} from '@ai-created/ui';
import type {
  BadgeVariant,
  ButtonSize,
  ButtonVariant,
  DialogSize,
  DropdownOption,
  ModalSize,
  NoticeVariant,
  RadioOption,
  SurfaceInteraction,
  SurfacePadding,
  SurfaceVariant,
  Tab,
  TooltipPosition,
} from '@ai-created/ui';
import type { ComponentSpecId } from '../specs';
import type { ControlValue, ControlValues } from './codegen';

interface ControlledSpecimenProps {
  componentId: ComponentSpecId;
  values: ControlValues;
  onChange: (name: string, value: ControlValue) => void;
}

const radioOptions: RadioOption<'design' | 'engineering' | 'research'>[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research' },
];

const dropdownOptions: DropdownOption<'recent' | 'name' | 'status'>[] = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
];

type PreviewTab = 'overview' | 'activity' | 'settings';

const tabs: Tab<PreviewTab>[] = [
  { key: 'overview', label: 'Overview', icon: <Layers3 className="h-4 w-4" /> },
  { key: 'activity', label: 'Activity', icon: <Archive className="h-4 w-4" /> },
  { key: 'settings', label: 'Settings', icon: <Settings2 className="h-4 w-4" /> },
];

function asString(values: ControlValues, name: string, fallback = '') {
  const value = values[name];
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(values: ControlValues, name: string, fallback = false) {
  const value = values[name];
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(values: ControlValues, name: string, fallback = 0) {
  const value = values[name];
  return typeof value === 'number' ? value : fallback;
}

export default function ControlledSpecimen({
  componentId,
  values,
  onChange,
}: ControlledSpecimenProps) {
  const fieldHintId = useId();
  const tabsId = useId();
  const [fieldValue, setFieldValue] = useState('designer@example.com');
  const { theme } = useTheme();

  const activeTab = asString(values, 'active', 'overview') as PreviewTab;
  const overviewPanel = useTabPanelProps('overview', activeTab, tabsId);
  const activityPanel = useTabPanelProps('activity', activeTab, tabsId);
  const settingsPanel = useTabPanelProps('settings', activeTab, tabsId);

  useEffect(() => {
    if (
      componentId !== 'confirm-dialog' ||
      !asBoolean(values, 'open') ||
      !asBoolean(values, 'loading')
    ) {
      return undefined;
    }

    const timeout = window.setTimeout(() => onChange('loading', false), 1600);
    return () => window.clearTimeout(timeout);
  }, [componentId, onChange, values]);

  switch (componentId) {
    case 'button': {
      const variant = asString(values, 'variant', 'primary') as ButtonVariant;
      const size = asString(values, 'size', 'md') as ButtonSize;
      const label = asString(values, 'label', 'Save changes');
      const iconOnly = variant === 'icon' || size === 'icon';
      return (
        <Button
          variant={variant}
          size={iconOnly ? 'icon' : size}
          disabled={asBoolean(values, 'disabled')}
          fullWidth={asBoolean(values, 'fullWidth')}
          aria-label={iconOnly ? label : undefined}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {iconOnly ? null : label}
        </Button>
      );
    }

    case 'badge':
      return (
        <Badge variant={asString(values, 'variant', 'default') as BadgeVariant}>
          {asString(values, 'label', 'Ready')}
        </Badge>
      );

    case 'surface': {
      const interaction = asString(values, 'interaction', 'none') as SurfaceInteraction;
      return (
        <div className={interaction === 'group' ? 'group max-w-xl' : 'max-w-xl'}>
          <Surface
            variant={asString(values, 'variant', 'default') as SurfaceVariant}
            padding={asString(values, 'padding', 'none') as SurfacePadding}
            interaction={interaction}
          >
            <div className={asString(values, 'padding', 'none') === 'none' ? 'p-5' : undefined}>
              <p className="font-medium text-text">Structured content surface</p>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                Semantic variants and spacing stay aligned with the shared token system.
              </p>
            </div>
          </Surface>
        </div>
      );
    }

    case 'notice':
      return (
        <Notice
          variant={asString(values, 'variant', 'default') as NoticeVariant}
          title={asString(values, 'title', 'Review required')}
          centered={asBoolean(values, 'centered')}
          hideIcon={asBoolean(values, 'hideIcon')}
        >
          Check the implementation details before publishing this change.
        </Notice>
      );

    case 'skeleton': {
      const shape = asString(values, 'shape', 'content');
      const width = asString(values, 'width', 'full');
      const widthClass = width === 'short' ? 'max-w-xs' : width === 'medium' ? 'max-w-lg' : 'max-w-full';
      if (shape === 'avatar') {
        return <Skeleton className="h-16 w-16 rounded-full" />;
      }
      if (shape === 'text') {
        return (
          <div className={cn('space-y-3', widthClass)} aria-label="Loading text preview">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        );
      }
      return <Skeleton className={cn('h-40 w-full', widthClass)} />;
    }

    case 'empty-state':
      return (
        <EmptyState
          icon={Inbox}
          title={asString(values, 'title', 'No projects yet')}
          description={asString(values, 'description', 'Create one to get started.')}
        >
          <Button size="sm">Create project</Button>
        </EmptyState>
      );

    case 'error-report':
      return (
        <ErrorReport
          title={asString(values, 'title', 'Something went wrong')}
          message={asString(values, 'message', 'Unable to load projects.')}
          details={asString(values, 'details', 'Request timed out.')}
          timestamp="2026-08-29T17:00:00.000Z"
        />
      );

    case 'field': {
      const control = asString(values, 'control', 'input');
      const label = asString(values, 'label', 'Email');
      const hint = asString(values, 'hint', 'We will never share it.');
      const disabled = asBoolean(values, 'disabled');
      return (
        <FieldGroup className="max-w-lg">
          <FieldLabel htmlFor="workbench-field">{label}</FieldLabel>
          {control === 'textarea' ? (
            <TextArea
              id="workbench-field"
              value={fieldValue}
              onChange={(event) => setFieldValue(event.target.value)}
              disabled={disabled}
              aria-describedby={fieldHintId}
              rows={4}
            />
          ) : (
            <TextInput
              id="workbench-field"
              value={fieldValue}
              onChange={(event) => setFieldValue(event.target.value)}
              disabled={disabled}
              aria-describedby={fieldHintId}
            />
          )}
          <FieldHint id={fieldHintId}>{hint}</FieldHint>
        </FieldGroup>
      );
    }

    case 'checkbox':
      return (
        <Checkbox
          checked={asBoolean(values, 'checked')}
          onChange={(checked) => onChange('checked', checked)}
          disabled={asBoolean(values, 'disabled')}
          label={asString(values, 'label', 'I agree')}
        />
      );

    case 'radio-group':
      return (
        <RadioGroup
          options={radioOptions}
          value={asString(values, 'value', 'design') as 'design' | 'engineering' | 'research'}
          onChange={(value) => onChange('value', value)}
          legend="Team discipline"
          disabled={asBoolean(values, 'disabled')}
          orientation={asString(values, 'orientation', 'vertical') as 'horizontal' | 'vertical'}
        />
      );

    case 'toggle':
      return (
        <Toggle
          checked={asBoolean(values, 'checked')}
          onChange={(checked) => onChange('checked', checked)}
          disabled={asBoolean(values, 'disabled')}
          label={asString(values, 'label', 'Enable notifications')}
        />
      );

    case 'slider':
      return (
        <div className="max-w-xl">
          <Slider
            label="Notification volume"
            value={asNumber(values, 'value', 50)}
            onChange={(value) => onChange('value', value)}
            showValue={asBoolean(values, 'showValue', true)}
            disabled={asBoolean(values, 'disabled')}
          />
        </div>
      );

    case 'dropdown':
      return (
        <div className="max-w-sm">
          <Dropdown
            options={dropdownOptions}
            value={asString(values, 'value', 'recent') as 'recent' | 'name' | 'status'}
            onChange={(value) => onChange('value', value)}
            disabled={asBoolean(values, 'disabled')}
            label={asString(values, 'label', 'Sort by')}
          />
        </div>
      );

    case 'tabs':
      return (
        <Surface padding="md" className="max-w-2xl">
          <Tabs
            id={tabsId}
            tabs={tabs}
            active={activeTab}
            onChange={(value) => onChange('active', value)}
            label="Project sections"
          />
          <div {...overviewPanel} className="mt-5 text-sm leading-relaxed text-text2">
            Overview keeps the essential project context in one place.
          </div>
          <div {...activityPanel} className="mt-5 text-sm leading-relaxed text-text2">
            Activity records recent decisions and implementation changes.
          </div>
          <div {...settingsPanel} className="mt-5 text-sm leading-relaxed text-text2">
            Settings define how this project behaves for collaborators.
          </div>
        </Surface>
      );

    case 'dialog': {
      const open = asBoolean(values, 'open');
      return (
        <>
          <Button onClick={() => onChange('open', true)}>Open dialog</Button>
          <Dialog
            open={open}
            onClose={() => onChange('open', false)}
            title={asString(values, 'title', 'Rename project')}
            description="Use a short name that is easy to recognize."
            size={asString(values, 'size', 'md') as DialogSize}
          >
            <p className="text-sm leading-relaxed text-text2">
              Focus is trapped while the dialog is open and returns to its trigger after dismissal.
            </p>
          </Dialog>
        </>
      );
    }

    case 'modal': {
      const open = asBoolean(values, 'open');
      return (
        <>
          <Button onClick={() => onChange('open', true)}>Open modal</Button>
          {open ? (
            <ModalOverlay
              onClose={() => onChange('open', false)}
              closeOnBackdrop={asBoolean(values, 'closeOnBackdrop', true)}
            >
              <ModalPanel size={asString(values, 'size', 'lg') as ModalSize}>
                <ModalHeader
                  heading="Create workspace"
                  description="Compose a focused workflow from the modal regions."
                  onClose={() => onChange('open', false)}
                />
                <ModalBody scroll={asBoolean(values, 'scroll', true)}>
                  <p className="text-sm leading-relaxed text-text2">
                    The panel, header, body, and footer remain independently composable.
                  </p>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-3">
                  <Button variant="secondary" size="sm" onClick={() => onChange('open', false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => onChange('open', false)}>Create</Button>
                </ModalFooter>
              </ModalPanel>
            </ModalOverlay>
          ) : null}
        </>
      );
    }

    case 'confirm-dialog': {
      const open = asBoolean(values, 'open');
      return (
        <>
          <Button variant={asBoolean(values, 'destructive', true) ? 'destructive' : 'secondary'} onClick={() => onChange('open', true)}>
            Review action
          </Button>
          <ConfirmDialog
            open={open}
            onConfirm={() => onChange('open', false)}
            onCancel={() => onChange('open', false)}
            title={asString(values, 'title', 'Delete project?')}
            description="This action removes the project from the active workspace."
            destructive={asBoolean(values, 'destructive', true)}
            loading={asBoolean(values, 'loading')}
            confirmLabel="Delete project"
            loadingLabel="Deleting..."
          />
        </>
      );
    }

    case 'tooltip':
      return (
        <div className="flex min-h-32 items-center justify-center">
          <Tooltip
            content={asString(values, 'content', 'Copy link')}
            position={asString(values, 'position', 'top') as TooltipPosition}
            delay={asNumber(values, 'delay', 300)}
          >
            <Button variant="secondary">Focus or hover</Button>
          </Tooltip>
        </div>
      );

    case 'themed-hero-image':
      return (
        <Surface className="relative min-h-72 overflow-hidden" aria-label="Theme-aware hero preview">
          <ThemedHeroImage
            darkSrc="/images/hero/designsystem-hero.png"
            lightSrc="/images/hero/designsystem-hero-light.png"
            overlay={asString(values, 'overlay', 'default') as 'default' | 'strong' | 'soft' | 'none'}
            fadeTop={asBoolean(values, 'fadeTop')}
            fadeBottom={asBoolean(values, 'fadeBottom')}
            blendLight={asBoolean(values, 'blendLight')}
          />
          <div className="relative z-10 max-w-lg p-8">
            <p className="font-heading text-2xl font-medium hero-text">Theme-aware media</p>
            <p className="mt-2 text-sm leading-relaxed hero-text-muted">
              Overlay and fade controls protect foreground contrast in both themes.
            </p>
          </div>
        </Surface>
      );

    case 'theme':
      return (
        <Surface padding="md" className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-medium text-text">Document theme</p>
            <p className="mt-1 text-sm text-text2">The active theme is {theme}.</p>
          </div>
          <ThemeToggle />
        </Surface>
      );

    case 'cn': {
      const merged = cn(
        asString(values, 'base', 'rounded-md px-4 py-3'),
        asBoolean(values, 'enabled', true) && asString(values, 'conditional', 'bg-surface2 text-text')
      );
      return (
        <div className="space-y-4">
          <div className={merged}>Merged class output</div>
          <code className="block overflow-x-auto rounded-md border border-border bg-bg p-4 font-mono text-xs text-text2">
            {merged}
          </code>
        </div>
      );
    }

    case 'motion-helpers': {
      const delay = asNumber(values, 'delay', 0);
      const offset = asNumber(values, 'offset', 20);
      const duration = asNumber(values, 'duration', 0.5);
      return (
        <motion.div
          key={`${delay}-${offset}-${duration}`}
          {...fadeUpMotion(delay, offset, duration)}
          className="max-w-md rounded-md border border-red-border bg-surface p-6"
        >
          <Check className="h-5 w-5 text-red" aria-hidden="true" />
          <p className="mt-4 font-medium text-text">Motion contract applied</p>
          <p className="mt-2 text-sm text-text2">
            Delay {delay}s, offset {offset}px, duration {duration}s.
          </p>
        </motion.div>
      );
    }
  }
}
