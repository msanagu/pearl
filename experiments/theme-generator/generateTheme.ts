import { color, controlHeight, fontFamily, fontWeight, radius, space, text } from '../../src/tokens';

/**
 * End-user theme generator (POC/CreateTheme).
 *
 * The premise: a layman does NOT edit tokens one-by-one. They steer a brand
 * color, optionally add an accent hue, choose how tinted the neutrals are, and
 * refine a personality and objective — and this module derives the ENTIRE
 * semantic token set from those answers, accessible by construction.
 *
 * ## Faithful brand, guaranteed-accessible everything-else
 * The brand color is kept EXACT: the user's OKLCH lightness/chroma/hue survive
 * untouched into the palette, so the brand ramp always contains one step that
 * is literally the color they picked — a hex they could paste (see
 * {@link brandScale}, the `exact` step). Personality never mutes the brand; it
 * only mutes the *derived* extras (sentiment), and the user controls neutral
 * tint directly.
 *
 * The DERIVED ramps (neutral, sentiment) use a FIXED lightness per step. Because
 * OKLCH `L` is perceptually uniform, the contrast between two fixed steps
 * (`surface`=50 vs `text`=900) holds for any hue — validated once, safe for
 * every brand. Where the brand fills a surface (`primary`), we compute the
 * on-color from the brand's own L, so a faithful-but-arbitrary brand color can
 * fill a button without ever failing text contrast.
 */

// ---- Ramp lightness ladder (light mode) ------------------------------------
const STEP_L: Record<number, number> = {
  50: 0.985,
  100: 0.965,
  200: 0.925,
  300: 0.86,
  400: 0.76,
  500: 0.66,
  600: 0.56,
  700: 0.46,
  800: 0.36,
  900: 0.26,
  950: 0.18,
};

const STEP_CHROMA_FACTOR: Record<number, number> = {
  50: 0.18,
  100: 0.3,
  200: 0.55,
  300: 0.78,
  400: 0.95,
  500: 1.0,
  600: 0.96,
  700: 0.82,
  800: 0.62,
  900: 0.42,
  950: 0.28,
};

export const STEPS = Object.keys(STEP_L).map(Number);

// ============================================================================
// Color math — zero-dependency OKLCH <-> sRGB (Björn Ottosson's OKLab).
// We need real hex, not just `oklch()` strings, so the brand step the user sees
// is a value they can copy/paste and get back byte-for-byte.
// ============================================================================
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

