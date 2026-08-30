import { Text } from '@components/Text/Text';
import { color } from '@tokens';
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
  /** Merged with the wordmark's own recipe classes via `Text`, not a
   * replacement — the standard `className` passthrough. Added
   * when `Typography.stories.tsx` switched from a local reimplementation to
   * this real component and needed its own layout spacing preserved. */
  className?: string;
}

/**
 * The nav wordmark — text plus whether `inlineEmphasis` decorates it, which
 * differs per theme (`brandWordmark.ts`). Tahitian's plain-white mark passes
 * no `role` at all, relying on `Text`'s "unset" semantics so `role={undefined}`
 * is never silently overridden. `ThemeSpecimen` renders this exact component
 * (at a smaller `scale`) so the specimen can't drift from the real mark.
 *
 * Freshwater recolors its underscore alone to the theme's accent — a rendering
 * choice, not wordmark data — so it keys off the literal `_` in `text`. No
 * other wordmark contains one.
 */
export function WordMark({
  text = 'pearl',
  role,
  underscoreColor,
  scale = 1,
  className,
}: WordMarkProps) {
  return (
    <Text
      as="span"
      role={role}
      typeScale="headingMd"
      data-component="brand-wordmark"
      className={className}
      style={
        scale !== 1
          ? { fontSize: `${HEADING_MD_SIZE_REM * scale}rem` }
          : undefined
      }
    >
      {text.split(/(_)/).map((part, i) =>
        part === '_' ? (
          <span key={i} style={{ color: underscoreColor ?? color.accent }}>
            _
          </span>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
