import { describe, it, expect } from 'vitest';
import { contrast, WCAG } from '@/validate/contrast';
import type { Hex } from '@/validate/contrast';
import { pearlSentiment } from './pearl/pearl.css';
import { tahitianSentiment } from './tahitian/tahitian.css';
import { freshwaterSentiment } from './freshwater/freshwater.css';
import { southSeaSentiment } from './south-sea/south-sea.css';

/**
 * Sanctioned pairs for the solid sentiment treatment — `fill` / `onFill`, the
 * one high-emphasis pair beside the tinted `surface`/`border`/`text`/`icon`
 * set (see tokens.ts).
 *
 * The rule every theme follows, per mode:
 *   light  — fill = ramp step 400 (vivid mid), onFill = step 800 (near-black)
 *   dark   — fill = ramp step 600 (deep),      onFill = step 100 (near-white)
 * The pair flips inside `[data-inverse]` like every other colour token.
 *
 * Values are the primitives, listed explicitly rather than read back from
 * `vars` (createTheme returns var refs, not colours) — a step reassignment
 * that forgets this table fails here, not silently.
 */
type Ramp = Record<number, Hex>;

const ramps: [string, Ramp][] = [
  ['pearl positive', pearlSentiment.algae],
  ['pearl negative', pearlSentiment.coral],
  ['pearl warn', pearlSentiment.sunlight],
  ['pearl info', pearlSentiment.tide],
  ['tahitian positive', tahitianSentiment.kelp],
  ['tahitian negative', tahitianSentiment.reef],
  ['tahitian warn', tahitianSentiment.dawn],
  ['tahitian info', tahitianSentiment.wave],
  ['freshwater positive', freshwaterSentiment.spring],
  ['freshwater negative', freshwaterSentiment.canyon],
  ['freshwater warn', freshwaterSentiment.sulphur],
  ['freshwater info', freshwaterSentiment.pool],
  ['south-sea positive', southSeaSentiment.seaMoss],
  ['south-sea negative', southSeaSentiment.anemone],
  ['south-sea warn', southSeaSentiment.shell],
  ['south-sea info', southSeaSentiment.pacific],
];

const step = (r: Ramp, n: number): Hex => {
  const hex = r[n];
  if (!hex) throw new Error(`ramp step ${n} missing`);
  return hex;
};

const pairs = ramps.flatMap(([name, r]) => [
  { name: `${name} (light)`, fill: step(r, 400), onFill: step(r, 800) },
  { name: `${name} (dark)`, fill: step(r, 600), onFill: step(r, 100) },
]);

describe.each(pairs)('$name', ({ fill, onFill }) => {
  it('reads `onFill` on the `fill` background at AA', () => {
    expect(contrast(onFill, fill)).toBeGreaterThanOrEqual(WCAG.text);
  });
});
