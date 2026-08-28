import { pearlBrandWordmark } from './pearl.roles';
import { tahitianBrandWordmark } from './tahitian.roles';
import { southSeaBrandWordmark } from './south-sea.roles';

/** A nav wordmark: the text plus which typography role (if any) decorates it. */
export interface BrandWordmark {
  text: string;
  role?: 'inlineEmphasis';
}

/**
 * Theme id (the Storybook `theme` global) → that theme's own wordmark, from
 * its `*.roles.ts`. Freshwater has no role table yet, so it is absent here and
 * resolves to Pearl's wordmark rather than fabricating one.
 */
const brandWordmarkByTheme: Record<string, BrandWordmark> = {
  pearl: pearlBrandWordmark,
  tahitian: tahitianBrandWordmark,
  southSea: southSeaBrandWordmark,
};

/** Resolves a theme id to its wordmark, falling back to Pearl's. */
export function brandWordmarkForTheme(theme: string | undefined): BrandWordmark {
  return (theme ? brandWordmarkByTheme[theme] : undefined) ?? pearlBrandWordmark;
}
