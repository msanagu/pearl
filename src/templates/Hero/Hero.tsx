import type { MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { PearlSphere } from '@components/_brand/PearlSphere/PearlSphere';
import { color, space } from '@tokens';
import * as css from './Hero.css';

export interface HeroProps {
  /** Where the primary CTA points. Also the no-JS fallback for
   * `onPrimaryClick`. @default '#' */
  primaryHref?: string;
  /** Primary CTA label. @default 'Read the docs' */
  primaryLabel?: string;
  /** Optional click handler for the primary CTA — e.g. to smooth-scroll to a
   * section further down the page. The handler should `preventDefault()`. */
  onPrimaryClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Where the secondary CTA points. @default '#' */
  secondaryHref?: string;
  /** Secondary CTA label. @default 'Browse components' */
  secondaryLabel?: string;
  /** `target` for the secondary CTA — `'_blank'` (adds `rel="noopener
   * noreferrer"`) or `'_top'` to escape a Storybook preview iframe. */
  secondaryTarget?: string;
  /**
   * Wraps the headline, standfirst, and CTA row individually — the landing
   * page uses this to stagger their reveal without importing a motion
   * dependency into this template. Defaults to identity, so `Hero` renders
   * statically (its own story, `TemplateAudit`) when the hook isn't passed.
   */
  revealWrap?: (key: 'heading' | 'body' | 'actions', node: ReactNode) => ReactNode;
}

const identityReveal = (_key: string, node: ReactNode) => node;

/**
 * The capability strip. What may sit here: a capability the system gives a
 * consumer (not a fact about the repo), a claim cashable today (a compile
 * error, an attribute, a file in `dist/`), a one-word benefit label.
 */
const stats = [
  {
    n: '01',
    label: 'Queryable',
    description:
      "The system's usage guidance ships as machine-readable data beside the components — an LLM builds on real context, not inference.",
  },
  {
    n: '02',
    label: 'Themeable',
    description:
      'The theme is the single source of truth for color, space, and type. Four themes ship today, light and dark, and every one drives the same components with zero markup changes.',
  },
  {
    n: '03',
    label: 'Extendable',
    description:
      'Flexible composition over rigid configuration. Build UI from existing parts, not new props. A stable data-part hook is exposed for deeper styling.',
  },
  {
    n: '04',
    label: 'Accessible',
    // "Built to", not "compliant" — the full contrast sweep hasn't shipped;
    // axe plus a few pairs pinned in contrast.test.ts is the mechanism today.
    description:
      'Built to WCAG 2.2 AA with semantic HTML5. Contrast is authored against the AA thresholds and checked with axe as each story is built.',
  },
];

// Matches `Introduction.css.ts`'s content cap and `SiteHeader.css.ts`'s column
// — Hero is that page's top section, so they share one column width.
const HERO_CONTENT_MAX_WIDTH = 1440;
const HERO_BAND_MAX_WIDTH = `calc(${HERO_CONTENT_MAX_WIDTH}px + ${space.xl} + ${space.xl})`;

/**
 * The Pearl hero — one positioning statement, used as this template's story and
 * as the introduction page's top section. The masthead above it is a separate
 * template (`SiteHeader`); this is just the pitch band and the feature strip.
 * What varies by mount point (CTA destinations, link targets) is prop-driven;
 * the pitch is not.
 */
export function Hero({
  primaryHref = '#',
  primaryLabel = 'Read the docs',
  onPrimaryClick,
  secondaryHref = '#',
  secondaryLabel = 'Browse components',
  secondaryTarget,
  revealWrap = identityReveal,
}: HeroProps) {
  return (
    <Stack>
      <Row
        className={css.main}
        gap="2xl"
        align="center"
        justify="between"
        style={{
          maxWidth: HERO_BAND_MAX_WIDTH,
          boxSizing: 'border-box',
          margin: '0 auto',
          // Padding (all sides) lives in `css.main` instead — see its comment
          // on why an inline value there would block its own `NARROW` override.
          width: '100%',
        }}
      >
        {/* Plain `div` — the page's banner landmark is `SiteHeader`, so this
            headline group stays unmarked. */}
        <Stack as="div" className={css.header} gap="lg">
          {/* Explicit breaks — one phrase per line. `text-wrap` can't be
              trusted to break a headline on meaning rather than line length,
              and the break needs to hold across four themes' faces. */}
          {revealWrap(
            'heading',
            <Stack gap="sm">
              <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                An active experiment
              </Text>
              <Text typeScale="displayLg" as="h1" style={{ margin: 0 }}>
                A design system
                <br />
                coding agents
                <br />
                get right
              </Text>
            </Stack>,
          )}
          {revealWrap(
            'body',
            <Text typeScale="bodyLg" prominence="subtle" as="p" measure="lg">
              Components, tokens, and usage rules ship as machine-readable data
              in the package. An agent builds on-system code from it directly —
              no retrieval layer. All generated from source, so it's never out
              of sync.
            </Text>,
          )}
          {revealWrap(
            'actions',
            // `wrap`: at narrow widths the two buttons together are wider
            // than the header column (which shrinks to fit — see `header`'s
            // `min-width: 0`); unwrapped, the second button overflowed off
            // the viewport edge instead of dropping to its own line.
            <Row className={css.actions} gap="sm" wrap>
              <a
                href={primaryHref}
                onClick={onPrimaryClick}
                style={{ textDecoration: 'none' }}
              >
                <Button variant="primary">{primaryLabel}</Button>
              </a>
              <a
                href={secondaryHref}
                target={secondaryTarget}
                rel={
                  secondaryTarget === '_blank'
                    ? 'noopener noreferrer'
                    : undefined
                }
                style={{ textDecoration: 'none' }}
              >
                <Button variant="secondary">{secondaryLabel}</Button>
              </a>
            </Row>,
          )}
        </Stack>

        {/* The one sphere that reveals — blurs into focus on mount rather than
            rendering painted. Its own CSS animation, not `revealWrap`: the
            text stagger fades whole blocks, this is one element's own
            entrance. */}
        <div className={css.sphere}>
          <PearlSphere reveal />
        </div>
      </Row>

      <div>
        {/* No Grid component — this strip needs an intrinsic `auto-fit` grid
            (see Hero.css.ts), so the container is vanilla. */}
        <div
          className={clsx(css.features, css.content)}
          style={{
            maxWidth: HERO_CONTENT_MAX_WIDTH,
            margin: '0 auto',
            borderTop: `1px solid ${color.border}`,
            borderBottom: `1px solid ${color.border}`,
          }}
        >
          {stats.map((s) => (
            <Stack className={css.feature} key={s.n} gap="sm">
              {/* The label is the anchor, not the index — the ordinal keeps the
                  mono `preheading` face but stays caption-sized and subtle. */}
              <Text
                role="preheading"
                as="span"
                typeScale="caption"
                prominence="subtle"
              >
                {s.n}
              </Text>
              {/* A feature-grid label, not a document section — `p`, not a
                  heading, so it doesn't skip a level under the `h1` above.
                  `headingSm` still carries the theme's heading face/weight. */}
              <Text typeScale="headingSm" as="p" style={{ margin: 0 }}>
                {s.label}
              </Text>
              <Text
                typeScale="bodySm"
                prominence="subtle"
                as="p"
                measure="sm" // caps the line at ~49 characters
                style={{ margin: 0 }}
              >
                {s.description}
              </Text>
            </Stack>
          ))}
        </div>
      </div>
    </Stack>
  );
}
