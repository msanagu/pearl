import type { ReactNode } from 'react';
import { PiMagnifyingGlass, PiGithubLogo, PiTerminalWindow } from 'react-icons/pi';
import { Text } from '../../components/Text/Text';
import { Button } from '../../components/Button/Button';
import { Row } from '../../components/Row/Row';
import { Stack } from '../../components/Stack/Stack';
import { Icon } from '../../components/Icon/Icon';
import { PearlSphere } from '../../brand/PearlSphere';
import { color, space } from '../../tokens';
import * as css from './Hero.css';

export interface HeroProps {
  /**
   * Render the minimal utility nav (wordmark + search/sandbox/GitHub).
   * Set `false` when a parent (e.g. the docs shell) owns one persistent
   * sticky bar spanning both landing and docs — the landing nav is utility
   * chrome, not docs navigation, so it must not be duplicated.
   * @default true
   */
  showNav?: boolean;
  /** Where the primary "Read the docs" CTA points. @default '#' */
  readDocsHref?: string;
  /** Where the secondary "Open playground" CTA points. @default '#' */
  playgroundHref?: string;
  githubHref?: string;
  sandboxHref?: string;
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
export function HeroNav({ githubHref = '#', sandboxHref = '#' }: Pick<HeroProps, 'githubHref' | 'sandboxHref'>): ReactNode {
  return (
    <Row justify="between" align="center" style={{ width: '100%' }}>
      <Text as="span" role="inlineEmphasis" typeScale="headingMd">
        pearl
      </Text>
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
 * no home yet (a full-bleed layout primitive, a `measure` prop on `Text`)
 * are flagged inline rather than smoothed over.
 *
 * The top bar is deliberately
 * minimal utility chrome, NOT the docs sidebar pulled up early. Pass
 * `showNav={false}` when a docs shell owns one persistent bar for both.
 */
export function Hero({
  showNav = true,
  readDocsHref = '#',
  playgroundHref = '#',
  githubHref = '#',
  sandboxHref = '#',
}: HeroProps) {
  return (
    <Stack>
      {showNav && (
        // GAP — no Nav/Header layout primitive. Utility chrome only.
        <div>
          <Row style={{ ...heroContentStyle, borderBottom: `1px solid ${color.border}`, padding: `${space.md} 0` }}>
            <HeroNav githubHref={githubHref} sandboxHref={sandboxHref} />
          </Row>
        </div>
      )}

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
          {/* GAP — no `measure` prop on `Text` yet to cap prose line length;
              `maxWidth` via the style escape hatch stands in for now. */}
          <Text typeScale="bodyLg" prominence="subtle" as="p" style={{ maxWidth: '52ch' }}>
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
        <Row className={css.features} style={{ ...heroContentStyle, borderTop: `1px solid ${color.border}`, borderBottom: `1px solid ${color.border}` }}>
          {/* The index numbers act as preheadings here — decorative, supporting
              the label below rather than data — so they get `role="preheading"`
              rather than `dataDigits` (reserved for real tabular/data digits). */}
          {stats.map((s, i) => (
            <Stack
              className={css.feature}
              key={s.n}
              gap="xs"
              style={{
                flex: '1 1 200px',
                padding: space.xl,
                borderLeft: i > 0 ? `1px solid ${color.border}` : undefined,
              }}
            >
              <Text role="preheading" as="span" typeScale="headingMd">{s.n}</Text>
              <Text typeScale="bodyMd" weight="semibold" as="span">
                {s.label}
              </Text>
              <Text typeScale="caption" prominence="subtle" as="span">
                {s.description}
              </Text>
            </Stack>
          ))}
        </Row>
      </div>
    </Stack>
  );
}
