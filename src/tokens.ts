import type { CSSVarFunction } from '@vanilla-extract/private';
import { vars } from './theme.css';

/**
 * Documented, consumer-facing token layer (the semantic tier — ADR-0005).
 *
 * These interfaces re-type `vars.*` with JSDoc so hovering `color.accent` at a
 * call site shows the guidance below. The typed assignment (`color: ColorTokens
 * = vars.color`) is a structural check: if the contract in `theme.css.ts` drifts,
 * TypeScript errors here until this file matches.
 */

/**
 * A sentiment role, keyed by valence — reusable beyond alerts (metrics, diffs…).
 * Application-named (not prominence-named): each field names *where* it applies
 * — `surface`/`border`/`text` map straight to their CSS property, `icon` is the
 * saturated mark color. (ADR-0006 — role-named vs. prominence-named tokens.)
 */
export interface SentimentTokens {
  /** Tinted background fill. */
  surface: CSSVarFunction;
  /** Tinted border. */
  border: CSSVarFunction;
  /** Accessible content text on `surface`. */
  text: CSSVarFunction;
  /** Saturated icon/mark color. */
  icon: CSSVarFunction;
}

export interface ColorTokens {
  /** Page background. */
  background: CSSVarFunction;
  /** Panel/card surface — the default plane cards, alerts, and panels sit on.
   * Elevation above this is signaled via shadow, not a separate surface color. */
  surface: CSSVarFunction;
  /** Modal scrim / dimming overlay. */
  overlay: CSSVarFunction;
  /**
   * Quiet alpha wash for hover/focus backgrounds on ghost/icon-only controls —
   * not `accentSubtle` (a solid, theme-branded tint; most themes' accent is a
   * saturated brand hue, wrong for a "neutral" affordance). Composites over
   * any surface underneath it, unlike a fixed solid token.
   */
  overlaySubtle: CSSVarFunction;
  /** Dark editorial/background plane within the active theme, not a theme switch. */
  backgroundInverse: CSSVarFunction;
  /** Surface placed on `backgroundInverse`. */
  surfaceInverse: CSSVarFunction;
  /** Primary text. */
  text: CSSVarFunction;
  /**
   * One step down in prominence — captions, metadata, helper text, timestamps.
   * `subtle` carries this exact meaning everywhere it appears (border, accent,
   * text) — never a synonym like "muted" elsewhere. (ADR-0006)
   */
  textSubtle: CSSVarFunction;
  /** Primary text on an inverse surface. */
  textInverse: CSSVarFunction;
  /** Secondary text on an inverse surface. */
  textInverseSubtle: CSSVarFunction;
  /** Default border / divider. */
  border: CSSVarFunction;
  /** Higher-contrast border — emphasis, active dividers. */
  borderStrong: CSSVarFunction;
  /** Faint border — subtle separation. */
  borderSubtle: CSSVarFunction;
  /** Border/divider on an inverse surface. */
  borderInverse: CSSVarFunction;
  /** Elevation `box-shadow` color — not a border. Currently one rung; a
   * `shadowSubtle`/`shadowStrong` ladder (ADR-0006) is a candidate once a
   * second elevation level is needed. */
  shadow: CSSVarFunction;
  /** Main call-to-action fill — Button's `primary` variant. Not assumed to
   * equal `accent`: an ink-primary theme's subtle accent color would go loud
   * everywhere it's used (focus borders, underlines) if it also filled CTAs. */
  primary: CSSVarFunction;
  /** Text/icon on a `primary` fill. */
  onPrimary: CSSVarFunction;
  /** Quiet signal color — focus borders, underlines, hover states. Not
   * assumed to be a fill color; see `primary` for the CTA fill. */
  accent: CSSVarFunction;
  /** Accent hover state. */
  accentHover: CSSVarFunction;
  /** Tinted accent background — selected rows, active nav, ghost hover. */
  accentSubtle: CSSVarFunction;
  /** Text/icon on an accent fill. */
  onAccent: CSSVarFunction;
  /** Text/icon on a subtle accent surface. */
  onAccentSubtle: CSSVarFunction;
  /** Focus ring color. */
  focusRing: CSSVarFunction;
  /** Success / upward / gain. */
  positive: SentimentTokens;
  /** Error / downward / loss. */
  negative: SentimentTokens;
  /** Warning / at-risk. */
  warn: SentimentTokens;
  /** Informational. */
  info: SentimentTokens;
}

export interface RadiusTokens {
  /** Default for interactive controls — buttons, inputs. */
  control: CSSVarFunction;
  /**
   * Maximal rounding, for **square-aspect elements only** — avatars, dots,
   * status marks, icon buttons: cases where maximal rounding produces a true
   * circle.
   *
   * Deliberately NOT for rectangles. `full` on a rectangle is a pill, and this
   * system does not use pill shapes — a rectangular element takes
   * `radius.control`, or a radius derived from it, so it shares a corner with
   * everything around it. `Tag` used to read this token and no longer does.
   */
  full: CSSVarFunction;
  /**
   * Whether this theme follows the concentric-nesting rule (`outer = inner +
   * gap`). `'1'` to opt in, `'0'` to opt out — a unitless multiplier applied to
   * the padding term, so one formula serves rounded and hard-edged themes with
   * no branching. Not a length: never set a `border-radius` from it directly.
   */
  nesting: CSSVarFunction;
  /**
   * How the corner carved by `border-radius` is drawn — `round` (the initial
   * value), `squircle`, `bevel`, `notch`, `scoop`, or a `superellipse()`.
   *
   * Applied to everything using `radius.control` or a radius derived from it,
   * and deliberately NOT to `radius.full` elements: a pill or circle reads as a
   * true capsule, not a superellipse. Uniformity is the point — mixing corner
   * shapes across nested elements breaks the concentric-radius relationship.
   *
   * **Inert at `border-radius: 0`.** The property reshapes the corner that the
   * radius carves; with no radius there is no corner box to draw into, so every
   * value renders identically. A hard-edged theme (South Sea, Tahitian) can set
   * anything here and see no change — `round` is simply the honest "no opinion"
   * answer, and it is already in place if that theme ever takes on a radius.
   * This is the axis's one real difference from `nesting`, which square themes
   * genuinely depend on.
   */
  cornerShape: CSSVarFunction;
}

