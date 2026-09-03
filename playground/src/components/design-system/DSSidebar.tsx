'use client';

import { motion } from 'framer-motion';
import { motionDuration, staggerDelay } from '@ai-created/ui';

export interface DSSidebarSection {
  id: string;
  label: string;
}

export const foundationSections: DSSidebarSection[] = [
  { id: 'tokens', label: 'Design tokens' },
  { id: 'colors', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & layout' },
  { id: 'motion', label: 'Motion' },
  { id: 'theme', label: 'Themes' },
];

interface DSSidebarProps {
  sections: DSSidebarSection[];
  label?: string;
  activeSection: string;
  activeIndex: number;
  progress: number;
}

export default function DSSidebar({
  sections,
  label = 'Design system sections',
  activeSection,
  activeIndex,
  progress,
}: DSSidebarProps) {
  return (
    <nav aria-label={label} className="space-y-1">
      <div className="mb-4 pl-4">
        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-text3 mb-2">
          Contents
        </span>
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text2">
            Section {activeIndex + 1} of {sections.length}
          </span>
          <span className="text-[10px] font-mono text-text3">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-surface2 overflow-hidden">
          <div
            className="h-full rounded-full bg-action-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {sections.map((section, i) => {
        const isActive = activeSection === section.id;
        return (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className={`block py-1.5 pl-4 text-sm transition-colors duration-200 border-l-2 ${
              isActive
                ? 'border-accent text-text font-medium'
                : 'border-transparent text-text2 hover:text-text'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionDuration.base, delay: staggerDelay(i, 0.04) }}
          >
            {section.label}
          </motion.a>
        );
      })}
    </nav>
  );
}
