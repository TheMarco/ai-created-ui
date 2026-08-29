export type GuidelineSlug =
  | 'foundations'
  | 'construction'
  | 'patterns'
  | 'content'
  | 'accessibility'
  | 'governance'
  | 'assets';

export type GuidelineStatus = 'canonical' | 'operational' | 'evolving';

export interface GuidelineRule {
  title: string;
  description: string;
  requirements?: string[];
}

export interface GuidelineTable {
  type: 'table';
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
}

export interface GuidelineRules {
  type: 'rules';
  title: string;
  description?: string;
  items: GuidelineRule[];
}

export interface GuidelineChecklist {
  type: 'checklist';
  title: string;
  description?: string;
  groups: Array<{ title: string; items: string[] }>;
}

export interface GuidelineProcess {
  type: 'process';
  title: string;
  description?: string;
  steps: Array<{ title: string; owner: string; output: string; gate: string }>;
}

export interface GuidelineCode {
  type: 'code';
  title: string;
  description?: string;
  language: string;
  code: string;
}

export interface GuidelineTokens {
  type: 'tokens';
  title: string;
  description?: string;
  items: Array<{ name: string; value: string; purpose: string; cssVariable?: string }>;
}

export interface GuidelineResources {
  type: 'resources';
  title: string;
  description?: string;
  items: Array<{
    title: string;
    description: string;
    href: string;
    action: string;
    external?: boolean;
  }>;
}

export type GuidelineBlock =
  | GuidelineTable
  | GuidelineRules
  | GuidelineChecklist
  | GuidelineProcess
  | GuidelineCode
  | GuidelineTokens
  | GuidelineResources;

export interface GuidelineSection {
  id: string;
  title: string;
  summary: string;
  blocks: GuidelineBlock[];
}

export interface GuidelineSpec {
  slug: GuidelineSlug;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  status: GuidelineStatus;
  owner: string;
  lastReviewed: string;
  reviewCycle: string;
  sourceOfTruth: string;
  outcomes: string[];
  sections: GuidelineSection[];
}
