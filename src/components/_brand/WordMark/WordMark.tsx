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
  /** Uniform size multiplier off `headingMd`, e.g. `0.6` for ~60%. @default 1 */
  scale?: number;
  /** Standard `className` passthrough, merged with the wordmark's own classes. */
  className?: string;
}

/** The nav wordmark. `role` and `underscoreColor` vary per theme — see `brandWordmark.ts`. */
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
      // font-size override, not transform: scale — keeps em-based
      // letter-spacing/line-height proportional and the layout box sized correctly
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
