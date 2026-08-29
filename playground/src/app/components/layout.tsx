import PlaygroundHeader from '@/components/PlaygroundHeader';

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlaygroundHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-bg pt-28 sm:pt-16">
        {children}
      </main>
    </>
  );
}
