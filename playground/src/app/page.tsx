'use client';

import { useEffect } from 'react';
import DSPageShell from '@/components/design-system/DSPageShell';
import PlaygroundHeader from '@/components/PlaygroundHeader';

export default function PlaygroundHome() {
  useEffect(() => {
    document.documentElement.dataset.playgroundHydrated = 'true';

    return () => {
      delete document.documentElement.dataset.playgroundHydrated;
    };
  }, []);

  return (
    <>
      <PlaygroundHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-bg">
        <DSPageShell />
      </main>
    </>
  );
}