/**
 * rem, not px — so spacing scales with a user's browser/OS base font-size
 * preference, not just page zoom (WCAG SC 1.4.4), matching `TextTokens`.
 * The px figures below assume the browser default 16px root.
 */
export interface SpaceTokens {
  /** 0.25rem (4px). The named half-step — tight icon/chip gaps only. */
  xs: CSSVarFunction;
  /** 0.5rem (8px). Related inline elements, compact padding. */
  sm: CSSVarFunction;
  /** 1rem (16px). Default component padding and standard rhythm. */
  md: CSSVarFunction;
  /** 1.5rem (24px). Section spacing, card padding. */
  lg: CSSVarFunction;
  /** 2rem (32px). Major layout gaps. */
  xl: CSSVarFunction;
  /** 3rem (48px). Page-section separation. */
  '2xl': CSSVarFunction;
}

/**
 * rem, not px — a fixed-px control height stops growing once a user raises
 * their base font-size, clipping text that scaled past it. Same reasoning
 * as `SpaceTokens`.
 */
export interface ControlHeightTokens {
  /** Compact controls. */
  sm: CSSVarFunction;
  /** Default control height. */
  md: CSSVarFunction;
  /** Comfortable / touch-friendly. */
  lg: CSSVarFunction;
  /** Large / hero controls. */
  xl: CSSVarFunction;
}

export interface FontFamilyTokens {
  /** Font for display/hero type (display* variants). */
  display: CSSVarFunction;
  /** Font for headings (heading* variants). */
  heading: CSSVarFunction;
  /** Font for body/UI text (body* variants, controls). */
  body: CSSVarFunction;
  /** Monospace font for labels, metadata, and data-oriented UI. */
  mono: CSSVarFunction;
}

export interface FontWeightTokens {
  /** 400. Body text default. */
  regular: CSSVarFunction;
  /** 500. Subtle emphasis. */
  medium: CSSVarFunction;
  /** 600. Headings default, strong emphasis. */
  semibold: CSSVarFunction;
  /** 700. Heaviest emphasis / display. */
  bold: CSSVarFunction;
}

/**
 * One type-scale step: size, line-height, a default weight, and tracking.
 * See docs/foundations/typography.md for the accessibility rationale behind the units.
 */
export interface TextVariantTokens {
  /** rem — scales with the user's browser/OS text size (WCAG SC 1.4.4). */
  fontSize: CSSVarFunction;
  /**
   * Unitless multiplier, not a fixed px value — required by WCAG SC 1.4.12 so
   * a user's forced text-spacing override scales with font-size rather than
   * colliding with it. Authored per theme to land on the 8px soft grid.
   */
  lineHeight: CSSVarFunction;
  fontWeight: CSSVarFunction;
  /**
   * Letter-spacing for this step. Tracking belongs to the type step rather than
   * to a standalone scale — the right value is a function of size, so display
   * runs tight and body runs at zero. Label/caps tracking is a per-theme
   * concern, not part of this shared scale.
   */
  letterSpacing: CSSVarFunction;
}

export interface TextTokens {
  /** 10/16. Deliberate 4px-grid escape (fontSize only) — 12px would collide
   * with `bodySm`, 8px is below the legible floor. Labels, tabular data,
   * micro-metadata. */
  caption: TextVariantTokens;
  /** 12/20. Fine print, captions, metadata. */
  bodySm: TextVariantTokens;
  /** 16/24. Default body text. */
  bodyMd: TextVariantTokens;
  /** 24/36. Lead paragraphs, comfortable reading. */
  bodyLg: TextVariantTokens;
  /** 32/40. Subsection headings. */
  headingSm: TextVariantTokens;
  /** 40/48. Section headings. */
  headingMd: TextVariantTokens;
  /** 56/64. Page titles. */
  headingLg: TextVariantTokens;
  /** 80/84. Large hero / marketing type — above document headings. */
  displaySm: TextVariantTokens;
  /** 112/120. Ultra-large landing/hero display type. */
  displayLg: TextVariantTokens;
  /** 152/160. Poster scale — the theme's largest voice. Identity and title pages only. */
  displayXl: TextVariantTokens;
}

// The annotations are the whole trick: TS checks `vars.*` against each interface
// structurally, and the JSDoc is what surfaces on hover downstream.
export const color: ColorTokens = vars.color;
export const radius: RadiusTokens = vars.radius;
export const space: SpaceTokens = vars.space;
export const controlHeight: ControlHeightTokens = vars.controlHeight;
export const fontFamily: FontFamilyTokens = vars.fontFamily;
export const fontWeight: FontWeightTokens = vars.fontWeight;
export const text: TextTokens = vars.text;
