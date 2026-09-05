import { style, globalStyle } from '@vanilla-extract/css';
import { color, space } from '@tokens';
import {
  sphereWrap,
  contact as sphereContact,
} from '@components/_brand/PearlSphere/PearlSphere.css';

// Matches Hero's one-column breakpoint — below it the hero drops its body
// sphere and this small nav-scale mark stands in beside the wordmark.
const MOBILE = '(max-width: 1100px)';

// Matches Introduction.css.ts's phone-width breakpoint.
const SMALL = '(max-width: 640px)';

// Matches Introduction.css.ts's CONTENT_MAX and Hero.css.ts's band width, so
// header, hero, and page body share one column edge.
const CONTENT_MAX_WIDTH = 1440;

export const bar = style({
  background: color.background,
  borderBottom: `1px solid ${color.border}`,
});

// Re-applies the shared content column inside a full-bleed bar. calc gutter
// (not padding) mirrors heroContentStyle so the two line up exactly.
export const inner = style({
  maxWidth: CONTENT_MAX_WIDTH,
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: `${space.md} 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // Floor under justify-content's gap — brandRow's flexGrow claims the
  // bar's entire remaining width, so without this space-between has nothing
  // left to distribute and clusters end up flush against each other.
  columnGap: space.xl,
  '@media': {
    // Narrower gutter + wrap allowance keeps the link row from forcing
    // horizontal scroll once wordmark and links can't share a line.
    [SMALL]: {
      width: `calc(100% - ${space.lg} - ${space.lg})`,
      flexWrap: 'wrap',
      rowGap: space.sm,
    },
  },
});

// Brand mark + theme controls — kept in one row, never wrapped internally
// (see SiteHeader.tsx): only the links row below drops to a second line at
// SMALL. flexGrow gives this row the bar's full available width, so its own
// justify="between" can push the mark left and switchers flush right.
export const brandRow = style({
  flexGrow: 1,
  minWidth: 0,
});

// Tightens the row's own gap at SMALL, where it shares the bar with a
// stacked links row — descendant selector outranks the recipe class regardless of emit order.
globalStyle(`${inner} .${brandRow}`, {
  '@media': {
    [SMALL]: { columnGap: space.md },
  },
});

// GitHub/Playground link pair — the only thing that wraps to its own line
// at SMALL (via inner's flexWrap), going full-width and left-aligned under
// the wordmark instead of trailing under the switchers.
export const links = style({
  '@media': {
    [SMALL]: {
      width: '100%',
      justifyContent: 'flex-start',
    },
  },
});

globalStyle(`${inner} .${links}`, {
  '@media': {
    [SMALL]: { columnGap: space.md },
  },
});

export const brand = style({});

// Hidden except at MOBILE, where the hero's own sphere is gone.
export const navSphere = style({
  display: 'none',
  '@media': {
    [MOBILE]: { display: 'flex', alignItems: 'center' },
  },
});

globalStyle(`${navSphere} .${sphereWrap}`, { width: 20, height: 20 });

// No contact shadow at nav scale — under a small mark it reads as an artifact.
globalStyle(`${navSphere} .${sphereContact}`, { display: 'none' });

// Match the wordmark down to `navSphere`'s diameter where the two sit together.
globalStyle(`${brand} [data-component="brand-wordmark"]`, {
  '@media': {
    [MOBILE]: { fontSize: '20px' },
  },
});
