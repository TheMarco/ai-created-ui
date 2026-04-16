'use client';

import Link from 'next/link';
import { ThemeToggle } from '@ai-created/ui';

export default function PlaygroundHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-lg tracking-tight text-text hover:text-text2 transition-colors"
        >
          @ai-created/ui
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://www.ai-created.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text2 hover:text-text transition-colors"
          >
            ai-created.com
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
