import { describe, expect, it } from 'vitest';
// Wrap Impeccable's OWN rule data as the oracle: the generator provably can't
// emit what these lists forbid. If Impeccable updates its font list, this test
// starts failing until the generator complies — that's the point of importing
// their data rather than copying it. (Mode A, the generation-time half of the
// Impeccable integration; Mode B is the live browser audit in the story.)
import { GENERIC_FONTS, OVERUSED_FONTS } from 'impeccable';
import {
  DEFAULT_INPUT,
  OBJECTIVE_OPTIONS,
  PERSONALITY_OPTIONS,
  generateTheme,
  type ObjectiveId,
  type PersonalityId,
  type ThemeInput,
  type BrandColor,
} from './generateTheme';

const OVERUSED = new Set([...OVERUSED_FONTS].map((f) => f.toLowerCase()));
const GENERIC = new Set([...GENERIC_FONTS].map((f) => f.toLowerCase()));

/** First non-generic family named in a CSS font stack, normalized. */
function primaryFamily(stack: string): string {
  const named = stack
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, '').toLowerCase())
    .find((f) => f.length > 0 && !GENERIC.has(f));
  return named ?? '';
}

/** Every personality×variant × objective×variant combination. */
function allInputs(brand: BrandColor): ThemeInput[] {
  const out: ThemeInput[] = [];
  for (const p of PERSONALITY_OPTIONS) {
    for (const pv of p.variants) {
      for (const o of OBJECTIVE_OPTIONS) {
        for (const ov of o.variants) {
          out.push({
            brand,
            accentHue: null,
            neutralTint: 0.2,
            personality: p.id as PersonalityId,
            personalityVariant: pv.id,
            objective: o.id as ObjectiveId,
            objectiveVariant: ov.id,
          });
        }
      }
    }
  }
  return out;
}

const brands: BrandColor[] = [
  DEFAULT_INPUT.brand,
  { l: 0.62, c: 0.16, h: 30 }, // warm
  { l: 0.45, c: 0.09, h: 265 }, // the user could still pick purple
  { l: 0.8, c: 0.05, h: 95 }, // pale
];

describe('generateTheme satisfies Impeccable generation-time rules', () => {
  const combos = brands.flatMap((b) => allInputs(b));

  it('never emits an overused font (Impeccable `overused-font`)', () => {
    for (const input of combos) {
      const { fontFamily } = generateTheme(input);
      for (const role of ['display', 'heading', 'body'] as const) {
        const fam = primaryFamily(fontFamily[role]);
        expect(OVERUSED.has(fam), `${role} face "${fam}"`).toBe(false);
      }
    }
  });

  it('always pairs a distinct display + body face (Impeccable `single-font`)', () => {
    for (const input of combos) {
      const { fontFamily } = generateTheme(input);
      expect(primaryFamily(fontFamily.display)).not.toBe(primaryFamily(fontFamily.body));
    }
  });

  it('never renders text below the legibility floor (Impeccable `tiny-text` / `undersized-ui-text`)', () => {
    const floors: Record<string, number> = { caption: 11, bodySm: 12, bodyMd: 12, bodyLg: 12 };
    for (const input of combos) {
      const { text } = generateTheme(input);
      for (const [step, minPx] of Object.entries(floors)) {
        const rem = parseFloat(text[step as keyof typeof text]!.fontSize);
        expect(rem * 16, `${step} @ ${input.objective}/${input.objectiveVariant}`).toBeGreaterThanOrEqual(minPx);
      }
    }
  });

  it('never sets multi-line leading below 1.3 (Impeccable `tight-leading`)', () => {
    const multiline = ['caption', 'bodySm', 'bodyMd', 'bodyLg', 'headingSm', 'headingMd', 'headingLg'] as const;
    for (const input of combos) {
      const { text } = generateTheme(input);
      for (const step of multiline) {
        expect(parseFloat(text[step]!.lineHeight), step).toBeGreaterThanOrEqual(1.3);
      }
    }
  });

  it('default brand seed avoids the AI purple/violet and cream defaults (Impeccable `ai-color-palette` / `cream-palette`)', () => {
    const { h, c } = DEFAULT_INPUT.brand;
    expect(h < 255 || h > 330, `hue ${h} is in the purple/violet band`).toBe(true);
    const isCream = h >= 40 && h <= 110 && c < 0.05;
    expect(isCream, 'default reads as warm cream').toBe(false);
  });
});
