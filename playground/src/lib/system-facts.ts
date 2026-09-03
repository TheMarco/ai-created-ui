import designPolicySchema from '../../../contracts/design-policy.schema.json';
import consumerRegistry from '../../../consumers.json';
import manifest from '../../../design-system.manifest.json';
import packageJson from '../../../package.json';
import templateManifest from '../../../templates/agent/manifest.json';

/**
 * Facts derived from canonical repository sources at build time.
 *
 * Import this from server components only. The generated manifest is large and
 * must never reach the client bundle. Nothing here may be restated by hand:
 * change the owning source and this follows.
 */
export const systemFacts = {
  componentFamilies: manifest.components.length,
  publicExports: manifest.publicApi.exports.length,
  runtimeExports: manifest.publicApi.exports.filter(({ kind }) => kind === 'value').length,
  guidelineChapters: manifest.guidelines.length,
  pageTemplates: templateManifest.templates.length,
  policyRules: designPolicySchema.$defs.exception.properties.rule.enum.length,
  agentChecks: packageJson.scripts['agent:check'].split('&&').filter((step) => step.trim() !== '').length,
  blockingValidationCommands: manifest.validation.commands.length,
  cssVariables: manifest.artifacts.tokens.cssVariableCount,
  productionConsumers: consumerRegistry.consumers.length,
} as const;

export interface ProductionConsumer {
  id: string;
  name: string;
  repositoryUrl: string;
  siteUrl: string | null;
  compatibilityChecks: string[];
  currencyComparison: string;
}

export const productionConsumers: ProductionConsumer[] = consumerRegistry.consumers.map((consumer) => ({
  id: consumer.id,
  name: consumer.name,
  repositoryUrl: `https://github.com/${consumer.repository}`,
  siteUrl:
    consumer.deployment.targets.find((target) => target.verification.method === 'provider-deployment-and-http')
      ?.verification.url ?? null,
  compatibilityChecks: consumer.validation.checks.map((check) => check.command),
  currencyComparison: consumer.currency.comparison,
}));
