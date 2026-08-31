'use client';

import { motion } from 'framer-motion';
import DSSection from '../DSSection';
import { motionDuration, staggerDelay } from '@ai-created/ui';

const pillars = [
  {
    title: 'Keyboard First',
    body: 'Every interactive control must be reachable, usable, and understandable without a mouse. Skip links, nav order, and visible focus are baseline requirements.',
  },
  {
    title: 'Readable Contrast',
    body: 'Text, controls, and status states must hold up in both themes. Metadata can be quieter, but navigation, form labels, and key actions cannot disappear into the background.',
  },
  {
    title: 'Reduced Motion',
    body: 'Motion is optional enhancement. Users who prefer reduced motion should still get clear hierarchy, state change, and orientation without animated dependency.',
  },
  {
    title: 'Clear Naming',
    body: 'Decorative imagery stays decorative. Interactive elements need explicit names, external-link behavior should be communicated, and live feedback should be announced.',
  },
  {
    title: 'Honest Affordances',
    body: 'If a control cannot do anything useful yet, disable it or reframe it. Accessibility includes preventing users from walking into empty or misleading UI.',
  },
];

const rules = [
  'Use one skip link target: `#main-content`.',
  'Do not remove focus rings without providing an equally visible replacement.',
  'Use `text3` for metadata only. Navigation, labels, and helper copy should usually use `text2` or `text`.',
  'Filled accent controls must use the accessible action token rather than a brighter decorative accent.',
  'Disable or replace dead-end actions when the destination has no useful content yet.',
  'Workflow tabs and support utilities should stay semantically distinct rather than sharing one tablist by convenience.',
  'Treat decorative icons and hero images as decorative with empty alt text and `aria-hidden` where appropriate.',
  'Announce changing UI states with `role="status"`, `aria-live`, or `role="alert"` when the user needs confirmation.',
  'Respect `prefers-reduced-motion`. Motion should never gate comprehension.',
];

const focusSpec = {
  selector: 'a, button, input, textarea, select, summary, [tabindex]:not([tabindex="-1"])',
  outline: '2px solid var(--color-focus)',
  offset: '3px',
  trigger: 'focus-visible (not focus)',
  selection: '::selection uses rgba(255, 75, 43, 0.22)',
};

const ariaPatterns = [
  { pattern: 'aria-current="page"', usage: 'Active nav links' },
  { pattern: 'aria-expanded', usage: 'Hamburger menu toggle' },
  { pattern: 'aria-controls', usage: 'Buttons linked to controlled panels' },
  { pattern: 'aria-pressed', usage: 'Toggle filter buttons' },
  { pattern: 'disabled / aria-disabled', usage: 'Unavailable actions with explanatory copy' },
  { pattern: 'aria-busy', usage: 'Forms during submission' },
  { pattern: 'aria-live="polite"', usage: 'Non-error status updates' },
  { pattern: 'role="alert"', usage: 'Error messages' },
  { pattern: 'role="dialog" + aria-modal', usage: 'Modal overlays' },
  { pattern: 'aria-labelledby', usage: 'Sections linked to headings' },
  { pattern: 'aria-hidden="true"', usage: 'Decorative SVGs and images' },
  { pattern: 'sr-only', usage: 'Screen-reader-only text labels' },
];

const keyboardPatterns = [
  { key: 'Escape', behavior: 'Closes modals (exits fullscreen first), closes mobile menu' },
  { key: 'F', behavior: 'Toggles fullscreen in video modal' },
  { key: 'Tab', behavior: 'Focus trap in modals, natural flow elsewhere' },
  { key: 'Enter', behavior: 'Form submission, button activation' },
];

