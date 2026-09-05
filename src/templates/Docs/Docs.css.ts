import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// Matches Hero / SiteHeader one-column breakpoint.
const MOBILE = '(max-width: 1100px)';

// Matches Introduction.css.ts / SiteHeader.css.ts phone-width breakpoint.
const SMALL = '(max-width: 640px)';

// 3 columns -> 2 (drop "on this page" rail) -> 1 (sidebar stacks above article).
export const main = style({
  gridTemplateColumns: '240px minmax(0, 1fr) 200px',
  padding: `${space['2xl']} ${space.xl}`,
  '@media': {
    [MOBILE]: { gridTemplateColumns: '200px minmax(0, 1fr)' },
    [SMALL]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      padding: `${space.xl} ${space.md}`,
    },
  },
});

// Sticky beside article; static at SMALL to avoid pinning over article on scroll.
export const sidebar = style({
  position: 'sticky',
  '@media': {
    [SMALL]: { position: 'static' },
  },
});

// Redundant at 2 columns or fewer — no third column left to occupy.
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
