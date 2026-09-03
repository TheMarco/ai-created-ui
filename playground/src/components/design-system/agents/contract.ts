/**
 * Canonical counts surfaced by the /agents page.
 *
 * Every value here is verified against its owning source by
 * `npm run docs:check` (scripts/verify-documentation-contract.mjs).
 * Update the owning source first, then this file, never the reverse.
 */
export const agentContractFacts = {
  /** package.json version. */
  packageVersion: '1.3.5',
  /** design-system.manifest.json components. */
  componentFamilies: 22,
  /** design-system.manifest.json publicApi.exports. */
  publicExports: 96,
  /** design-system.manifest.json guidelines. */
  guidelineChapters: 7,
  /** templates/agent/manifest.json templates. */
  pageTemplates: 6,
  /** contracts/design-policy.schema.json exception rule enum. */
  policyRules: 6,
  /** package.json scripts["agent:check"] steps. */
  agentChecks: 8,
} as const;
