'use client';

import { useState } from 'react';
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
  FieldLegend,
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
  accentNames,
  borderHoverMotion,
  buttonStyles,
  cn,
  fadeUpMotion,
  fieldGroupStyles,
  fieldHintStyles,
  fieldLabelStyles,
  fieldLegendStyles,
  inViewFadeUpMotion,
  inputStyles,
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
  Accent,
  BadgeProps,
  ButtonProps,
  CheckboxProps,
  ConfirmDialogProps,
  DialogProps,
  DropdownProps,
  EmptyStateProps,
  ErrorReportProps,
  FieldGroupProps,
  FieldHintProps,
  FieldLabelProps,
  FieldLegendProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalPanelProps,
  NoticeProps,
  RadioGroupProps,
  SkeletonProps,
  SliderProps,
  SurfaceProps,
  Tab,
  TabsProps,
  TextAreaProps,
  TextInputProps,
  ThemedHeroImageProps,
  Theme,
  ThemeContextValue,
  ThemeProviderProps,
  ToggleProps,
  TooltipProps,
} from '@ai-created/ui';

export type PublicPropsContract = [
  Accent,
  BadgeProps,
  ButtonProps,
  CheckboxProps,
  ConfirmDialogProps,
  DialogProps,
  DropdownProps,
  EmptyStateProps,
  ErrorReportProps,
  FieldGroupProps,
  FieldHintProps,
  FieldLabelProps,
  FieldLegendProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalPanelProps,
  NoticeProps,
  RadioGroupProps,
  SkeletonProps,
  SliderProps,
  SurfaceProps,
  Tab,
  TabsProps<'overview' | 'activity'>,
  TextAreaProps,
  TextInputProps,
  ThemedHeroImageProps,
  Theme,
  ThemeContextValue,
  ThemeProviderProps,
  ToggleProps,
  TooltipProps
];

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'activity', label: 'Activity' },
] satisfies Array<Tab<'overview' | 'activity'>>;

const options = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const publicStyleContract = [
  buttonStyles(),
  surfaceStyles(),
  fieldGroupStyles(),
  fieldHintStyles(),
  fieldLabelStyles(),
  fieldLegendStyles(),
  inputStyles(),
  cn('text-text', undefined, null),
  motionDuration.fast,
  motionEase.out,
  motionOffset.sm,
  staggerDelay(1),
  fadeUpMotion,
  inViewFadeUpMotion,
  subtleHoverMotion,
  borderHoverMotion,
];

export default function PublicContractFixture() {
  const [checked, setChecked] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [sliderValue, setSliderValue] = useState(40);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
  const { accent, setAccent, theme } = useTheme();
  const overviewPanel = useTabPanelProps('overview', activeTab, 'fixture-tabs');
  const activityPanel = useTabPanelProps('activity', activeTab, 'fixture-tabs');
  const showPrimitiveModal = false;

  return (
    <main
      className="min-h-screen bg-bg px-5 py-10 text-text md:px-8"
      data-contract={String(publicStyleContract.length)}
      data-accent={accent}
      data-theme={theme}
    >
      <div className="mx-auto max-w-8xl space-y-8">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <Badge variant="info">Consumer fixture</Badge>
            <h1 className="mt-3 font-heading text-3xl text-text">Public package contract</h1>
          </div>
          <div className="flex items-center gap-2">
            <label>
              <span className="sr-only">Accent color</span>
              <select
                aria-label="Accent color"
                className="h-11 rounded-md border border-control-border bg-surface px-3 text-sm text-text"
                value={accent}
                onChange={(event) => setAccent(event.target.value as Accent)}
              >
                {accentNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <ThemeToggle />
          </div>
        </header>

        <Notice variant="success" title="Token CSS loaded">All examples use semantic utilities from the shared preset.</Notice>

        <Surface padding="lg" className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Tooltip content="A secondary action"><Button variant="secondary">More information</Button></Tooltip>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="fixture-name">Name</FieldLabel>
            <TextInput id="fixture-name" defaultValue="Example workspace" />
            <FieldHint>Use a durable workspace name.</FieldHint>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel htmlFor="fixture-description">Description</FieldLabel>
            <TextArea id="fixture-description" rows={3} defaultValue="A clean consumer integration." />
          </FieldGroup>
          <FieldLegend>Preferences</FieldLegend>
          <Checkbox checked={checked} onChange={setChecked} label="Email updates" />
          <Toggle checked={checked} onChange={setChecked} label="Public profile" />
          <RadioGroup options={options} value={frequency} onChange={setFrequency} legend="Digest frequency" />
          <Dropdown options={options} value={frequency} onChange={setFrequency} label="Notification schedule" />
          <Slider value={sliderValue} onChange={setSliderValue} label="Weekly target" />
        </Surface>

        <Surface padding="none">
          <Tabs id="fixture-tabs" tabs={tabs} active={activeTab} onChange={setActiveTab} label="Fixture sections" />
          <div {...overviewPanel} className="p-6"><p className="text-sm text-text2">Overview panel</p></div>
          <div {...activityPanel} className="p-6"><p className="text-sm text-text2">Activity panel</p></div>
        </Surface>

        <div className="grid gap-6 md:grid-cols-2">
          <EmptyState title="No records" description="Create the first record to continue." />
          <ErrorReport message="Example recoverable error" details="Fixture diagnostic" />
        </div>

        <Surface padding="lg" aria-label="Loading example" className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </Surface>

        <div className="relative h-48 overflow-hidden rounded-md border border-border">
          <ThemedHeroImage darkSrc="/fixture-dark.png" lightSrc="/fixture-light.png" overlay="soft" />
        </div>

        <Dialog open={false} onClose={() => undefined} title="Dialog fixture">Dialog body</Dialog>
        <ConfirmDialog open={false} onConfirm={() => undefined} onCancel={() => undefined} title="Confirm fixture" />
        {showPrimitiveModal ? (
          <ModalOverlay onClose={() => undefined}>
            <ModalPanel>
              <ModalHeader heading="Primitive modal" onClose={() => undefined} />
              <ModalBody>Modal body</ModalBody>
              <ModalFooter><Button variant="secondary">Close</Button></ModalFooter>
            </ModalPanel>
          </ModalOverlay>
        ) : null}
      </div>
    </main>
  );
}
