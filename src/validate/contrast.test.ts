import { describe, it, expect } from 'vitest';
import {
  contrast,
  ratio,
  luminance,
  rgbToOklch,
  oklchToHex,
  solveForContrast,
  parseHex,
  WCAG,
} from './contrast';

describe('contrast measurement', () => {
  it('anchors at the ends of the WCAG range', () => {
    expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('is order-independent — contrast belongs to the pair, not a role', () => {
    expect(contrast('#3B2C1F', '#E8A484')).toBeCloseTo(
      contrast('#E8A484', '#3B2C1F'),
      10,
    );
  });

  it('matches independently computed ratios for real theme pairs', () => {
    // South Sea: onPrimary (driftwood 750) on the conch primary fill.
    expect(ratio('#3B2C1F', '#E8A484')).toBe(6.43);
    // South Sea dark: onAccent candidate (driftwood 900) on the same fill.
    expect(ratio('#241A11', '#E8A484')).toBe(8.18);
    // Pearl: sentiment `algae` text step on its own surface step.
    expect(ratio('#2C4A32', '#E8EDE6')).toBe(8.29);
  });

  it('rejects malformed input rather than silently coercing', () => {
    expect(() => parseHex('#FFF')).toThrow();
    expect(() => parseHex('E8A484')).not.toThrow(); // a missing # is tolerated
    expect(() => parseHex('#GGGGGG')).toThrow();
  });

  it('orders luminance as expected', () => {
    expect(luminance('#FFFFFF')).toBeCloseTo(1, 5);
    expect(luminance('#000000')).toBeCloseTo(0, 5);
  });
});

describe('OKLCH conversion', () => {
  it('round-trips a hex through OKLCH within one 8-bit step', () => {
    for (const hex of [
      '#E8A484',
      '#F5EFE4',
      '#241A11',
      '#3B2C1F',
      '#0A9E6E',
      '#5A8CF0',
    ]) {
      expect(oklchToHex(rgbToOklch(hex))).toBe(hex);
    }
  });

  it('preserves hue when only lightness changes', () => {
    const base = rgbToOklch('#E8A484');
    const darker = rgbToOklch(oklchToHex({ ...base, l: base.l - 0.2 }));
    expect(darker.h).toBeCloseTo(base.h, 0);
  });

  it('gamut-maps by reducing chroma rather than clipping channels', () => {
    // An impossible chroma for this hue at this lightness — must still return a
    // valid hex whose hue survived.
    const wild = { l: 0.6, c: 0.4, h: 19 };
    const mapped = rgbToOklch(oklchToHex(wild));
    expect(mapped.h).toBeCloseTo(19, 0);
    expect(mapped.c).toBeLessThan(0.4);
  });
});

describe('solveForContrast', () => {
  it('hits an AA text target against a light background', () => {
    const r = solveForContrast({
      base: '#E8A484',
      against: '#F5EFE4',
      target: WCAG.text,
      direction: 'darker',
    });
    expect(r.reached).toBe(true);
    expect(r.ratio).toBeGreaterThanOrEqual(4.5);
    // Solving must not drift the hue — that is the invariant the themes are
    // verified against. The tolerance is 2°, not 0, because emitting 8-bit hex
    // quantizes: re-reading any darkened step of this hue lands anywhere in
    // ~45.6°–46.1° purely from rounding, with no error in the conversion
    // itself (verified against published OKLCH values for #FF0000/#0000FF).
    // 2° is comfortably below the ~15° drift that flagged `sand`'s taupe as a
    // genuine outlier, so this still catches real hue breakage.
    const drift = Math.abs(rgbToOklch(r.hex).h - rgbToOklch('#E8A484').h);
    expect(drift).toBeLessThan(2);
  });

  it('hits a non-text target against a dark background', () => {
    const r = solveForContrast({
      base: '#E8A484',
      against: '#241A11',
      target: WCAG.nonText,
      direction: 'lighter',
    });
    expect(r.reached).toBe(true);
    expect(r.ratio).toBeGreaterThanOrEqual(3);
  });

  it('reports honestly when a target is unreachable', () => {
    // Nothing clears 21:1 against mid-grey — the maximum against #808080 is
    // well under it in both directions.
    const r = solveForContrast({
      base: '#E8A484',
      against: '#808080',
      target: 21,
    });
    expect(r.reached).toBe(false);
    expect(r.ratio).toBeLessThan(21);
  });

  it('auto-direction finds a solution without being told which way to go', () => {
    const r = solveForContrast({
      base: '#E8A484',
      against: '#F5EFE4',
      target: 7,
    });
    expect(r.reached).toBe(true);
    expect(r.ratio).toBeGreaterThanOrEqual(7);
  });
});
