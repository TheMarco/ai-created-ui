import type { ComponentDocEntry } from '../componentDocs';

export type ComponentSpecId =
  | 'button'
  | 'badge'
  | 'surface'
  | 'notice'
  | 'skeleton'
  | 'empty-state'
  | 'error-report'
  | 'field'
  | 'checkbox'
  | 'radio-group'
  | 'toggle'
  | 'slider'
  | 'dropdown'
  | 'tabs'
  | 'dialog'
  | 'modal'
  | 'confirm-dialog'
  | 'tooltip'
  | 'themed-hero-image'
  | 'theme'
  | 'cn'
  | 'motion-helpers';

export interface AnatomyPart {
  name: string;
  description: string;
  required: boolean;
  semanticElement?: string;
}

export interface VisualMeasurement {
  property: string;
  value: string;
  notes?: string;
}

export interface VisualSpecification {
  measurements: VisualMeasurement[];
  rules: string[];
  responsiveBehavior?: string[];
}

export interface DesignTokenUsage {
  token: string;
  purpose: string;
}

export interface StateDefinition {
  name: string;
  trigger: string;
  visual: string;
  behavior: string;
  accessibility?: string;
}

export interface KeyboardInteraction {
  key: string;
  action: string;
  condition?: string;
}

export interface AccessibilitySpecification {
  semantics: string;
  accessibleName: string;
  requirements: string[];
  announcements?: string[];
}

export interface ImplementationRecipe {
  name: string;
  description: string;
  code: string;
}

export interface ImplementationSpecification {
  importStatement: string;
  clientComponent: boolean;
  notes: string[];
  recipes?: ImplementationRecipe[];
}

export interface UsageGuidance {
  dos: string[];
  donts: string[];
}

export interface TestingContract {
  unit: string[];
  interaction: string[];
  accessibility: string[];
  visual: string[];
}

export type DesignAssetKind = 'component' | 'provider' | 'utility' | 'helper';

export type AutoLayoutDirection = 'horizontal' | 'vertical' | 'overlay' | 'none';

export interface AutoLayoutContract {
  applicable: boolean;
  direction: AutoLayoutDirection;
  gap: string;
  padding: string;
  alignment: string;
  wrap: string;
  notes: string[];
}

export type ResizingMode = 'hug' | 'fill' | 'fixed' | 'content-controlled' | 'not-applicable';
export type OverflowMode = 'visible' | 'clip' | 'scroll' | 'auto' | 'not-applicable';

export interface ResizingContract {
  applicable: boolean;
  width: ResizingMode;
  height: ResizingMode;
  minWidth: string;
  maxWidth: string;
  minHeight: string;
  maxHeight: string;
  overflow: OverflowMode;
  notes: string[];
}

export type DesignPropertyType =
  | 'variant'
  | 'boolean'
  | 'text'
  | 'number'
  | 'instance-swap'
  | 'slot';

export interface DesignExposedProperty {
  name: string;
  label: string;
  type: DesignPropertyType;
  required: boolean;
  defaultValue: string | number | boolean | null;
  options?: string[];
  codeMapping: string;
  notes?: string;
}

export interface NestedAssetContract {
  name: string;
  kind: 'primitive' | 'subcomponent' | 'slot' | 'provider' | 'helper';
  required: boolean;
  description: string;
  codeMapping: string;
}

export interface ContentLimit {
  target: string;
  limit: string;
  overflowBehavior: string;
  rationale: string;
}

export interface LocalizationContract {
  translatable: string[];
  rtlBehavior: string[];
  stressCases: string[];
}

export interface ResponsiveContract {
  strategy: string;
  breakpoints: string[];
  behavior: string[];
}

export interface AuthoringLimitations {
  figma: string[];
  code: string[];
  notApplicable: string[];
}

export type GovernanceStatus = 'stable' | 'beta' | 'deprecated';

export interface ComponentGovernance {
  status: GovernanceStatus;
  ownerRole: string;
  lastReviewed: string;
  canonicalSource: string;
  changePolicy: string[];
}

export interface ComponentConstructionSpecification {
  asset: {
    kind: DesignAssetKind;
    figmaName: string | null;
    localName: string;
    canvasApplicability: string;
  };
  autoLayout: AutoLayoutContract;
  resizing: ResizingContract;
  exposedProperties: DesignExposedProperty[];
  nestedAssets: NestedAssetContract[];
  contentLimits: ContentLimit[];
  localization: LocalizationContract;
  responsive: ResponsiveContract;
  limitations: AuthoringLimitations;
  governance: ComponentGovernance;
}

export type ComponentControl =
  | {
      type: 'boolean';
      label: string;
      defaultValue: boolean;
    }
  | {
      type: 'text';
      label: string;
      defaultValue: string;
      placeholder?: string;
    }
  | {
      type: 'number';
      label: string;
      defaultValue: number;
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
    }
  | {
      type: 'select';
      label: string;
      defaultValue: string;
      options: string[];
    };

/**
 * The complete, serializable contract for one design-system entry.
 *
 * Legacy fields from ComponentDocEntry remain at the top level so existing
 * reference renderers can consume a ComponentSpec without an adapter.
 */
export interface ComponentSpec extends ComponentDocEntry {
  id: ComponentSpecId;
  slug: string;
  summary: string;
  sourcePath: string;
  packageExports: string[];
  anatomy: AnatomyPart[];
  visualSpec: VisualSpecification;
  designTokens: DesignTokenUsage[];
  stateDefinitions: StateDefinition[];
  keyboard: KeyboardInteraction[];
  accessibilitySpec: AccessibilitySpecification;
  implementation: ImplementationSpecification;
  guidance: UsageGuidance;
  testing: TestingContract;
  construction: ComponentConstructionSpecification;
  relatedComponents: ComponentSpecId[];
  controls?: Record<string, ComponentControl>;
}

/** Fields added to a legacy ComponentDocEntry to create a ComponentSpec. */
export type ComponentSpecDetails = Omit<
  ComponentSpec,
  keyof ComponentDocEntry | 'id' | 'construction'
>;
