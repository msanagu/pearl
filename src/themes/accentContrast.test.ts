import { describe, it, expect } from 'vitest';
import { contrast, WCAG } from '@/validate/contrast';
import type { Hex } from '@/validate/contrast';
import { alabaster, urchin, squidInk } from './pearl/pearl.css';
import {
  freshwaterIce,
  freshwaterGlacier,
  freshwaterGraphite,
} from './freshwater/freshwater.css';
import {
  southSeaSand,
  southSeaConch,
  southSeaDriftwood,
} from './south-sea/south-sea.css';
import {
  tahitianPlatinum,
  tahitianPeacock,
  tahitianCharcoal,
  tahitianSeaglass,
} from './tahitian/tahitian.css';

/**
 * The sanctioned pairs for `accent` — the data half of the split
 * `validate/contrast.ts` describes ("this module is not the rules").
 *
 * `accent` is documented as a quiet SIGNAL color: focus borders, underlines,
 * hover states, all of which answer to WCAG 1.4.11's 3:1 non-text bar. For a
 * long time every consumer honored that — borders, fills, and display type
 * only — so nothing held it to the 4.5:1 text bar, and two themes had drifted
 * below it unnoticed (Freshwater light at 2.29:1, South Sea light at 1.82:1).
 * `Link` is the component that made it body text, and this file is what stops
 * a theme from drifting back.
 *
 * Two rules, both at the text threshold:
 *
 * 1. `accent` and `accentHover` are readable on BOTH grounds they can land on
 *    — `background` and `surface`. Which is darker differs by theme (Tahitian
 *    light puts `surface` above `background`), so the check takes the worse of
 *    the pair rather than assuming an order.
 * 2. `onAccent` is readable on `accent`, since `accent` is also a fill (see
 *    `accentPill` in foundations/tokens.css.ts). This is what forces `onAccent`
 *    to flip register whenever `accent` crosses the middle of the ramp.
 *
 * Values are the primitives, duplicated from each theme's role block rather
 * than read back from `vars` — `createTheme` returns CSS variable references,
 * not colors, so there is nothing to measure at runtime. That duplication is
 * the reason this file names its steps explicitly: a role reassignment that
 * forgets to update this table shows up as a failure here, not silence.
 */
type AccentPairs = {
  theme: string;
  background: Hex;
  surface: Hex;
  accent: Hex;
  accentHover: Hex;
  onAccent: Hex;
};

const themes: AccentPairs[] = [
  {
    theme: 'pearl light',
    background: alabaster[300],
    surface: alabaster[200],
    accent: urchin[600],
    accentHover: urchin[700],
    onAccent: alabaster[300],
  },
  {
    theme: 'pearl dark',
    background: squidInk[900],
    surface: squidInk[800],
    accent: urchin[100],
    accentHover: alabaster[100],
    onAccent: squidInk[900],
  },
  {
    theme: 'freshwater light',
    background: freshwaterIce[100],
    surface: freshwaterIce[200],
    accent: freshwaterGlacier[500],
    accentHover: freshwaterGlacier[600],
    onAccent: freshwaterIce[100],
  },
  {
    theme: 'freshwater dark',
    background: freshwaterGraphite[900],
    surface: freshwaterGraphite[800],
    accent: freshwaterGlacier[300],
    accentHover: freshwaterGlacier[400],
    onAccent: freshwaterGraphite[900],
  },
  {
    theme: 'south sea light',
    background: southSeaSand[100],
    surface: southSeaSand[200],
    accent: southSeaConch[400],
    accentHover: southSeaConch[500],
    onAccent: southSeaSand[150],
  },
  {
    theme: 'south sea dark',
    background: southSeaDriftwood[900],
    surface: southSeaDriftwood[850],
    accent: southSeaConch[300],
    accentHover: southSeaConch[200],
    onAccent: southSeaDriftwood[900],
  },
  {
    theme: 'tahitian light',
    background: tahitianPlatinum[200],
    surface: tahitianPlatinum[100],
    accent: tahitianPeacock[600],
    accentHover: tahitianPeacock[700],
    onAccent: tahitianPlatinum[100],
  },
  {
    theme: 'tahitian dark',
    background: tahitianCharcoal[950],
    surface: tahitianCharcoal[900],
    accent: tahitianSeaglass[400],
    accentHover: tahitianSeaglass[300],
    onAccent: tahitianCharcoal[950],
  },
];

/** The worse of the two grounds a token can land on. */
const onEitherGround = (fg: Hex, t: AccentPairs) =>
  Math.min(contrast(fg, t.background), contrast(fg, t.surface));

describe.each(themes)('$theme', (t) => {
  it('sets `accent` readably on both background and surface', () => {
    expect(onEitherGround(t.accent, t)).toBeGreaterThanOrEqual(WCAG.text);
  });

  it('sets `accentHover` readably on both background and surface', () => {
    expect(onEitherGround(t.accentHover, t)).toBeGreaterThanOrEqual(WCAG.text);
  });

  it('reads `onAccent` on an `accent` fill', () => {
    expect(contrast(t.onAccent, t.accent)).toBeGreaterThanOrEqual(WCAG.text);
  });
});
