import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// Matches Hero's / SiteHeader's one-column breakpoint.
const MOBILE = '(max-width: 1100px)';

// Matches Introduction.css.ts's / SiteHeader.css.ts's phone-width breakpoint.
const SMALL = '(max-width: 640px)';

// Three columns -> two (drop the "on this page" rail, no room left beside the
// article) -> one (sidebar stacks above the article instead of beside it).
export const main = style({
  gridTemplateColumns: '240px minmax(0, 1fr) 200px',
  padding: `${space['2xl']} ${space.xl}`,
  '@media': {
    [MOBILE]: { gridTemplateColumns: '200px minmax(0, 1fr)' },
    // Phone-width gutter: `xl` (32px) a side is proportionally huge once the
    // grid has already dropped to one column — `md` still separates content
    // from the edge without eating a chunk of a ~375px viewport.
    [SMALL]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      padding: `${space.xl} ${space.md}`,
    },
  },
});

// Sticky while beside the article; stacked full-width at SMALL, where sticky
// would otherwise pin it over the article as the page scrolls.
export const sidebar = style({
  position: 'sticky',
  '@media': {
    [SMALL]: { position: 'static' },
  },
});

// Redundant once the layout is two columns or fewer — there's no third
// column left for it to occupy.
export const onThisPageRail = style({
  position: 'sticky',
  '@media': {
    [MOBILE]: { display: 'none' },
  },
});

export const navLink = style({
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});

export const scrollRegion = style({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});
