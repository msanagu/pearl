import type { ReactNode } from 'react';
import { PiMagnifyingGlass, PiGithubLogo } from 'react-icons/pi';
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
  /** Where the primary CTA points. @default '#' */
  primaryHref?: string;
  /** Primary CTA label. @default 'Read the docs' */
  primaryLabel?: string;
  /** Where the secondary CTA points. @default '#' */
  secondaryHref?: string;
  /** Secondary CTA label. @default 'Browse components' */
  secondaryLabel?: string;
  /** `target` applied to both CTAs — pass `'_top'` when embedding inside a
   * Storybook preview iframe, to escape it rather than navigate within it.
   * Left unset for a real, standalone deployment of this page. */
  ctaTarget?: string;
  /** The real repo, not a placeholder — there is no sandbox/playground yet,
   * so GitHub is the only external link this nav can honestly offer.
   * @default 'https://github.com/msanagu/pearl' */
  githubHref?: string;
  /** Nav wordmark text. @default 'pearl' */
  brandName?: string;
  /** Typography role decorating the wordmark, or `undefined` for plain text
   * (Tahitian's brand mark stays undecorated — overtone is reserved for
   * `imageOverlay` and one emphasized word). @default 'inlineEmphasis' */
  brandRole?: 'inlineEmphasis';
}

/**
 * Two rules govern what may sit in this strip.
 *
 * 1. **Each item is a capability the system gives a consumer** — an API shape,
 *    a theming guarantee, an extension point, a semantics guarantee. Facts
 *    about the repo *as an artifact* (how many ADRs exist, that decisions are
 *    dated, that it's a 2026 snapshot) are not features, however much they say
 *    about the project. Those belong to the introduction page, which is framed
 *    as a portfolio read; a product feature strip that slips into them reads as
 *    a tell. An earlier `04` was exactly that mistake.
 * 2. **Each claim is cashable today** — a compile error you can reproduce, an
 *    attribute you can inspect, props you can watch arrive at a call site.
 *    Claims resting on unbuilt work (the ADR-0008 manifest, the contrast sweep
 *    over sanctioned pairs) stay off this strip: a landing page that oversells
 *    is the fastest way to make everything else on it suspect.
 * 3. **Name the benefit in plain language, not the implementation.** This is a
 *    landing page, read cold by people who don't know the codebase. `04` first
 *    shipped as "The platform, not a lookalike" over a list of ARIA attribute
 *    names — accurate, and nobody could tell it was about accessibility. The
 *    mechanism belongs in the component's own docs; the strip says what the
 *    reader gets. Insider phrasing here reads as evasion, not precision.
 * 4. **Labels are one word, same part of speech, same suffix.** A capability
 *    strip read as a set — Verifiable / Themeable / Extendable / Accessible —
 *    should look like one claim stated four ways, not four different kinds of
 *    sentence. The qualifier that keeps a label from overclaiming (e.g. accessible
 *    *to what standard*) moves into the description instead of softening the
 *    headline into a hedge.
 */
const stats = [
  {
    n: '01',
    // "Verifiable", not "Testable" — the claim isn't that tests exist, it's
    // that a violation can't compile in the first place. Matches the "the
    // guarantee is a comment, not a property" framing ADR-0010 uses for the
    // same idea applied to contrast.
    //
    // Description speaks to a maintainer evaluating the architecture, not a
    // consumer being warned not to break something — "type-safe CSS, zero
    // runtime cost" is the actual engineering claim (ADR-0001: vanilla-
    // extract compiles the contract to static styles), and "enforced by the
    // compiler" is a positive framing of the same fact "fails to compile"
    // stated defensively.
    label: 'Verifiable',
    description: 'No runtime CSS overhead, no drift between rule and implementation. The token contract and design system principles are enforced by the compiler.',
  },
  {
    n: '02',
    label: 'Themeable',
    description: 'Four themes, light and dark, leveraging one set of components — swap the theme, not the markup. Every value comes from the same schema with intuitive customization.',
  },
  {
    n: '03',
    label: 'Extendable',
    // Deliberately not "every component" or "any part" — Row, Stack and Text
    // don't carry data-component/data-part yet, though ADR-0003 says they
    // should (open gap, not a documented exception). "Components built for
    // it" is scoped to what's true today; widen this only once that gap
    // closes.
    description: 'Flexible composition over rigid configuration. Build UI from existing parts, not new props. A stable data-part hook is exposed for deeper styling.',
  },
  {
    n: '04',
    label: 'Accessible',
    // "Compliant" and "checked systematically" both read ahead of where the
    // build actually is — contrast is checked by eye via the Storybook a11y
    // addon plus a few pairs spot-verified in contrast.test.ts, not the
    // sweep across every theme × mode × pair ADR-0010 proposes and hasn't
    // shipped (docs/foundations/accessibility-standards.md's sanctioned
    // phrasing is "Built to WCAG 2.2 AA" for exactly this reason). Flagged
    // and kept anyway — a deliberate call, not drift; revisit once the
    // pairs sweep lands and the claim is true rather than aspirational.
    description: 'WCAG 2.2 AA compliant, semantic HTML5 throughout. Contrast checked systematically, not eyeballed.',
  },
];

