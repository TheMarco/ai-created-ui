import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuidelinePage from '@/components/design-system/GuidelinePage';
import { getGuidelineSpec, guidelineSpecs } from '@/components/design-system/principal-spec';

export function generateStaticParams() {
  return guidelineSpecs.map((spec) => ({ slug: spec.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const spec = getGuidelineSpec(slug);
  if (!spec) return {};

  return {
    title: `${spec.title} | @ai-created/ui`,
    description: spec.summary,
  };
}

export default async function GuidelineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spec = getGuidelineSpec(slug);
  if (!spec) notFound();

  return <GuidelinePage spec={spec} />;
}
