'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThemedHeroImage, fadeUpMotion } from '@ai-created/ui';
import DSSidebar, { sections } from './DSSidebar';
import OverviewSection from './sections/OverviewSection';
import ProductPatternsSection from './sections/ProductPatternsSection';
import ColorSection from './sections/ColorSection';
import TypographySection from './sections/TypographySection';
import SpacingLayoutSection from './sections/SpacingLayoutSection';
import AccessibilitySection from './sections/AccessibilitySection';
import PageArchetypesSection from './sections/PageArchetypesSection';
import ComponentsSection from './sections/ComponentsSection';
import AnimationSection from './sections/AnimationSection';
import ThemeSection from './sections/ThemeSection';

export default function DSPageShell() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === activeSection), 0);
  const progress = ((activeIndex + 1) / sections.length) * 100;

  const handleInView = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <ThemedHeroImage
          darkSrc="/images/hero/designsystem-hero.png"
          lightSrc="/images/hero/designsystem-hero-light.png"
          overlay="strong"
          priority
          fadeBottom
        />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center py-20">
            <motion.h1
              className="text-4xl md:text-7xl font-display hero-text tracking-wide mb-6"
              {...fadeUpMotion(0, 20, 0.6)}
            >
              Design System
            </motion.h1>

            <motion.p
              className="text-lg hero-text-muted leading-relaxed max-w-2xl mx-auto"
              {...fadeUpMotion(0.15)}
            >
              Canonical visual and accessibility rules for AI-Created and beyond. Now pressure-tested in production at{' '}
              <a href="https://human-actually.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Human, Actually</a>.
              Every pixel shaped with AI, grounded in a rigorous design system.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="container-custom">
          <div className="flex gap-16">
            {/* Sidebar - desktop only */}
            <aside className="hidden w-56 shrink-0 lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <DSSidebar
                  activeSection={activeSection}
                  activeIndex={activeIndex}
                  progress={progress}
                />
              </div>
            </aside>

            {/* Mobile horizontal nav */}
            <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-bg/90 backdrop-blur-lg border-t border-border">
              <div className="h-px bg-border">
                <div className="h-full bg-red-solid transition-[width] duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between px-4 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text2">
                  Jump to section
                </span>
                <span className="text-[10px] font-mono text-text3">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
              <div className="flex overflow-x-auto gap-1 px-4 py-2 no-scrollbar">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`shrink-0 px-3 py-1.5 text-xs font-mono rounded-sm transition-colors whitespace-nowrap ${
                      activeSection === s.id
                        ? 'bg-red-solid text-white'
                        : 'text-text2 hover:text-text'
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-32">
              <OverviewSection onInView={handleInView} />
              <ProductPatternsSection onInView={handleInView} />
              <ColorSection onInView={handleInView} />
              <TypographySection onInView={handleInView} />
              <SpacingLayoutSection onInView={handleInView} />
              <AccessibilitySection onInView={handleInView} />
              <PageArchetypesSection onInView={handleInView} />
              <ComponentsSection onInView={handleInView} />
              <AnimationSection onInView={handleInView} />
              <ThemeSection onInView={handleInView} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
