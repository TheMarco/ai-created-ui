import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import Button from '../../src/components/Button';
import Checkbox from '../../src/components/Checkbox';
import ConfirmDialog from '../../src/components/ConfirmDialog';
import Dialog from '../../src/components/Dialog';
import Dropdown from '../../src/components/Dropdown';
import { FieldGroup, FieldHint, FieldLabel, TextArea, TextInput } from '../../src/components/Field';
import RadioGroup from '../../src/components/RadioGroup';
import Slider from '../../src/components/Slider';
import Tabs, { useTabPanelProps } from '../../src/components/Tabs';
import Toggle from '../../src/components/Toggle';
import Tooltip from '../../src/components/Tooltip';

async function expectNoViolations(element: Element) {
  const results = await axe(element, {
    rules: {
      // jsdom does not implement canvas layout, so contrast remains a manual/browser check.
      'color-contrast': { enabled: false },
      // Landmark structure belongs to the page, not isolated component fixtures.
      region: { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}

describe('interactive component accessibility', () => {
  it('validates native action and form controls', async () => {
    const { container } = render(
      <main>
        <Button>Save changes</Button>
        <Checkbox checked={false} onChange={vi.fn()} label="Email updates" />
        <Toggle checked={false} onChange={vi.fn()} label="Public profile" />
        <RadioGroup
          legend="Digest frequency"
          value="daily"
          onChange={vi.fn()}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
        <Slider label="Confidence" value={40} onChange={vi.fn()} />
        <FieldGroup>
          <FieldLabel htmlFor="project-name">Project name</FieldLabel>
          <TextInput id="project-name" />
        </FieldGroup>
      </main>
    );

    await expectNoViolations(container);
  });

  it('validates described invalid, textarea, and disabled FieldGroup states', async () => {
    const { container } = render(
      <main>
        <FieldGroup>
          <FieldLabel htmlFor="release-notes">Release notes</FieldLabel>
          <TextArea
            id="release-notes"
            aria-invalid="true"
            aria-describedby="release-notes-error"
          />
          <FieldHint id="release-notes-error" role="alert">
            Add release notes before publishing.
          </FieldHint>
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="release-channel">Release channel</FieldLabel>
          <TextInput id="release-channel" value="Stable" disabled readOnly />
        </FieldGroup>
      </main>
    );

    expect(screen.getByRole('textbox', { name: 'Release notes' })).toHaveAccessibleDescription(
      'Add release notes before publishing.'
    );
    expect(screen.getByRole('textbox', { name: 'Release channel' })).toBeDisabled();
    await expectNoViolations(container);
  });

  it('validates tabs and their emitted relationships', async () => {
    function TabsHarness() {
      const tabsId = 'project-sections';
      const overviewPanel = useTabPanelProps('overview', 'overview', tabsId);
      const activityPanel = useTabPanelProps('activity', 'overview', tabsId);

      return (
        <>
          <Tabs
            id={tabsId}
            label="Project sections"
            active="overview"
            onChange={vi.fn()}
            tabs={[
              { key: 'overview', label: 'Overview' },
              { key: 'activity', label: 'Activity' },
            ]}
          />
          <div {...overviewPanel}>Overview panel</div>
          <div {...activityPanel}>Activity panel</div>
        </>
      );
    }

    const { container } = render(<TabsHarness />);

    await expectNoViolations(container);
  });

  it('validates the dropdown in its expanded state', async () => {
    const user = userEvent.setup();

    function DropdownHarness() {
      const [value, setValue] = useState('alpha');
      return (
        <Dropdown
          label="Project"
          value={value}
          onChange={setValue}
          options={[
            { value: 'alpha', label: 'Alpha' },
            { value: 'beta', label: 'Beta' },
          ]}
        />
      );
    }

    render(<DropdownHarness />);
    await user.click(screen.getByRole('button', { name: /Project/ }));
    await expectNoViolations(document.body);
  });

  it('validates the dialog in its open state', async () => {
    render(
      <Dialog open onClose={vi.fn()} title="Delete project?" description="This cannot be undone.">
        <Button>Confirm deletion</Button>
      </Dialog>
    );

    await screen.findByRole('dialog', { name: 'Delete project?' });
    await expectNoViolations(document.body);
  });

  it('validates the confirmation dialog in its open state', async () => {
    render(
      <ConfirmDialog
        open
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete project?"
        description="This cannot be undone."
      />
    );

    await screen.findByText('Delete project?');
    await expectNoViolations(document.body);
  });

  it('validates the tooltip in its focus-visible state', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copies the share link" delay={0}>
        <button type="button">Copy link</button>
      </Tooltip>
    );

    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveAttribute(
      'aria-describedby',
      tooltip.id
    );
    await expectNoViolations(document.body);
  });
});
