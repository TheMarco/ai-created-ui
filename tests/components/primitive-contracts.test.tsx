import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from '../../src/components/Badge';
import EmptyState from '../../src/components/EmptyState';
import {
  FieldGroup,
  FieldHint,
  FieldLabel,
  FieldLegend,
  TextArea,
  TextInput,
} from '../../src/components/Field';
import Notice from '../../src/components/Notice';
import Skeleton from '../../src/components/Skeleton';
import Surface from '../../src/components/Surface';

describe('content primitive contracts', () => {
  it('forwards native attributes and refs through content roots', () => {
    const badgeRef = createRef<HTMLSpanElement>();
    const surfaceRef = createRef<HTMLDivElement>();
    const noticeRef = createRef<HTMLDivElement>();
    const skeletonRef = createRef<HTMLDivElement>();
    const emptyStateRef = createRef<HTMLDivElement>();

    render(
      <>
        <Badge ref={badgeRef} data-testid="badge">Ready</Badge>
        <Surface ref={surfaceRef} data-testid="surface">Panel</Surface>
        <Notice ref={noticeRef} data-testid="notice">Saved</Notice>
        <Skeleton ref={skeletonRef} data-testid="skeleton" />
        <EmptyState ref={emptyStateRef} data-testid="empty" title="No projects" />
      </>
    );

    expect(badgeRef.current).toBe(screen.getByTestId('badge'));
    expect(surfaceRef.current).toBe(screen.getByTestId('surface'));
    expect(noticeRef.current).toBe(screen.getByTestId('notice'));
    expect(skeletonRef.current).toBe(screen.getByTestId('skeleton'));
    expect(emptyStateRef.current).toBe(screen.getByTestId('empty'));
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('preserves native field associations, attributes, and refs', () => {
    const groupRef = createRef<HTMLDivElement>();
    const labelRef = createRef<HTMLLabelElement>();
    const legendRef = createRef<HTMLSpanElement>();
    const hintRef = createRef<HTMLParagraphElement>();
    const inputRef = createRef<HTMLInputElement>();
    const areaRef = createRef<HTMLTextAreaElement>();

    render(
      <FieldGroup ref={groupRef} data-testid="group">
        <FieldLegend ref={legendRef}>Project details</FieldLegend>
        <FieldLabel ref={labelRef} htmlFor="project-name">Project name</FieldLabel>
        <TextInput
          ref={inputRef}
          id="project-name"
          name="projectName"
          aria-describedby="project-hint"
        />
        <FieldHint ref={hintRef} id="project-hint">Use a recognizable name.</FieldHint>
        <FieldLabel htmlFor="project-notes">Notes</FieldLabel>
        <TextArea ref={areaRef} id="project-notes" />
      </FieldGroup>
    );

    expect(groupRef.current).toBe(screen.getByTestId('group'));
    expect(labelRef.current).toBe(screen.getByText('Project name'));
    expect(legendRef.current).toBe(screen.getByText('Project details'));
    expect(hintRef.current).toBe(screen.getByText('Use a recognizable name.'));
    expect(inputRef.current).toBe(screen.getByRole('textbox', { name: 'Project name' }));
    expect(inputRef.current).toHaveAccessibleDescription('Use a recognizable name.');
    expect(inputRef.current).toHaveAttribute('name', 'projectName');
    expect(areaRef.current).toBe(screen.getByRole('textbox', { name: 'Notes' }));
  });
});
