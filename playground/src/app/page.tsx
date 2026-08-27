'use client';

import DSPageShell from '@/components/design-system/DSPageShell';
import PlaygroundHeader from '@/components/PlaygroundHeader';

export default function PlaygroundHome() {
  return (
    <>
      <PlaygroundHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-bg">
        <DSPageShell />
      </main>
    </>
  );
}
