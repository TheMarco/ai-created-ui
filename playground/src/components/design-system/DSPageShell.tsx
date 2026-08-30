'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Braces, FileCode2, ArrowRight } from 'lucide-react';
import { ThemedHeroImage, buttonStyles, fadeUpMotion } from '@ai-created/ui';
import DSSidebar, { sections } from './DSSidebar';
import OverviewSection from './sections/OverviewSection';
import ProductPatternsSection from './sections/ProductPatternsSection';
import ColorSection from './sections/ColorSection';
import TypographySection from './sections/TypographySection';
import SpacingLayoutSection from './sections/SpacingLayoutSection';
import AccessibilitySection from './sections/AccessibilitySection';
import PageArchetypesSection from './sections/PageArchetypesSection';
import ComponentsSection from './sections/ComponentsSection';
import ComponentReferenceSection from './sections/ComponentReferenceSection';
import AnimationSection from './sections/AnimationSection';
import ThemeSection from './sections/ThemeSection';

const portalPaths = [
  {
    href: '/components',
    icon: Braces,
    title: 'Components',
    description: 'Live behavior, controls, implementation, and API contracts.',
  },
  {
    href: '/guidelines',
    icon: BookOpen,
    title: 'Principal guidelines',
    description: 'Product principles, content rules, patterns, and governance.',
  },
  {
    href: '/guidelines/assets#agent-contract',
    icon: FileCode2,
    title: 'Agent resources',
    description: 'Machine-readable manifests, prompts, policies, and templates.',
  },
] as const;

export default function DSPageShell() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === activeSection), 0);
  const progress = ((activeIndex + 1) / sections.length) * 100;

  const handleInView = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <>
      {/* Portal hero */}
      <section
        data-visual="portal-hero"
        className="relative overflow-hidden border-b border-border pt-32 sm:pt-24"
      >
        <ThemedHeroImage
          darkSrc="/images/hero/designsystem-hero.png"
          lightSrc="/images/hero/designsystem-hero-light.png"
          overlay="strong"
          priority
          fadeBottom
        />
        <div className="container-custom relative z-10">
          <div className="grid gap-14 py-12 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end lg:gap-20">
            <div className="max-w-4xl">
              <motion.p
                className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-red-accent"
                {...fadeUpMotion(0, 16, 0.5)}
              >
                @ai-created/ui · Open-source design system
              </motion.p>
              <motion.h1
                className="max-w-4xl font-display text-5xl tracking-wide hero-text md:text-7xl"
                {...fadeUpMotion(0.05, 20, 0.6)}
              >
                Design once. Build without drift.
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-base leading-relaxed hero-text-muted sm:text-lg"
                {...fadeUpMotion(0.12)}
              >
                @ai-created/ui is the open-source React design system behind AI-Created and Human, Actually. It gives humans and AI agents one source for production components, tokens, accessibility, and design rules.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                {...fadeUpMotion(0.18)}
              >
                <Link href="/components" className={buttonStyles({ size: 'lg' })}>
                  Explore components
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/guidelines"
                  className={buttonStyles({ variant: 'secondary', size: 'lg' })}
                >
                  Read the guidelines
                </Link>
              </motion.div>
            </div>

            <motion.nav
              aria-label="Design system destinations"
              className="border-l border-border pl-5 sm:pl-8"
              {...fadeUpMotion(0.2)}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-text3">
                Enter by responsibility
              </p>
              <div className="mt-4 border-b border-border">
                {portalPaths.map(({ href, icon: Icon, title, description }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 border-t border-border py-5 transition-colors hover:text-red-accent"
                  >
                    <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 text-text3 transition-colors group-hover:text-red-accent" />
                    <span>
                      <span className="block text-sm font-medium text-text transition-colors group-hover:text-red-accent">
                        {title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-text2">
                        {description}
                      </span>
                    </span>
                    <ArrowRight aria-hidden="true" className="mt-0.5 h-4 w-4 text-text3 transition-transform group-hover:translate-x-1 group-hover:text-red-accent" />
                  </Link>
                ))}
              </div>
            </motion.nav>
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
            <nav
              aria-label="Mobile section navigation"
              className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-lg lg:hidden"
            >
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
            </nav>

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
              <ComponentReferenceSection onInView={handleInView} />
              <AnimationSection onInView={handleInView} />
              <ThemeSection onInView={handleInView} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
