/**
 * Contrast math — measure a pair, or solve for the value that hits a target.
 *
 * Zero dependencies: measuring a pair is a dozen lines and solving "what value
 * of this hue clears 4.5:1 against that background" is a binary search — not
 * worth a library's transitive dependency and advisory surface.
 *
 * Measurement only. Which pairs must hold lives in the sanctioned-pairs table;
 * this file is what that data is checked with, so nothing here imports a theme.
 *
 * Measurement works in sRGB (where WCAG contrast is defined); solving works in
 * OKLCH, since "hold hue and chroma, move lightness" is only meaningful in a
 * perceptually uniform space.
 */

/** An `#RRGGBB` string. Shorthand (`#RGB`) is deliberately not accepted — theme values are always full-length. */
export type Hex = string;

/** sRGB channels, 0–1. */
type Rgb = { r: number; g: number; b: number };

/** OKLCH: lightness 0–1, chroma 0–~0.4, hue in degrees. */
export type Oklch = { l: number; c: number; h: number };

// ---- sRGB ----

export function parseHex(hex: Hex): Rgb {
  const s = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(s)) {
    throw new Error(`parseHex: expected #RRGGBB, got "${hex}"`);
  }
  return {
    r: parseInt(s.slice(0, 2), 16) / 255,
    g: parseInt(s.slice(2, 4), 16) / 255,
    b: parseInt(s.slice(4, 6), 16) / 255,
  };
}

function toHex({ r, g, b }: Rgb): Hex {
  const ch = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

/**
 * sRGB → linear. Threshold is `0.03928` (what WCAG 2.x publishes and axe-core
 * implements), not the corrected `0.04045` — matching the checker this project
 * is judged against beats matching the spec errata; they disagree only in the
 * eighth decimal of luminance.
 */
function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance. */
export function luminance(hex: Hex): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG 2.x contrast ratio, 1–21. Order-independent: contrast is a property of
 * the pair, not of a foreground or a background.
 */
export function contrast(a: Hex, b: Hex): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Rounded to 2dp — the precision worth reporting or asserting on. */
export function ratio(a: Hex, b: Hex): number {
  return Math.round(contrast(a, b) * 100) / 100;
}

// ---- OKLCH ----
//
// Björn Ottosson's Oklab, plus the sRGB transfer functions.

function encode(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function decode(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const bb = c * Math.sin(rad);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * bb) ** 3;

  return {
    r: encode(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: encode(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: encode(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  };
}

export function rgbToOklch(hex: Hex): Oklch {
  const { r, g, b } = parseHex(hex);
  const lr = decode(r);
  const lg = decode(g);
  const lb = decode(b);

  const l_ = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m_ = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s_ = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );

  const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const h = (Math.atan2(bb, a) * 180) / Math.PI;
  return { l, c: Math.sqrt(a * a + bb * bb), h: h < 0 ? h + 360 : h };
}

function inGamut({ r, g, b }: Rgb): boolean {
  const ok = (v: number) => v >= -0.0001 && v <= 1.0001;
  return ok(r) && ok(g) && ok(b);
}

/**
 * Gamut-map by reducing chroma at fixed lightness and hue. Clipping RGB
 * channels instead would shift hue and lightness, breaking the "one hue per
 * palette" invariant.
 */
export function toGamut(target: Oklch): Oklch {
  if (inGamut(oklchToRgb(target))) return target;
  let lo = 0;
  let hi = target.c;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb({ ...target, c: mid }))) lo = mid;
    else hi = mid;
  }
  return { ...target, c: lo };
}

export function oklchToHex(target: Oklch): Hex {
  return toHex(oklchToRgb(toGamut(target)));
}

// ---- Solve ----