function srgbToLinear(x: number): number {
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}
function linearToSrgb(x: number): number {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

function oklchToLinearRgb({ l, c, h }: Oklch): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;

  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

function linearRgbToOklch(r: number, g: number, b: number): Oklch {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.hypot(a, bb);
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

function inGamut([r, g, b]: [number, number, number]): boolean {
  const e = 1e-4;
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e;
}

// Reduce chroma (holding L and H) until the color fits sRGB — the standard
// OKLCH gamut-mapping approach, so every emitted hex is representable.
function gamutMap(color: Oklch): Oklch {
  if (inGamut(oklchToLinearRgb(color))) return color;
  let lo = 0;
  let hi = color.c;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinearRgb({ ...color, c: mid }))) lo = mid;
    else hi = mid;
  }
  return { ...color, c: lo };
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function oklchToHex(color: Oklch): string {
  const [lr, lg, lb] = oklchToLinearRgb(gamutMap(color));
  const to255 = (x: number) => Math.round(clamp01(linearToSrgb(x)) * 255);
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(to255(lr))}${hex(to255(lg))}${hex(to255(lb))}`;
}

export function hexToOklch(hex: string): Oklch | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1]!, 16);
  const r = srgbToLinear(((int >> 16) & 0xff) / 255);
  const g = srgbToLinear(((int >> 8) & 0xff) / 255);
  const b = srgbToLinear((int & 0xff) / 255);
  return linearRgbToOklch(r, g, b);
}

// A derived (non-faithful) ramp: fixed L per step, a single hue, enveloped
// chroma. Used for neutrals and sentiment. Emitted as `oklch()` strings — the
// browser clamps these; they are not the pasteable target the brand is.
type CssRamp = Record<number, string>;
function oklchCss({ l, c, h }: Oklch, alpha?: number): string {
  const r = (n: number) => Math.round(n * 1e4) / 1e4;
  const base = `${r(l)} ${r(c)} ${r(h)}`;
  return alpha === undefined ? `oklch(${base})` : `oklch(${base} / ${r(alpha)})`;
}
function derivedRamp(hue: number, baseChroma: number): CssRamp {
  const out: CssRamp = {};
  for (const step of STEPS) {
    out[step] = oklchCss({ l: STEP_L[step]!, c: baseChroma * STEP_CHROMA_FACTOR[step]!, h: hue });
  }
  return out;
}

// Shortest-path hue interpolation — pulls sentiment hues a few degrees toward
// the brand temperature so the four families read as one set (anice.red move).
function lerpHue(from: number, to: number, t: number): number {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return (((from + delta * t) % 360) + 360) % 360;
}

// ---- Personality: radius, sentiment colorfulness, type lean ----------------
export type PersonalityId = 'friendly' | 'confident' | 'refined' | 'calm';

interface PersonalityTraits {
  radius: { control: number; surface: number; full: number };
  /** Multiplier on DERIVED (sentiment) chroma only — never the brand. */
  chroma: number;
  serifDisplay: boolean;
  weight: { regular: number; medium: number; semibold: number; bold: number };
}

interface Variant<T> {
  id: string;
  label: string;
  blurb: string;
  patch: Partial<T>;
}

interface Personality extends PersonalityTraits {
  label: string;
  variants: Variant<PersonalityTraits>[];
}

const PERSONALITIES: Record<PersonalityId, Personality> = {
  friendly: {
    label: 'Friendly',
    radius: { control: 12, surface: 20, full: 999 },
    chroma: 1.0,
    serifDisplay: false,
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    variants: [
      { id: 'soft', label: 'Soft', blurb: 'Gentle corners, balanced color.', patch: {} },
      { id: 'playful', label: 'Playful', blurb: 'Rounder still, livelier color.', patch: { radius: { control: 16, surface: 28, full: 999 }, chroma: 1.15 } },
      { id: 'warm', label: 'Warm', blurb: 'A touch calmer and less saturated.', patch: { chroma: 0.85 } },
    ],
  },
  confident: {
    label: 'Confident',
    radius: { control: 6, surface: 10, full: 999 },
    chroma: 1.15,
    serifDisplay: false,
    weight: { regular: 450, medium: 550, semibold: 680, bold: 800 },
    variants: [
      { id: 'bold', label: 'Bold', blurb: 'Heavy weights, saturated alerts.', patch: {} },
      { id: 'electric', label: 'Electric', blurb: 'Maximum alert intensity.', patch: { chroma: 1.35 } },
      { id: 'grounded', label: 'Grounded', blurb: 'Sharper corners, steadier color.', patch: { radius: { control: 3, surface: 6, full: 999 }, chroma: 0.95 } },
    ],
  },
  refined: {
    label: 'Refined',
    radius: { control: 2, surface: 4, full: 999 },
    chroma: 0.55,
    serifDisplay: true,
    weight: { regular: 380, medium: 480, semibold: 560, bold: 680 },
    variants: [
      { id: 'understated', label: 'Understated', blurb: 'Sharp, muted, serif display.', patch: {} },
      { id: 'editorial', label: 'Editorial', blurb: 'Slightly softer, more contrast.', patch: { radius: { control: 4, surface: 8, full: 999 } } },
      { id: 'minimal', label: 'Minimal', blurb: 'Sans display, nearly monochrome.', patch: { serifDisplay: false, chroma: 0.35 } },
    ],
  },
  calm: {
    label: 'Calm',
    radius: { control: 8, surface: 14, full: 999 },
    chroma: 0.72,
    serifDisplay: false,
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    variants: [
      { id: 'gentle', label: 'Gentle', blurb: 'Soft corners, quiet color.', patch: {} },
      { id: 'airy', label: 'Airy', blurb: 'Rounder, even lighter presence.', patch: { radius: { control: 12, surface: 18, full: 999 }, chroma: 0.6 } },
      { id: 'muted', label: 'Muted', blurb: 'Nearly desaturated alerts.', patch: { chroma: 0.45 } },
    ],
  },
};

// ---- Objective: density and type scale -------------------------------------
export type ObjectiveId = 'editorial' | 'marketing' | 'product' | 'dataDense';

interface ObjectiveTraits {
  controlHeight: { sm: number; md: number; lg: number; xl: number };
  space: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number };
  typeScale: number;
  fonts: { display: 'sans' | 'serif'; heading: 'sans' | 'serif'; body: 'sans' };
}

interface Objective extends ObjectiveTraits {
  label: string;
  variants: Variant<ObjectiveTraits>[];
}

const OBJECTIVES: Record<ObjectiveId, Objective> = {
  editorial: {
    label: 'Editorial',
    controlHeight: { sm: 36, md: 44, lg: 52, xl: 64 },
    space: { xs: 4, sm: 10, md: 18, lg: 28, xl: 40, '2xl': 60 },
    typeScale: 1.08,
    fonts: { display: 'serif', heading: 'serif', body: 'sans' },
    variants: [
      { id: 'reading', label: 'Reading', blurb: 'Long-form article layout.', patch: {} },
      { id: 'magazine', label: 'Magazine', blurb: 'Larger display, bolder rhythm.', patch: { typeScale: 1.16 } },
      { id: 'blog', label: 'Blog', blurb: 'Tighter, more utilitarian.', patch: { typeScale: 1.0 } },
    ],
  },
  marketing: {
    label: 'Marketing',
    controlHeight: { sm: 38, md: 46, lg: 56, xl: 68 },
    space: { xs: 4, sm: 10, md: 18, lg: 30, xl: 44, '2xl': 64 },
    typeScale: 1.14,
    fonts: { display: 'sans', heading: 'sans', body: 'sans' },
    variants: [
      { id: 'hero', label: 'Hero-led', blurb: 'Big display, generous whitespace.', patch: {} },
      { id: 'productLed', label: 'Product-led', blurb: 'Balanced, screenshot-friendly.', patch: { typeScale: 1.06, space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 36, '2xl': 52 } } },
      { id: 'conversion', label: 'Conversion', blurb: 'Denser, action-forward.', patch: { typeScale: 1.02 } },
    ],
  },
  product: {
    label: 'Product / App',
    controlHeight: { sm: 32, md: 40, lg: 48, xl: 58 },
    space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 },
    typeScale: 1.0,
    fonts: { display: 'sans', heading: 'sans', body: 'sans' },
    variants: [
      { id: 'app', label: 'App', blurb: 'Balanced general-purpose UI.', patch: {} },
      { id: 'saas', label: 'SaaS', blurb: 'A little airier, marketing-adjacent.', patch: { typeScale: 1.04 } },
      { id: 'console', label: 'Console', blurb: 'Tighter, tool-like density.', patch: { controlHeight: { sm: 28, md: 34, lg: 40, xl: 50 }, typeScale: 0.96 } },
    ],
  },
  dataDense: {
    label: 'Data-dense',
    controlHeight: { sm: 26, md: 32, lg: 38, xl: 46 },
    space: { xs: 2, sm: 6, md: 12, lg: 18, xl: 26, '2xl': 40 },
    typeScale: 0.92,
    fonts: { display: 'sans', heading: 'sans', body: 'sans' },
    variants: [
      { id: 'dashboard', label: 'Dashboard', blurb: 'Compact cards and controls.', patch: {} },
      { id: 'table', label: 'Table', blurb: 'Tightest rows, smallest type.', patch: { controlHeight: { sm: 24, md: 28, lg: 34, xl: 42 }, typeScale: 0.88 } },
      { id: 'analytics', label: 'Analytics', blurb: 'A bit more breathing room.', patch: { typeScale: 0.96 } },
    ],
  },
};

// Body is a neutral sans; display/heading always resolve to a DIFFERENT family
// (Impeccable `single-font`: pair display + body). `display` is Boska, a real
// self-hosted display serif (see boska.css.ts) — even if the file 404s it
// falls back to another serif, still distinct from the sans body. `sans` and
// `serif` are plain system-font stacks, zero-cost for MVP — no named webfont
// is self-hosted for them, so no paid/aspirational face is named here either.
// None of the named faces are in Impeccable's OVERUSED_FONTS list (verified
// in generateTheme.impeccable.test).
const FONT_STACKS = {
  sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  display: "'Boska', Georgia, serif",
} as const;

/** The body face family (first non-generic token) — everything else must differ. */
function resolveFaces(serifDisplay: boolean, objectiveDisplay: 'sans' | 'serif') {
  const body = FONT_STACKS.sans;
  // A serif personality wins; otherwise honor the objective — but never let the
  // display face collapse onto the sans body (that's `single-font`).
  const displayKey = serifDisplay || objectiveDisplay === 'serif' ? 'serif' : 'display';
  return { body, display: FONT_STACKS[displayKey], heading: FONT_STACKS[displayKey] };
}

const BASE_TYPE: Record<
  keyof typeof text,
  { size: number; lineHeight: number; weight: keyof PersonalityTraits['weight']; tracking: number }
> = {
  caption: { size: 0.6875, lineHeight: 1.45, weight: 'medium', tracking: 0.01 },
  bodySm: { size: 0.75, lineHeight: 1.5, weight: 'regular', tracking: 0 },
  bodyMd: { size: 0.875, lineHeight: 1.55, weight: 'regular', tracking: 0 },
  bodyLg: { size: 1.0, lineHeight: 1.6, weight: 'regular', tracking: 0 },
  headingSm: { size: 1.25, lineHeight: 1.3, weight: 'semibold', tracking: -0.005 },
  headingMd: { size: 1.5, lineHeight: 1.3, weight: 'semibold', tracking: -0.01 },
  headingLg: { size: 2.0, lineHeight: 1.2, weight: 'bold', tracking: -0.015 },
  displaySm: { size: 2.5, lineHeight: 1.15, weight: 'bold', tracking: -0.02 },
  displayLg: { size: 3.5, lineHeight: 1.05, weight: 'bold', tracking: -0.025 },
};

const SENTIMENT_ANCHOR = { positive: 150, negative: 27, warn: 80, info: 250 } as const;
const SENTIMENT_BASE_CHROMA = 0.13;

// Neutral tint: user-controlled, subtle. Even at max the neutrals only barely
// lean toward the brand hue; at 0 they are true greys.
const NEUTRAL_MAX_CHROMA = 0.02;

/** The user's brand color, kept EXACT in OKLCH — the faithful anchor. */
export type BrandColor = Oklch;

export interface ThemeInput {
  brand: BrandColor;
  /** Accent HUE only → resolves to fixed accessible steps (focus, icons). null = brand-only. */
  accentHue: number | null;
  /** 0 = true grey neutrals, 1 = as tinted-toward-brand as neutrals ever get (still subtle). */
  neutralTint: number;
  personality: PersonalityId;
  personalityVariant: string;
  objective: ObjectiveId;
  objectiveVariant: string;
}

export const DEFAULT_INPUT: ThemeInput = {
  // Deliberately NOT the AI-default purple/violet or warm cream (Impeccable
  // `ai-color-palette` / `cream-palette`): a deep teal-green anchor instead.
  brand: { l: 0.52, c: 0.11, h: 175 },
  accentHue: null,
  neutralTint: 0.2,
  personality: 'friendly',
  personalityVariant: 'soft',
  objective: 'product',
  objectiveVariant: 'app',
};

// Minimum RENDERED px for generated text (Impeccable `tiny-text` /
// `undersized-ui-text`): functional/caption text never below 11px, body never
// below 12px, regardless of a dense objective's type-scale multiplier.
const ROOT_PX = 16;
const MIN_PX: Partial<Record<keyof typeof text, number>> = {
  caption: 11,
  bodySm: 12,
  bodyMd: 12,
  bodyLg: 12,
};
// Multi-line copy needs breathing room (Impeccable `tight-leading`); display
// steps are single-line and exempt.
const MIN_LEADING = 1.3;
const DISPLAY_STEPS = new Set(['displaySm', 'displayLg']);

function resolvePersonality(id: PersonalityId, variantId: string): PersonalityTraits {
  const p = PERSONALITIES[id];
  const v = p.variants.find((x) => x.id === variantId) ?? p.variants[0]!;
  return { radius: p.radius, chroma: p.chroma, serifDisplay: p.serifDisplay, weight: p.weight, ...v.patch };
}

function resolveObjective(id: ObjectiveId, variantId: string): ObjectiveTraits {
  const o = OBJECTIVES[id];
  const v = o.variants.find((x) => x.id === variantId) ?? o.variants[0]!;
  return { controlHeight: o.controlHeight, space: o.space, typeScale: o.typeScale, fonts: o.fonts, ...v.patch };
}

function sentimentGroup(r: CssRamp) {
  return { surface: r[100]!, border: r[300]!, text: r[700]!, icon: r[500]! };
}

function neutralChroma(input: ThemeInput): number {
  return NEUTRAL_MAX_CHROMA * Math.min(1, Math.max(0, input.neutralTint));
}

/**
 * The BRAND ramp — faithful. The step whose fixed L is nearest the brand's own
 * L is replaced by the exact brand color (hue, chroma AND lightness untouched),
 * so the palette literally contains the pasteable hex. Neighbours keep the
 * fixed-L ladder with chroma scaled relative to the anchor.
 */
export function brandScale(brand: BrandColor) {
  const anchorStep = STEPS.reduce((best, s) =>
    Math.abs(STEP_L[s]! - brand.l) < Math.abs(STEP_L[best]! - brand.l) ? s : best,
  );
  return STEPS.map((step) => {
    const exact = step === anchorStep;
    const oklch: Oklch = exact
      ? { ...brand }
      : {
          l: STEP_L[step]!,
          c: brand.c * (STEP_CHROMA_FACTOR[step]! / STEP_CHROMA_FACTOR[anchorStep]!),
          h: brand.h,
        };
    return { step, exact, hex: oklchToHex(oklch) };
  });
}

/**
 * The NEUTRAL scale, annotated with the role each step feeds — the "showcase
 * how it's applied" view. Tinted only as much as the user's neutralTint slider.
 */
export function neutralScale(input: ThemeInput) {
  const r = derivedRamp(input.brand.h, neutralChroma(input));
  const ROLE_BY_STEP: Record<number, string> = {
    50: 'surface',
    100: 'background',
    200: 'border',
    400: 'borderStrong',
    600: 'textSubtle',
    900: 'text',
    950: 'backgroundInverse',
  };
  return STEPS.map((step) => ({ step, value: r[step]!, role: ROLE_BY_STEP[step] }));
}

export function generateTheme(input: ThemeInput) {
  const p = resolvePersonality(input.personality, input.personalityVariant);
  const o = resolveObjective(input.objective, input.objectiveVariant);

  const neutral = derivedRamp(input.brand.h, neutralChroma(input));
  const brandHex = oklchToHex(input.brand); // exact, gamut-mapped, pasteable
  const onFor = (l: number) => (l < 0.6 ? neutral[50]! : neutral[900]!);

  // Accent hue-only → fixed accessible steps.
  const accentHue = input.accentHue ?? input.brand.h;
  const accentTints = derivedRamp(accentHue, 0.15);

  // Sentiment: hue pulled toward brand (harmonious), chroma tracks personality.
  const sentiment = Object.fromEntries(
    (Object.keys(SENTIMENT_ANCHOR) as (keyof typeof SENTIMENT_ANCHOR)[]).map((k) => {
      const hue = lerpHue(SENTIMENT_ANCHOR[k], input.brand.h, 0.16);
      return [k, sentimentGroup(derivedRamp(hue, SENTIMENT_BASE_CHROMA * p.chroma))];
    }),
  ) as Record<keyof typeof SENTIMENT_ANCHOR, ReturnType<typeof sentimentGroup>>;

  const colorTree = {
    background: neutral[100]!,
    surface: neutral[50]!,
    overlay: oklchCss({ l: STEP_L[950]!, c: neutralChroma(input), h: input.brand.h }, 0.55),
    overlaySubtle: oklchCss({ l: STEP_L[950]!, c: neutralChroma(input), h: input.brand.h }, 0.06),
    backgroundInverse: neutral[950]!,
    surfaceInverse: neutral[900]!,
    text: neutral[900]!,
    textSubtle: neutral[600]!,
    textInverse: neutral[50]!,
    textInverseSubtle: neutral[400]!,
    border: neutral[200]!,
    borderStrong: neutral[400]!,
    borderSubtle: neutral[100]!,
    borderInverse: neutral[700]!,
    // Faithful brand color fills the CTA; on-color computed from its own L.
    primary: brandHex,
    onPrimary: onFor(input.brand.l),
    // Accent roles: fixed accessible steps (700 mark / 800 hover / 100 tint / 600 focus).
    accent: accentTints[700]!,
    accentHover: accentTints[800]!,
    accentSubtle: accentTints[100]!,
    onAccent: neutral[50]!,
    focusRing: accentTints[600]!,
    positive: sentiment.positive,
    negative: sentiment.negative,
    warn: sentiment.warn,
    info: sentiment.info,
  };

  const radiusTree = {
    control: `${p.radius.control}px`,
    surface: `${p.radius.surface}px`,
    full: `${p.radius.full}px`,
  };

  const spaceTree = Object.fromEntries(
    Object.entries(o.space).map(([k, v]) => [k, `${v}px`]),
  ) as Record<keyof ObjectiveTraits['space'], string>;

  const controlHeightTree = Object.fromEntries(
    Object.entries(o.controlHeight).map(([k, v]) => [k, `${v}px`]),
  ) as Record<keyof ObjectiveTraits['controlHeight'], string>;

  const fontFamilyTree = resolveFaces(p.serifDisplay, o.fonts.display);

  const fontWeightTree = {
    regular: String(p.weight.regular),
    medium: String(p.weight.medium),
    semibold: String(p.weight.semibold),
    bold: String(p.weight.bold),
  };

  const textTree = Object.fromEntries(
    (Object.keys(BASE_TYPE) as (keyof typeof BASE_TYPE)[]).map((k) => {
      const t = BASE_TYPE[k];
      // Enforce the rendered-px floor: raise fontSize if a dense type-scale
      // would push a functional/body step below the legibility minimum.
      const floorRem = (MIN_PX[k] ?? 0) / ROOT_PX;
      const sizeRem = Math.max(t.size * o.typeScale, floorRem);
      const leading = DISPLAY_STEPS.has(k) ? t.lineHeight : Math.max(t.lineHeight, MIN_LEADING);
      return [
        k,
        {
          fontSize: `${Math.round(sizeRem * 1e4) / 1e4}rem`,
          lineHeight: String(leading),
          fontWeight: String(p.weight[t.weight]),
          letterSpacing: `${t.tracking}em`,
        },
      ];
    }),
  );

  return {
    color: colorTree,
    radius: radiusTree,
    space: spaceTree,
    controlHeight: controlHeightTree,
    fontFamily: fontFamilyTree,
    fontWeight: fontWeightTree,
    text: textTree,
  };
}

// ---- Flatten to CSS custom-property overrides ------------------------------
function varName(reference: string): string {
  const match = reference.match(/^var\((--[^,)]+)/);
  if (!match?.[1]) throw new Error(`Not a CSS var reference: ${reference}`);
  return match[1];
}

function collect(refNode: unknown, valNode: unknown, out: Record<string, string>): void {
  if (typeof refNode === 'string') {
    if (typeof valNode === 'string') out[varName(refNode)] = valNode;
    return;
  }
  if (refNode && typeof refNode === 'object' && valNode && typeof valNode === 'object') {
    for (const key of Object.keys(refNode as Record<string, unknown>)) {
      collect(
        (refNode as Record<string, unknown>)[key],
        (valNode as Record<string, unknown>)[key],
        out,
      );
    }
  }
}

const REFERENCES = { color, radius, space, controlHeight, fontFamily, fontWeight, text };

/**
 * Flattens a generated theme into `{ '--var': value }`, matched against the real
 * token references so the emitted custom properties are exactly the ones every
 * component already consumes. Apply as inline style on a wrapper that also
 * carries a real compiled theme class (the base other tokens fall back to).
 */
export function toOverrides(input: ThemeInput): Record<string, string> {
  const generated = generateTheme(input);
  const out: Record<string, string> = {};
  for (const key of Object.keys(REFERENCES) as (keyof typeof REFERENCES)[]) {
    collect(REFERENCES[key], generated[key], out);
  }
  return out;
}

// ---- UI option metadata ----------------------------------------------------
export const PERSONALITY_OPTIONS = (Object.keys(PERSONALITIES) as PersonalityId[]).map((id) => ({
  id,
  label: PERSONALITIES[id].label,
  variants: PERSONALITIES[id].variants.map((v) => ({ id: v.id, label: v.label, blurb: v.blurb })),
}));

export const OBJECTIVE_OPTIONS = (Object.keys(OBJECTIVES) as ObjectiveId[]).map((id) => ({
  id,
  label: OBJECTIVES[id].label,
  variants: OBJECTIVES[id].variants.map((v) => ({ id: v.id, label: v.label, blurb: v.blurb })),
}));
