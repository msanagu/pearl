import type { ReactNode } from 'react';
import { PiMagnifyingGlass, PiGithubLogo, PiTerminalWindow } from 'react-icons/pi';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Icon } from '@components/Icon/Icon';
import { PearlSphere } from '@components/_brand/PearlSphere';
import { WordMark } from '@components/_brand/WordMark';
import { color, space } from '@tokens';
import * as css from './Hero.css';

export interface HeroProps {
  /** Where the primary "Read the docs" CTA points. @default '#' */
  readDocsHref?: string;
  /** Where the secondary "Open playground" CTA points. @default '#' */
  playgroundHref?: string;
  githubHref?: string;
  sandboxHref?: string;
  /** Nav wordmark text. @default 'pearl' */
  brandName?: string;
  /** Typography role decorating the wordmark, or `undefined` for plain text
   * (Tahitian's brand mark stays undecorated — overtone is reserved for
   * `imageOverlay` and one emphasized word). @default 'inlineEmphasis' */
  brandRole?: 'inlineEmphasis';
}

const stats = [
  {
    n: '01',
    label: 'Self-documenting by construction',
    description: 'Every capability ships with its own usage guidance, attached to the code that defines it.',
  },
  {
    n: '02',
    label: "Rules that can't drift",
    description: "The type system rejects a theme whose guidance doesn't match what it actually declares.",
  },
  {
    n: '03',
    label: 'Smart defaults, flexible overrides',
    description: 'Sane behavior out of the box, with an explicit contract for where you’re meant to deviate.',
  },
  {
    n: '04',
    label: 'Infinite themes, one contract',
    description: 'Every theme satisfies the same interface, so nothing custom-built has to reinvent the rules.',
  },
];

const iconLinkStyle = { color: 'inherit', display: 'flex' } as const;
const HERO_CONTENT_MAX_WIDTH = 1200;
const HERO_BAND_MAX_WIDTH = `calc(${HERO_CONTENT_MAX_WIDTH}px + ${space.xl} + ${space.xl})`;
const heroContentStyle = {
  maxWidth: HERO_CONTENT_MAX_WIDTH,
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  boxSizing: 'border-box',
  margin: '0 auto',
} as const;

/** The minimal landing utility nav — no section links, only search/sandbox/GitHub. */
export function HeroNav({
  githubHref = '#',
  sandboxHref = '#',
  brandName = 'pearl',
  // No default: `undefined` here means "no role" (Text's own semantics for
  // an unset `role`). Defaulting to `'inlineEmphasis'` would silently win
  // over a caller explicitly passing `brandRole={undefined}` — exactly what
  // Tahitian's plain-white wordmark needs, since JS default params trigger
  // on `undefined` regardless of whether the caller meant "unset".
  brandRole,
}: Pick<HeroProps, 'githubHref' | 'sandboxHref' | 'brandName' | 'brandRole'>): ReactNode {
  return (
    <Row justify="between" align="center" style={{ width: '100%' }}>
      <WordMark text={brandName} role={brandRole} />
      <Row gap="lg" align="center">
        <button
          type="button"
          aria-label="Search"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', display: 'flex' }}
        >
          <Icon icon={PiMagnifyingGlass} size={20} />
        </button>
        <a href={sandboxHref} aria-label="Sandbox" style={iconLinkStyle}>
          <Icon icon={PiTerminalWindow} size={20} />
        </a>
        <a href={githubHref} aria-label="GitHub" style={iconLinkStyle}>
          <Icon icon={PiGithubLogo} size={20} />
        </a>
      </Row>
    </Row>
  );
}

/**
 * The Pearl marketing hero — composed from existing primitives (`Text`,
 * `Button`, `Row`, `Stack`, `Icon`, `PearlSphere`). Gaps where the system has
 * no home yet (a full-bleed layout primitive) are flagged inline rather than
 * smoothed over.
 *
 * The top bar is deliberately minimal utility chrome, NOT the docs sidebar
 * pulled up early.
 */
