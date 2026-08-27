'use client';

import { motion } from 'framer-motion';
import { motionDuration, staggerDelay } from '@ai-created/ui';

const sections = [
  { id: 'overview', label: 'Principles' },
  { id: 'product-ux', label: 'Product UX' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Layout' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'archetypes', label: 'Page Archetypes' },
  { id: 'components', label: 'Components' },
  { id: 'reference', label: 'API Reference' },
  { id: 'motion', label: 'Motion' },
  { id: 'theme', label: 'Theme Rules' },
];

interface DSSidebarProps {
  activeSection: string;
  activeIndex: number;
  progress: number;
}

export default function DSSidebar({ activeSection, activeIndex, progress }: DSSidebarProps) {
  return (
    <nav aria-label="Design system sections" className="space-y-1">
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
            className="h-full rounded-full bg-red-solid transition-[width] duration-300"
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
                ? 'border-red text-text font-medium'
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

export { sections };
