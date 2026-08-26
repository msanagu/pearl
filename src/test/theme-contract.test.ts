import type { MapLeafNodes } from '@vanilla-extract/private';
import { describe, expect, it } from 'vitest';

import { vars } from '../theme.css';
import { freshwaterLightThemeClass, freshwaterDarkThemeClass } from '../themes/freshwater.css';
import { pearlLightThemeClass, pearlDarkThemeClass } from '../themes/pearl.css';
import { southSeaLightThemeClass, southSeaDarkThemeClass } from '../themes/south-sea.css';
import { tahitianLightThemeClass, tahitianDarkThemeClass } from '../themes/tahitian.css';

/**
 * The shape `createTheme(vars, …)` demands: every leaf of the `vars` contract,
 * as a string. This is the type a theme implementation must satisfy.
 */
type ThemeTokens = MapLeafNodes<typeof vars, string>;

/**
 * Completeness is a COMPILE-TIME guarantee, not a runtime one — `createTheme`
 * rejects an incomplete token object before the code ever runs. The previous
 * version of this file tried to assert it at runtime by diffing `vars` against
 * the theme export, but `createTheme` returns a class-name *string*, not the
 * token object, so the comparison was against a primitive and every key
 * reported missing. It could not pass, and had been failing unnoticed —
 * a second system drifting from the one that actually holds the contract.
 *
 * So the assertion moved to where the guarantee actually lives: the type
 * checker. `pnpm typecheck` failing IS the contract test.
 */
describe('theme contract (compile-time)', () => {
  it('rejects a theme missing required tokens', () => {
    // @ts-expect-error — omits every token but one; if this line ever stops
    // erroring, the contract has gone soft and themes can ship incomplete.
    const incomplete: ThemeTokens = { color: { background: '#fff' } };
    void incomplete;
    expect(true).toBe(true);
  });
});

describe('theme registration (runtime)', () => {
  const themes = {
    'pearl / light': pearlLightThemeClass,
    'pearl / dark': pearlDarkThemeClass,
    'tahitian / light': tahitianLightThemeClass,
    'tahitian / dark': tahitianDarkThemeClass,
    'freshwater / light': freshwaterLightThemeClass,
    'freshwater / dark': freshwaterDarkThemeClass,
    'south-sea / light': southSeaLightThemeClass,
    'south-sea / dark': southSeaDarkThemeClass,
  };

  it.each(Object.entries(themes))('%s compiles to a class name', (_name, themeClass) => {
    expect(typeof themeClass).toBe('string');
    expect(themeClass.length).toBeGreaterThan(0);
  });

  it('every theme class is distinct', () => {
    const values = Object.values(themes);
    expect(new Set(values).size).toBe(values.length);
  });
});