const iconLinkStyle = { color: 'inherit', display: 'flex' } as const;
// Matches `Introduction.css.ts`'s `CONTENT_MAX` (1440), not an independent
// choice — Hero and the rest of that page share one column now that Hero
// renders as its literal top section (not just its own isolated story), and
// two different caps at the same side padding put their left edges at
// visibly different x-positions, which reads as a layout bug, not a design
// choice. If Hero is ever embedded somewhere with a narrower page column,
// this needs to become a prop rather than staying a shared hardcoded value.
const HERO_CONTENT_MAX_WIDTH = 1440;
const HERO_BAND_MAX_WIDTH = `calc(${HERO_CONTENT_MAX_WIDTH}px + ${space.xl} + ${space.xl})`;
const heroContentStyle = {
  maxWidth: HERO_CONTENT_MAX_WIDTH,
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  boxSizing: 'border-box',
  margin: '0 auto',
} as const;

/**
 * The minimal landing utility nav — no section links, just search and GitHub.
 * No sandbox/playground link: that surface doesn't exist yet, and a nav icon
 * pointing nowhere real is exactly the kind of overclaim the rest of this
 * page argues against. Add it back the day a sandbox actually ships.
 */
export function HeroNav({
  githubHref = 'https://github.com/msanagu/pearl',
  brandName = 'pearl',
  // No default: `undefined` here means "no role" (Text's own semantics for
  // an unset `role`). Defaulting to `'inlineEmphasis'` would silently win
  // over a caller explicitly passing `brandRole={undefined}` — exactly what
  // Tahitian's plain-white wordmark needs, since JS default params trigger
  // on `undefined` regardless of whether the caller meant "unset".
  brandRole,
}: Pick<HeroProps, 'githubHref' | 'brandName' | 'brandRole'>): ReactNode {
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
        <a href={githubHref} aria-label="GitHub" style={iconLinkStyle}>
          <Icon icon={PiGithubLogo} size={20} />
        </a>
      </Row>
    </Row>
  );
}

/**
 * The Pearl hero — composed from existing components (`Text`, `Button`,
 * `Row`, `Stack`, `Icon`, `PearlSphere`). Gaps where the system has no home
 * yet (a full-bleed layout component) are flagged inline rather than
 * smoothed over.
 *
 * The single hero, used both as this template's own story and embedded in
 * the introduction page — one true positioning statement rather than a
 * generic marketing placeholder ("The world is your oyster") plus a second,
 * separately-maintained real one. Content that varies by where this mounts
 * (CTA destinations, whether links need to escape a Storybook preview
 * iframe) is prop-driven; the pitch itself is not.
 *
 * The top bar is deliberately minimal utility chrome, NOT the docs sidebar
 * pulled up early.
 */
