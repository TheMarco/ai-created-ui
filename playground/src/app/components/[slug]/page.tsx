import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ComponentSpecPage from '@/components/design-system/ComponentSpecPage';
import {
  componentSpecGroups,
  componentSpecs,
  getComponentSpec,
} from '@/components/design-system/specs';

export function generateStaticParams() {
  return componentSpecs.map((spec) => ({ slug: spec.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getComponentSpec(slug);

  if (!spec) return {};

  return {
    title: `${spec.name} | @ai-created/ui`,
    description: spec.summary,
  };
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getComponentSpec(slug);

  if (!spec) notFound();

  return <ComponentSpecPage spec={spec} groups={Object.entries(componentSpecGroups)} />;
}
