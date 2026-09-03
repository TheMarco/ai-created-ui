'use client';

import { useCallback, useState } from 'react';
import DSSidebar, { foundationSections } from './DSSidebar';
import TokensSection from './sections/TokensSection';
import ColorSection from './sections/ColorSection';
import TypographySection from './sections/TypographySection';
import SpacingLayoutSection from './sections/SpacingLayoutSection';
import AnimationSection from './sections/AnimationSection';
import ThemeSection from './sections/ThemeSection';

interface FoundationsShellProps {
  cssVariables: number;
}

/**
 * The section rail is pinned in pixels so growing the root font size reflows the
 * section labels instead of squeezing the documentation column.
 */
export default function FoundationsShell({ cssVariables }: FoundationsShellProps) {
  const [activeSection, setActiveSection] = useState(foundationSections[0].id);
  const activeIndex = Math.max(
    foundationSections.findIndex((section) => section.id === activeSection),
    0,
  );
  const progress = ((activeIndex + 1) / foundationSections.length) * 100;

  const handleInView = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <div
      className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-[80px]"
      data-visual="foundations-content"
    >
      <aside className="hidden min-w-0 lg:block" data-visual="foundations-sidebar">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <DSSidebar
            sections={foundationSections}
            label="Foundation sections"
            activeSection={activeSection}
            activeIndex={activeIndex}
            progress={progress}
          />
        </div>
      </aside>

      <nav
        aria-label="Mobile foundation navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-lg lg:hidden"
      >
        <div className="h-px bg-border">
          <div
            className="h-full bg-action-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 pt-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text2">Jump to section</span>
          <span className="font-mono text-[10px] text-text3">
            {activeIndex + 1}/{foundationSections.length}
          </span>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-2">
          {foundationSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`shrink-0 whitespace-nowrap rounded-sm px-3 py-1.5 font-mono text-xs transition-colors ${
                activeSection === section.id
                  ? 'bg-action-primary text-on-action'
                  : 'text-text2 hover:text-text'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="min-w-0 space-y-32">
        <TokensSection cssVariables={cssVariables} onInView={handleInView} />
        <ColorSection onInView={handleInView} />
        <TypographySection onInView={handleInView} />
        <SpacingLayoutSection onInView={handleInView} />
        <AnimationSection onInView={handleInView} />
        <ThemeSection onInView={handleInView} />
      </div>
    </div>
  );
}
