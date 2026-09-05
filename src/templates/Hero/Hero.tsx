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
  /** @default '#' */
  primaryHref?: string;
  /** @default 'Read the docs' */
  primaryLabel?: string;
  /** Should call `preventDefault()` if provided. */
  onPrimaryClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** @default '#' */
  secondaryHref?: string;
  /** @default 'Browse components' */
  secondaryLabel?: string;
  /** `'_blank'` adds `rel="noopener noreferrer"`; `'_top'` escapes a Storybook preview iframe. */
  secondaryTarget?: string;
  /** Wraps the headline, standfirst, and CTA row individually to stagger their reveal. Defaults to identity. */
  revealWrap?: (key: 'heading' | 'body' | 'actions', node: ReactNode) => ReactNode;
}

const identityReveal = (_key: string, node: ReactNode) => node;

// Capability strip — what the system gives a consumer today, not repo trivia.
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
    // "Built to", not "compliant" — the full contrast sweep hasn't shipped yet.
    description:
      'Built to WCAG 2.2 AA with semantic HTML5. Contrast is authored against the AA thresholds and checked with axe as each story is built.',
  },
];

// Matches Introduction.css.ts content cap / SiteHeader.css.ts column width.
const HERO_CONTENT_MAX_WIDTH = 1440;
const HERO_BAND_MAX_WIDTH = `calc(${HERO_CONTENT_MAX_WIDTH}px + ${space.xl} + ${space.xl})`;

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
          // Padding lives in css.main instead, so its NARROW override isn't blocked by an inline value here.
          width: '100%',
        }}
      >
        {/* Plain div — page's banner landmark is SiteHeader, this stays unmarked. */}
        <Stack as="div" className={css.header} gap="lg">
          {/* Explicit breaks, one phrase per line — text-wrap can't be trusted to break on meaning. */}
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
            // wrap: at narrow widths the two buttons together outgrow the (shrink-to-fit) header column.
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

        {/* Blurs into focus via own CSS animation, not revealWrap (fades whole blocks). */}
        <div className={css.sphere}>
          <PearlSphere reveal />
        </div>
      </Row>

      <div>
        {/* No Grid component — this strip needs an intrinsic auto-fit grid (see Hero.css.ts). */}
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
              <Text
                role="preheading"
                as="span"
                typeScale="caption"
                prominence="subtle"
              >
                {s.n}
              </Text>
              {/* p, not a heading, so it doesn't skip a level under the h1 above. */}
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
