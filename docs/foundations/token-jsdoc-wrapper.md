# Getting JSDoc-on-Hover at Consumption Sites (Vanilla-Extract)

## The problem
`vars` from `createThemeContract` is inferred structurally — hovering `vars.color.brandPrimary`
inside a component shows its CSS-var type, not any JSDoc you wrote elsewhere.

## The fix: a typed wrapper, not a raw re-export

```ts
// theme.css.ts — the contract itself (unchanged)
import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    brandPrimary: null,
    brandSecondary: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
  },
});
```

```ts
// tokens.ts — the documented, consumer-facing layer
import type { CSSVarFunction } from '@vanilla-extract/private';
import { vars } from './theme.css';

interface ColorTokens {
  /** Page background. Should have high contrast against `textPrimary`. */
  background: CSSVarFunction;
  /** Card/panel surface — one elevation level above `background`. */
  surface: CSSVarFunction;
  /** Primary brand color. Use for CTAs, links, active/focus states. */
  brandPrimary: CSSVarFunction;
  /** Secondary brand accent. Use sparingly — highlights, badges, not primary actions. */
  brandSecondary: CSSVarFunction;
}

interface SpaceTokens {
  /** 4px. Use for tight internal padding (icon gaps, chip padding). */
  xs: CSSVarFunction;
  /** 8px. Default gap between closely related inline elements. */
  sm: CSSVarFunction;
  /** 16px. Default padding for cards, form fields, standard layout rhythm. */
  md: CSSVarFunction;
}

// The type annotation is the whole trick — TS checks vars.color against
// ColorTokens structurally (so it can't silently drift), and the JSDoc
// on ColorTokens is what shows up on hover downstream.
export const colorVars: ColorTokens = vars.color;
export const spaceVars: SpaceTokens = vars.space;
```

```ts
// Button.css.ts — consumer, now with hover docs
import { style } from '@vanilla-extract/css';
import { colorVars, spaceVars } from '../tokens';

export const button = style({
  backgroundColor: colorVars.brandPrimary, // hovering this shows the JSDoc ↑
  padding: spaceVars.sm,                    // hovering this shows "8px..." ↑
});
```

## Why this stays safe (no silent drift)

Because `colorVars: ColorTokens = vars.color` is a structural type check, if the contract
in `theme.css.ts` ever adds/removes/renames a token, TypeScript throws a compile error at
the `tokens.ts` assignment line — either "missing property" or "excess property" — forcing
you to update the JSDoc-annotated interface to match. The documentation can't quietly go
stale relative to the actual token set; the compiler is the enforcement mechanism.

## The real tradeoff, stated plainly

This is a maintained wrapper layer, not a built-in vanilla-extract feature — every token
category needs its own interface, and every time you add a token you touch two files
(the contract, and the JSDoc interface). For a project of your intended scale (a personal
design system, not hundreds of tokens), that's a small, honest cost for a real DX win —
and the interfaces themselves become another piece of retrievable documentation content
for your RAG server later, so the "extra" work isn't wasted, it's dual-purpose.
