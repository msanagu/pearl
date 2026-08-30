// Ambient types for Impeccable (ships no .d.ts). We only use the rule-data and
// font-list exports here; the browser bundle registers window globals as a side
// effect (see impeccableAudit.ts).
declare module 'impeccable' {
  export const OVERUSED_FONTS: Iterable<string>;
  export const GENERIC_FONTS: Iterable<string>;
  export const KNOWN_SERIF_FONTS: Iterable<string>;
  export const ANTIPATTERNS: ReadonlyArray<{
    id: string;
    category: 'slop' | 'quality';
    name: string;
    description: string;
    severity?: string;
    scopes?: string[];
    advisory?: boolean;
  }>;
  export function contrastRatio(a: unknown, b: unknown): number;
  export function parseRgb(color: string): {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

declare module 'impeccable/browser';

// The browser bundle registers these on window (see impeccableAudit.ts). One
// canonical shape so every consumer agrees.
interface ImpeccableFinding {
  type: string;
  category: string;
  severity?: string;
  advisory?: boolean;
  name: string;
  description: string;
  detail?: string;
}
interface ImpeccableGroup {
  selector?: string;
  tagName?: string;
  isPageLevel?: boolean;
  findings: ImpeccableFinding[];
}
interface Window {
  __IMPECCABLE_CONFIG__?: Record<string, unknown>;
  impeccableDetect?: (options?: Record<string, unknown>) => ImpeccableGroup[];
}
