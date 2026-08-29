import { Text } from '../Text/Text';
import { color } from '../../tokens';
import type { BrandWordmark } from './brandWordmark';

/** `headingMd`'s own font size — identical `2.5rem` across all four themes
 * (`*.css.ts`'s `text.headingMd`), so `scale` can multiply this one literal
 * rather than needing to read each theme's token at runtime. */
const HEADING_MD_SIZE_REM = 2.5;

export interface WordMarkProps extends Partial<BrandWordmark> {
  /** Wordmark text. @default 'pearl' */
  text?: string;
  /**
   * Uniform size multiplier off `headingMd`, e.g. `0.6` for ~60%. Implemented
   * as a `font-size` override (not `transform: scale`): every theme's
   * `headingMd` letter-spacing/line-height is `em`/unitless (relative to
   * font-size), so shrinking font-size alone already scales tracking and
   * line-height in lockstep — the "logo" proportions stay intact — while
   * still reflowing correctly. `transform: scale` would preserve the same
   * proportions visually but leave the *layout box* at its unscaled size,
   * which reads as stray whitespace wherever the mark sits directly above a
   * rule (`ThemeSpecimen`'s header). @default 1
   */
  scale?: number;
}

/**
 * The nav wordmark, extracted from `Hero`'s `HeroNav` — text plus whether
 * `inlineEmphasis` decorates it, which differs per theme (`brandWordmark.ts`,
 * driven by each theme's own `*BrandWordmark` in `*.roles.ts`). Tahitian's
 * plain-white mark passes no `role` at all: `Text`'s own "unset" semantics,
 * not a falsy default, so `role={undefined}` is never silently overridden.
 * `ThemeSpecimen` renders this exact component (at a smaller `scale`) rather
 * than a reinterpretation of it, so the specimen shows what the wordmark
 * actually looks like, not a copy that can drift from it (previously it
 * forced its own `fontWeight: 700`, which happened to fight South Sea's
 * roman-weight italic and masked Tahitian's real Switzer/Anton pairing).
 *
 * Freshwater's `FRESHWTR_OPS` (7a/7b "Ice Console") recolors its underscore
 * alone to the theme's accent — a rendering choice, not part of the
 * wordmark data (`freshwaterBrandWordmark` carries no `role` for it), so it
 * keys off the literal `_` in `text` rather than a theme id. No other
 * wordmark contains one.
 */
export function WordMark({ text = 'pearl', role, scale = 1 }: WordMarkProps) {
  return (
    <Text
      as="span"
      role={role}
      typeScale="headingMd"
      data-component="brand-wordmark"
      style={scale !== 1 ? { fontSize: `${HEADING_MD_SIZE_REM * scale}rem` } : undefined}
    >
      {text.split(/(_)/).map((part, i) =>
        part === '_' ? (
          <span key={i} style={{ color: color.accent }}>
            _
          </span>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
