import OverviewShell from '@/components/design-system/OverviewShell';
import PlaygroundHeader from '@/components/PlaygroundHeader';
import HydrationMarker from '@/components/HydrationMarker';
import LegacyHashRedirect from '@/components/LegacyHashRedirect';

export default function PlaygroundHome() {
  return (
    <>
      <HydrationMarker />
      <LegacyHashRedirect />
      <PlaygroundHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-bg">
        <OverviewShell />
      </main>
    </>
  );
}