export type SolveOptions = {
  /** The hue/chroma to preserve. Pass an existing swatch to re-step it in place. */
  base: Hex | Oklch;
  /** The color the result is measured against. */
  against: Hex;
  /** Target WCAG ratio, e.g. 4.5 for AA body text, 3 for icons and UI boundaries. */
  target: number;
  /**
   * Which side of `against` to land on. `'auto'` picks whichever direction can
   * actually reach the target, preferring the one with more headroom — the
   * right default when re-deriving a scale whose steps span both sides.
   */
  direction?: 'darker' | 'lighter' | 'auto';
};

export type SolveResult = {
  hex: Hex;
  /** What the result actually measures. Can fall short — see `reached`. */
  ratio: number;
  /** False when even pure black/white against this reference cannot reach `target`. */
  reached: boolean;
  oklch: Oklch;
};

/**
 * Find the value of `base`'s hue that hits `target` contrast against `against`,
 * by binary search over OKLCH lightness.
 *
 * Answers "what belongs on this rung?" without a generator dependency. The
 * output is a starting value to review and adjust, not a committed artifact.
 *
 * Chroma is preserved where the gamut allows and reduced where it doesn't
 * (see `toGamut`). Note that reducing chroma also raises luminance slightly, so
 * for very saturated hues the returned ratio can differ from `target` by more
 * than the search tolerance; `ratio` always reports the truth, and `reached`
 * says whether the target was actually met.
 */
export function solveForContrast(options: SolveOptions): SolveResult {
  const { against, target, direction = 'auto' } = options;
  const base =
    typeof options.base === 'string' ? rgbToOklch(options.base) : options.base;

  const at = (l: number) => oklchToHex({ ...base, l });
  const ratioAt = (l: number) => contrast(at(l), against);

  const search = (dir: 'darker' | 'lighter'): SolveResult => {
    // Lightness is monotonic against contrast on each side of the reference, so
    // a plain bisection is sound. Bounds are the extremes of the ramp: the
    // darkest possible value of this hue, or the lightest.
    let lo = dir === 'darker' ? 0 : base.l;
    let hi = dir === 'darker' ? base.l : 1;
    // The base may sit on the wrong side of the reference entirely (e.g. a pale
    // accent asked to go darker); open the bound to the full range if so.
    if (dir === 'darker' && ratioAt(0) < target) lo = 0;
    if (dir === 'darker') hi = 1;
    else lo = 0;

    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const r = ratioAt(mid);
      // Darker => lower lightness raises contrast against a light reference.
      if (dir === 'darker') {
        if (r < target) hi = mid;
        else lo = mid;
      } else {
        if (r < target) lo = mid;
        else hi = mid;
      }
    }
    const l = dir === 'darker' ? lo : hi;
    const hex = at(l);
    const got = contrast(hex, against);
    return {
      hex,
      ratio: Math.round(got * 100) / 100,
      reached: got >= target - 0.005,
      oklch: toGamut({ ...base, l }),
    };
  };

  if (direction !== 'auto') return search(direction);

  const darker = search('darker');
  const lighter = search('lighter');
  if (darker.reached && lighter.reached) {
    // Both work — prefer the one that overshoots least, so a rung stays as close
    // to its neighbors as the target allows rather than slamming to an extreme.
    return darker.ratio - target <= lighter.ratio - target ? darker : lighter;
  }
  if (darker.reached) return darker;
  if (lighter.reached) return lighter;
  // Neither reached: return whichever got closest, with `reached: false`.
  return darker.ratio >= lighter.ratio ? darker : lighter;
}

// ---- Thresholds ----

/**
 * WCAG 2.x minimums, named. Values are the standard's — a house margin belongs
 * in the rules table, not baked into the vocabulary.
 */
export const WCAG = {
  /** 1.4.3 — body text. */
  text: 4.5,
  /** 1.4.3 — text ≥18.66px bold or ≥24px. */
  largeText: 3,
  /** 1.4.11 — icons, and the boundary that identifies a control. */
  nonText: 3,
  /** 1.4.6 — enhanced body text. */
  textEnhanced: 7,
} as const;

export function meets(a: Hex, b: Hex, threshold: number): boolean {
  return contrast(a, b) >= threshold;
}
