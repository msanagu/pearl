import { style, globalStyle } from '@vanilla-extract/css';
import { color, space } from '@tokens';
import {
  sphereWrap,
  contact as sphereContact,
} from '@components/_brand/PearlSphere/PearlSphere.css';

// Matches Hero's one-column breakpoint — below it the hero drops its large body
// sphere and this small nav-scale mark stands in beside the wordmark.
const MOBILE = '(max-width: 1100px)';

// Matches Introduction.css.ts's phone-width breakpoint — below it the bar
// tightens its gutter and lets the link row wrap instead of overflowing.
const SMALL = '(max-width: 640px)';

// Matches `Introduction.css.ts`'s `CONTENT_MAX` and `Hero.css.ts`'s band width,
// so the header, hero, and page body all share one column edge.
const CONTENT_MAX_WIDTH = 1440;

export const bar = style({
  background: color.background,
  borderBottom: `1px solid ${color.border}`,
});

// Re-applies the shared content column inside a full-bleed bar. The `calc`
// gutter (not padding) mirrors `heroContentStyle` so the two line up exactly.
export const inner = style({
  maxWidth: CONTENT_MAX_WIDTH,
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: `${space.md} 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media': {
    // A narrower gutter and a wrap allowance keep the link row from forcing
    // horizontal scroll once the wordmark and links can no longer share a line.
    [SMALL]: {
      width: `calc(100% - ${space.lg} - ${space.lg})`,
      flexWrap: 'wrap',
      rowGap: space.sm,
    },
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
