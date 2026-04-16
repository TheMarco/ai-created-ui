'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DSSection from '../DSSection';
import DSComponentDemo from '../DSComponentDemo';
import { borderHoverMotion, motionDuration, motionEase, motionOffset } from '@ai-created/ui';

const motionRules = [
  {
    title: 'Entrance',
    body: 'Default to simple fade/slide reveals in the 0.45s to 0.6s range. They should clarify hierarchy, not become a visual event.',
  },
  {
    title: 'Hover',
    body: 'Use subtle lift, border emphasis, and color shifts. The public site should feel alive, not animated for its own sake.',
  },
  {
    title: 'State Change',
    body: 'The strongest motion belongs to real UI state changes such as menu open/close, theme toggles, and media interactions.',
  },
];

const avoidByDefault = [
  'Glitch, wave, shimmer, or neon treatments on core public pages.',
  'Perpetual decorative motion unless the route is explicitly an experimental surface.',
  'Large hover transforms that make cards feel unstable or playful when the rest of the system is controlled.',
];

const cssAnimations = [
  { name: 'fade-in', className: 'animate-fade-in', note: 'Default low-friction reveal for simple modules.' },
  { name: 'slide-up', className: 'animate-slide-up', note: 'Used when a little more vertical entrance helps with reading order.' },
  { name: 'scale-in', className: 'animate-scale-in', note: 'Reserved for smaller emphasis moments.' },
  { name: 'fade-in-up', className: 'animate-fade-in-up', note: 'A combined variant when elements need both movement and fade.' },
];

const accessibilityNotes = [
  'Motion must degrade cleanly under `prefers-reduced-motion`; the interface still needs clear hierarchy and state without animation.',
  'Do not rely on motion alone to explain selection, success, error, or hierarchy.',
  'Continuous motion should be rare and tied to state, never treated as ambient decoration on core routes.',
];

interface AnimationSectionProps {
  onInView?: (id: string) => void;
}

export default function AnimationSection({ onInView }: AnimationSectionProps) {
  const [keys, setKeys] = useState<Record<string, number>>({});

  const replay = (name: string) => {
    setKeys((previous) => ({ ...previous, [name]: (previous[name] || 0) + 1 }));
  };

  return (
    <DSSection
      id="motion"
      title="Motion"
      subtitle="Motion should support structure, emphasis, and state changes. If it cannot explain its purpose, it should not ship."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {motionRules.map((rule) => (
          <div key={rule.title} className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-lg font-heading font-medium text-text mb-2">
              {rule.title}
            </h3>
            <p className="text-sm text-text2 leading-relaxed">
              {rule.body}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <DSComponentDemo
          title="Allowed Patterns"
          description="These are the motion patterns that fit the public site."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-surface border border-border rounded-md p-5"
              initial={{ opacity: 0, y: motionOffset.sm }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: motionDuration.reveal }}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-2">
                Entrance
              </span>
              <p className="text-sm text-text2 leading-relaxed">
                Fade plus a small upward movement.
              </p>
            </motion.div>

            <motion.div
              className="bg-surface border border-border rounded-md p-5"
              {...borderHoverMotion(3)}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-2">
                Hover
              </span>
              <p className="text-sm text-text2 leading-relaxed">
                Small lift plus stronger border, nothing theatrical.
              </p>
            </motion.div>

            <motion.div
              className="bg-surface border border-border rounded-md p-5"
              animate={{ opacity: [0.72, 1, 0.72] }}
              transition={{ duration: motionDuration.ambient, repeat: Infinity, ease: motionEase.inOut }}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-text3 block mb-2">
                State Cue
              </span>
              <p className="text-sm text-text2 leading-relaxed">
                Reserved for actual state communication, not ambient decoration.
              </p>
            </motion.div>
          </div>
        </DSComponentDemo>

        <DSComponentDemo
          title="CSS Motion Tokens"
          description="These are the utility-level animations available to the system. Keep usage narrow and intentional."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cssAnimations.map((animation) => (
              <button
                key={animation.name}
                type="button"
                onClick={() => replay(animation.name)}
                className="bg-surface border border-border rounded-md p-5 text-left transition-colors hover:border-border-strong cursor-pointer"
              >
                <div key={keys[animation.name] || 0} className={animation.className}>
                  <span className="text-sm font-mono text-text block">{animation.name}</span>
                  <span className="text-[10px] font-mono text-text3 block mt-1">
                    {animation.note}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </DSComponentDemo>
      </div>

      <div className="mt-12">
        <DSComponentDemo
          title="Framer Motion Patterns"
          description="These are the standard Framer Motion patterns used across the site. Keep them consistent rather than inventing variations."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Entry</span>
                <code className="text-xs font-mono text-text2">{'initial={{ opacity: 0, y: 20 }}'}</code>
                <br />
                <code className="text-xs font-mono text-text2">{'whileInView={{ opacity: 1, y: 0 }}'}</code>
              </div>
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Viewport</span>
                <code className="text-xs font-mono text-text2">{'viewport={{ once: true }}'}</code>
                <br />
                <span className="text-xs text-text3">Animate once on scroll, do not repeat</span>
              </div>
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Stagger</span>
                <code className="text-xs font-mono text-text2">{'transition={{ delay: index * 0.1 }}'}</code>
                <br />
                <span className="text-xs text-text3">Sequential items in grids and lists</span>
              </div>
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Exit</span>
                <code className="text-xs font-mono text-text2">{'<AnimatePresence>'}</code>
                <br />
                <span className="text-xs text-text3">Mobile menu, theme toggle icon swap</span>
              </div>
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Card Hover</span>
                <code className="text-xs font-mono text-text2">{'whileHover={{ y: -2 }}'}</code>
                <br />
                <span className="text-xs text-text3">Subtle lift, duration 0.2s</span>
              </div>
              <div className="rounded-md border border-border bg-surface2 px-4 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Button Tap</span>
                <code className="text-xs font-mono text-text2">{'whileTap={{ scale: 0.85 }}'}</code>
                <br />
                <span className="text-xs text-text3">Toggle buttons, theme toggle</span>
              </div>
            </div>
          </div>
        </DSComponentDemo>
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Avoid By Default
        </h3>
        <ul className="space-y-2">
          {avoidByDefault.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-red mt-0.5">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Accessibility Notes
        </h3>
        <ul className="space-y-2">
          {accessibilityNotes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-red mt-0.5">-</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
