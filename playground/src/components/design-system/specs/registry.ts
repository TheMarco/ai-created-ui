import {
  componentDocs,
  type ComponentDocEntry,
} from '../componentDocs';
import { componentSpecDetails } from './details';
import { componentConstructionSpecs, referenceScaleNote } from './construction';
import type { ComponentSpec, ComponentSpecId } from './types';

const knownIds = new Set<string>(Object.keys(componentSpecDetails));
const constructionIds = new Set<string>(Object.keys(componentConstructionSpecs));

for (const entry of componentDocs) {
  if (!knownIds.has(entry.id)) {
    throw new Error(`Missing detailed component specification for "${entry.id}".`);
  }
}

if (knownIds.size !== componentDocs.length) {
  const legacyIds = new Set(componentDocs.map((entry) => entry.id));
  const unknownIds = [...knownIds].filter((id) => !legacyIds.has(id));
  throw new Error(`Detailed component specifications contain unknown ids: ${unknownIds.join(', ')}.`);
}

if (
  constructionIds.size !== knownIds.size ||
  [...knownIds].some((id) => !constructionIds.has(id))
) {
  const missingIds = [...knownIds].filter((id) => !constructionIds.has(id));
  const unknownIds = [...constructionIds].filter((id) => !knownIds.has(id));
  throw new Error(
    `Component construction specifications are out of sync. Missing: ${missingIds.join(', ') || 'none'}. Unknown: ${unknownIds.join(', ') || 'none'}.`
  );
}

/**
 * Complete registry. Entries retain every legacy ComponentDocEntry field, so
 * they can be passed directly to the original reference renderer.
 */
export const componentSpecs: ComponentSpec[] = componentDocs.map((entry) => {
  const id = entry.id as ComponentSpecId;
  const details = componentSpecDetails[id];
  const construction = componentConstructionSpecs[id];
  return {
    ...entry,
    id,
    ...details,
    visualSpec: details.visualSpec
      ? { ...details.visualSpec, rules: [...details.visualSpec.rules, referenceScaleNote] }
      : details.visualSpec,
    construction,
  };
});

export const componentSpecById = Object.fromEntries(
  componentSpecs.map((spec) => [spec.id, spec])
) as Record<ComponentSpecId, ComponentSpec>;

export const componentSpecCategories = Array.from(
  new Set(componentSpecs.map((spec) => spec.category))
) as ComponentDocEntry['category'][];

/** Ordered category groups suitable for Object.entries in sidebar rendering. */
export const componentSpecGroups = Object.fromEntries(
  componentSpecCategories.map((category) => [
    category,
    componentSpecs.filter((spec) => spec.category === category),
  ])
) as Record<ComponentDocEntry['category'], ComponentSpec[]>;

export function isComponentSpecId(value: string): value is ComponentSpecId {
  return knownIds.has(value);
}

/** Finds an entry by stable id or route slug. */
export function getComponentSpec(value: string): ComponentSpec | undefined {
  if (isComponentSpecId(value)) return componentSpecById[value];
  return componentSpecs.find((spec) => spec.slug === value);
}

export function getComponentSpecsByCategory(
  category: ComponentDocEntry['category']
): ComponentSpec[] {
  return componentSpecGroups[category];
}

/** Explicit compatibility alias for consumers that still expect the legacy shape. */
export const legacyComponentDocs: ComponentDocEntry[] = componentDocs;
