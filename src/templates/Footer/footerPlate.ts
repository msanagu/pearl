/**
 * Theme id (the Storybook `theme` global) → the shell photo the footer's
 * plate shows for it. Same shape as `brandWordmarkByTheme`: the template
 * itself takes a plain `src`/`alt`, and the caller resolves the theme.
 *
 * Full-colour, framed, nothing sitting on it — decorative texture, so no
 * contrast obligation and no grayscale/opacity treatment.
 */
export interface FooterPlate {
  src: string;
  alt: string;
}

export const pearlFooterPlate: FooterPlate = {
  src: '/images/silver-reflection.jpg',
  alt: 'Silver-toned reflected light',
};

export const footerPlateByTheme: Record<string, FooterPlate> = {
  pearl: pearlFooterPlate,
  tahitian: {
    src: '/images/abalone.jpg',
    alt: 'A dark abalone shell, iridescent',
  },
  southSea: {
    src: '/images/golden-pearl.jpg',
    alt: 'A golden pearl resting in its shell',
  },
  freshwater: {
    src: '/images/cyan-reflection.jpg',
    alt: 'Cool blue-green reflected light',
  },
};

/** Resolves a theme id to its plate, falling back to Pearl's. */
export function footerPlateForTheme(theme: string | undefined): FooterPlate {
  return (theme ? footerPlateByTheme[theme] : undefined) ?? pearlFooterPlate;
}