const elementMatrix = [
  {
    element: 'Color',
    rule: 'Text hierarchy carries semantic weight. `text3` is metadata only, focus uses a dedicated accent token, and filled red controls use the darker solid token so white text remains compliant in both themes.',
  },
  {
    element: 'Typography',
    rule: 'Body and UI text stay readable at the system scale, headings stay semantic, and serif never becomes a legibility tax in dense interfaces.',
  },
  {
    element: 'Layout',
    rule: 'Every page exposes `#main-content`, keeps logical source order, and uses real landmarks and headings before visual flourishes.',
  },
  {
    element: 'Page Archetypes',
    rule: 'Home, browse, detail, context, and workspace pages each carry distinct accessibility expectations: skip targets, browse feedback, breadcrumbs, honest empty states, and clear onward paths.',
  },
  {
    element: 'Components',
    rule: 'Cards, filters, forms, badges, media controls, and navigation all need keyboard support, visible focus, explicit names, honest disabled states, and clear utility-versus-workflow semantics.',
  },
  {
    element: 'Motion',
    rule: 'Motion may clarify hierarchy or state, but reduced-motion users must still understand the interface without animation.',
  },
  {
    element: 'Theme',
    rule: 'Dark and light modes are equally real. A component fails the system if focus, contrast, or affordance breaks in either theme.',
  },
];

interface AccessibilitySectionProps {
  onInView?: (id: string) => void;
}

export default function AccessibilitySection({ onInView }: AccessibilitySectionProps) {
  return (
    <DSSection
      id="accessibility"
      title="Accessibility"
      subtitle="Accessibility is part of the system contract. The site should feel refined without asking users to trade off clarity, control, or comfort."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            className="bg-surface border border-border rounded-md p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: motionDuration.base + 0.1, delay: staggerDelay(index, 0.08) }}
          >
            <h3 className="text-lg font-heading font-medium text-text mb-3">
              {pillar.title}
            </h3>
            <p className="text-sm text-text2 leading-relaxed">
              {pillar.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-md p-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text3 block mb-4">
          Release Checklist
        </span>
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-sm text-text2 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Focus Strategy */}
      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Focus Strategy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Trigger</span>
            <span className="text-sm text-text2">{focusSpec.trigger}</span>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Outline</span>
            <code className="text-xs font-mono text-text2">{focusSpec.outline}</code>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Offset</span>
            <code className="text-xs font-mono text-text2">outline-offset: {focusSpec.offset}</code>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Selection</span>
            <code className="text-xs font-mono text-text2">{focusSpec.selection}</code>
          </div>
        </div>
        <p className="text-xs font-mono text-text3">
          Applies to: {focusSpec.selector}
        </p>
      </div>

      {/* ARIA Patterns */}
      <div className="mt-12 border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-[180px_1fr] bg-surface border-b border-border text-[10px] font-mono uppercase tracking-[0.18em] text-text3">
          <div className="px-4 py-3">Pattern</div>
          <div className="px-4 py-3">Usage</div>
        </div>
        {ariaPatterns.map((row, index) => (
          <div
            key={row.pattern}
            className={`grid grid-cols-[180px_1fr] ${index < ariaPatterns.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="px-4 py-3 text-xs font-mono text-text">
              {row.pattern}
            </div>
            <div className="px-4 py-3 text-sm text-text2">
              {row.usage}
            </div>
          </div>
        ))}
      </div>

      {/* Keyboard Patterns */}
      <div className="mt-12 border border-border rounded-md overflow-hidden">
        <div className="bg-surface border-b border-border px-4 py-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text3">Keyboard Patterns</span>
        </div>
        {keyboardPatterns.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-center gap-4 px-4 py-3 ${index < keyboardPatterns.length - 1 ? 'border-b border-border' : ''}`}
          >
            <kbd className="inline-flex items-center px-2.5 py-1 border border-border-strong rounded-sm text-xs font-mono text-text shrink-0">
              {row.key}
            </kbd>
            <span className="text-sm text-text2">{row.behavior}</span>
          </div>
        ))}
      </div>

      {/* Element Matrix */}
      <div className="mt-12 border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-[140px_1fr] bg-surface border-b border-border text-[10px] font-mono uppercase tracking-[0.18em] text-text3">
          <div className="px-4 py-3">Element</div>
          <div className="px-4 py-3">Accessibility Contract</div>
        </div>
        {elementMatrix.map((row, index) => (
          <div
            key={row.element}
            className={`grid grid-cols-[140px_1fr] ${index < elementMatrix.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="px-4 py-4 text-sm font-heading text-text">
              {row.element}
            </div>
            <div className="px-4 py-4 text-sm text-text2 leading-relaxed">
              {row.rule}
            </div>
          </div>
        ))}
      </div>
    </DSSection>
  );
}