export function Hero({
  primaryHref = '#',
  primaryLabel = 'Read the docs',
  secondaryHref = '#',
  secondaryLabel = 'Browse components',
  ctaTarget,
  githubHref,
  brandName = 'pearl',
  // No default — see the matching comment on `HeroNav`.
  brandRole,
}: HeroProps) {
  return (
    <Stack>
      {/* GAP — no Nav/Header layout component. Utility chrome only. */}
      <div>
        <Row style={{ ...heroContentStyle, borderBottom: `1px solid ${color.border}`, padding: `${space.md} 0` }}>
          <HeroNav githubHref={githubHref} brandName={brandName} brandRole={brandRole} />
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
          // Asymmetric on purpose — equal top/bottom padding was the actual
          // problem, not the total amount of space. Uniform spacing makes
          // the nav, the headline, and the strip below all read as the same
          // order of importance ("everything is important at once"). The
          // scale tops out at `2xl` (PROJECT_BRIEF open question 15), so
          // going past it means composing from it, same idiom
          // `Introduction.css.ts`'s `page`/`sectionFlow` already use —
          // tripled above the headline, single below, so the headline gets
          // a real landing zone and the strip stays close enough to read as
          // the hero's own footnote, not a new section starting cold.
          paddingTop: `calc(${space['2xl']} * 3)`,
          paddingBottom: space['2xl'],
          paddingLeft: space.xl,
          paddingRight: space.xl,
          width: '100%',
        }}
      >
        {/*
          GAP — no `<header>` composition component. Per docs/markup-
          philosophy.md's header/heading/preheading/subheading vocabulary,
          this preheading + h1 pair belongs inside a real `<header>` element;
          nothing in the system renders one, so it's vanilla here.
        */}
        <Stack as="header" className={css.header} gap="lg" style={{ flex: 1 }}>
          {/* Second pivot on this headline: "enforces its own rules" was the
              compile-time-guarantee angle (still true, still argued by items
              01/02 below) — this is a different lead entirely. PROJECT_BRIEF's
              actual thesis is that this system is built to be legible to a
              coding agent, not just a human, which is the single most
              differentiated real claim in the project and was previously
              absent from the hero altogether. Worded carefully: the
              hypothesis that this needs less RAG scaffolding is explicitly
              NOT yet a measured result (PROJECT_BRIEF, ADR-0008) — the
              headline and body only claim the architecture fact (rules are
              typed data, not prose), never the unproven efficiency win. */}
          {/* Explicit `<br />` per word, not natural wrap — natural wrap
              only happens to land two words on the first line at this
              column width; it isn't guaranteed as the column, font, or
              copy changes. One word per line is a deliberate rhythm, so
              it's forced rather than hoped for. */}
          <Text typeScale="displayLg" as="h1" style={{ margin: 0 }}>
            Flexible.
            <br />
            Themeable.
            <br />
            AI-native.
          </Text>
          {/* "Guides...understand" over "keeps...from misreading" — same
              claim, reframed positive instead of defensive. Still scoped to
              the architecture fact, not the unproven efficiency hypothesis
              (see the comment above the headline). Closing clause rewritten
              again — "helps a coding agent reason about it, too" trailed off
              on "too", making the agent read as an afterthought instead of
              an equal claim. Parallel "clear enough for X, structured
              enough for Y" gives both halves the same weight and ends on
              the stronger verb instead of a tag word. */}
          {/* "Patterns" over "theme roles" for the third item — "theme
              roles" is precise (`ThemeRoles`/`RoleSpec` in
              `src/themes/roles.ts`, ADR-0007's own claim) but cryptic to a
              cold reader who hasn't seen that type. "Pattern" is close
              enough to honest: a role is a named, reusable job → treatment
              binding (`cardHover`, `inlineEmphasis`), which is what
              "pattern" means in design-system vocabulary generally — looser
              than the exact type name, not untrue. */}
          <Text typeScale="bodyLg" prominence="subtle" as="p" measure="lg">
            Foundations, design principles, and patterns — all typed
            data, not prose scattered across manually updated docs. Clear
            enough for a person, structured enough for a coding agent.
          </Text>
          <Row gap="sm">
            <a href={primaryHref} target={ctaTarget} style={{ textDecoration: 'none' }}>
              <Button variant="primary">{primaryLabel}</Button>
            </a>
            <a href={secondaryHref} target={ctaTarget} style={{ textDecoration: 'none' }}>
              <Button variant="secondary">{secondaryLabel}</Button>
            </a>
          </Row>
        </Stack>

        <div className={css.sphere}>
          <PearlSphere />
        </div>
      </Row>

      <div>
        {/* GAP — no Grid composition component; `Row` is flex-only, and this
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