export function Hero({
  readDocsHref = '#',
  playgroundHref = '#',
  githubHref = '#',
  sandboxHref = '#',
  brandName = 'pearl',
  // No default — see the matching comment on `HeroNav`.
  brandRole,
}: HeroProps) {
  return (
    <Stack>
      {/* GAP — no Nav/Header layout primitive. Utility chrome only. */}
      <div>
        <Row style={{ ...heroContentStyle, borderBottom: `1px solid ${color.border}`, padding: `${space.md} 0` }}>
          <HeroNav githubHref={githubHref} sandboxHref={sandboxHref} brandName={brandName} brandRole={brandRole} />
        </Row>
      </div>

      <Row
        className={css.main}
        gap="2xl"
        align="center"
        wrap
        style={{
          maxWidth: HERO_BAND_MAX_WIDTH,
          boxSizing: 'border-box',
          margin: '0 auto',
          padding: `${space['2xl']} ${space.xl}`,
          width: '100%',
        }}
      >
        {/*
          GAP — no `<header>` composition primitive. Per docs/markup-
          philosophy.md's header/heading/preheading/subheading vocabulary,
          this preheading + h1 pair belongs inside a real `<header>` element;
          nothing in the system renders one, so it's vanilla here.
        */}
        <Stack as="header" className={css.header} gap="lg" style={{ flex: 1 }}>
          {/* A full-sentence tagline, so it reads as a quiet lead-in — NOT the
              caps `preheading` role. Uppercasing a 37-char sentence is an AI
              tell (Impeccable `all-caps-body`); caps is for short labels only. */}
          <Text prominence="subtle" as="p" typeScale="bodyMd">
            Decisive by default. Yours by design.
          </Text>
          {/* `role="inlineEmphasis"` on the trailing word is exactly the
              "the world is your *oyster*" case the role system was built for. */}
          <Text typeScale="displayLg" as="h1" style={{ margin: 0 }}>
            The world is your{' '}
            <Text as="span" role="inlineEmphasis">oyster.</Text>
          </Text>
          <Text typeScale="bodyLg" prominence="subtle" as="p" measure="lg">
            Not a doc that goes stale. A type the compiler checks. Every
            theme's rules are data — structured, queryable, and impossible to
            drift from what actually ships.
          </Text>
          <Row gap="sm">
            <a href={readDocsHref} style={{ textDecoration: 'none' }}>
              <Button variant="primary">Read the docs</Button>
            </a>
            <a href={playgroundHref} style={{ textDecoration: 'none' }}>
              <Button variant="secondary">Open playground</Button>
            </a>
          </Row>
        </Stack>

        <div className={css.sphere}>
          <PearlSphere />
        </div>
      </Row>

      <div>
        {/* GAP — no Grid composition primitive; `Row` is flex-only, and this
            strip needs an intrinsic `auto-fit` grid (see Hero.css.ts), so the
            container is vanilla. */}
        <div className={css.features} style={{ ...heroContentStyle, borderTop: `1px solid ${color.border}`, borderBottom: `1px solid ${color.border}` }}>
          {stats.map((s) => (
            <Stack className={css.feature} key={s.n} gap="sm">
              {/* Hierarchy: the LABEL is the anchor, not the index. The number
                  was `headingMd` — larger than the label it introduces, so the
                  eye landed on "01" and had to travel back for the point. It
                  keeps its mono `preheading` face (the motif is the strip's
                  character) but drops to caption size and subtle prominence,
                  which is what an ordinal actually is: a position marker, not
                  a value. `dataDigits` stays reserved for real tabular data. */}
              <Text role="preheading" as="span" typeScale="caption" prominence="subtle">
                {s.n}
              </Text>
              {/* Promoted from `bodyMd` + `weight="semibold"` to a real heading
                  step. Same intent — the loudest thing in the cell — but stated
                  through the scale rather than by bolding body text. */}
              <Text typeScale="headingSm" as="h3" style={{ margin: 0 }}>
                {s.label}
              </Text>
              {/* `measure="sm"` caps the line at ~49 characters. At the grid's
                  widest column the description would otherwise run to a single
                  slab of text wider than it is comfortable to read. */}
              <Text typeScale="bodySm" prominence="subtle" as="p" measure="sm" style={{ margin: 0 }}>
                {s.description}
              </Text>
            </Stack>
          ))}
        </div>
      </div>
    </Stack>
  );
}
