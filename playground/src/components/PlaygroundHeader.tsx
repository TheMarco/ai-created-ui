'use client';

import Link from 'next/link';
import { ThemeToggle } from '@ai-created/ui';
import AccentPicker from './AccentPicker';

const documentationLinks = [
  { href: '/', label: 'Foundations' },
  { href: '/components', label: 'Components' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/guidelines/assets#agent-contract', label: 'Agents' },
] as const;

export default function PlaygroundHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          href="/"
          className="whitespace-nowrap font-heading text-base tracking-tight text-text transition-colors hover:text-text2 sm:text-lg"
        >
          @ai-created/ui
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary documentation" className="hidden items-center gap-1 sm:flex">
            {documentationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm text-text2 transition-colors hover:bg-surface2 hover:text-text"
              >
                {label}
              </Link>
            ))}
          </nav>
          <a
            href="https://www.ai-created.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap text-xs text-text2 transition-colors hover:text-text md:block md:text-sm"
          >
            ai-created.com
          </a>
          <AccentPicker compact />
          <ThemeToggle />
        </div>
      </div>
      <nav
        aria-label="Mobile documentation"
        className="container-custom flex h-11 items-center justify-between gap-0 overflow-x-auto border-t border-border sm:hidden"
      >
        {documentationLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 rounded-md px-2 py-2 text-[11px] text-text2 transition-colors hover:bg-surface2 hover:text-text"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
