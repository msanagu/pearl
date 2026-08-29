import { pearlBrandWordmark } from './pearl/pearl.roles';
import { tahitianBrandWordmark } from './tahitian/tahitian.roles';
import { southSeaBrandWordmark } from './south-sea/south-sea.roles';
import { freshwaterBrandWordmark } from './freshwater/freshwater.roles';

/** A nav wordmark: the text plus which typography role (if any) decorates it. */
export interface BrandWordmark {
  text: string;
  role?: 'inlineEmphasis';
}

/**
 * Theme id (the Storybook `theme` global) → that theme's own wordmark, from
 * its `*.roles.ts`.
 */
export const brandWordmarkByTheme: Record<string, BrandWordmark> = {
  pearl: pearlBrandWordmark,
  tahitian: tahitianBrandWordmark,
  southSea: southSeaBrandWordmark,
  freshwater: freshwaterBrandWordmark,
};

/** Resolves a theme id to its wordmark, falling back to Pearl's. */
export function brandWordmarkForTheme(theme: string | undefined): BrandWordmark {
  return (theme ? brandWordmarkByTheme[theme] : undefined) ?? pearlBrandWordmark;
}
