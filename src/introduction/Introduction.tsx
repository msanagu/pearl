import { Fragment, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  PiCaretDown,
  PiCompassRose,
  PiCube,
  PiSwatches,
  PiTextAa,
} from 'react-icons/pi';
import { Text } from '@components/Text/Text';
import { Card } from '@components/Card/Card';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Icon } from '@components/Icon/Icon';
import { Hero } from '@/templates/Hero/Hero';
import { pearlBrandWordmark } from '@themes/pearl/pearl.roles';
import { color } from '@tokens';
import { themeSpecimens, type ThemeKey } from './ThemeSpecimen';
import * as css from './Introduction.css';

/* ------------------------------------------------------------------ *
 * Content — lifted from the docs it summarizes, not re-invented here.
 * Each block cites the file that owns the claim, so this page stays a
 * VIEW over the docs rather than a second source of truth that drifts.
 * ------------------------------------------------------------------ */

/**
 * Mirrors `docs/decisions/` frontmatter — `id`, `title`, `status`, `date`,
 * and the leading `tag` as the record's subject. `subject` is the short read
 * the index sets at heading scale; `title` is the record's real, full title
 * carried underneath, so nothing is lost to the compression.
 *
 * Listed in numeric order, which is also the order the decisions were
 * recorded. ADR numbers are immutable identifiers assigned at recording
 * time, NOT at acceptance — so a proposed 0007 preceding an accepted 0009
 * is correct, and sorting by status instead would print the index out of
 * sequence. Status is per-row meta rather than a grouping.
 */
const decisions: {
  id: string;
  subject: string;
  title: string;
  status: 'accepted' | 'proposed';
  /** Full ISO date from the record's frontmatter — the log is about when. */
  date: string;
  /** The forcing problem — what made a decision necessary at all. */
  why: string;
  /** The cost the record accepts with its eyes open. */
  cost: string;
}[] = [
  {
    id: '0001',
    subject: 'Styling engine',
    title: 'Use vanilla-extract as the styling engine',
    status: 'accepted',
    date: '2026-07-17',
    why: 'The reskinning promise needs a contract the compiler can prove is complete — a theme missing a token has to fail the build, not fail silently at runtime.',
    cost: 'A hand-maintained token wrapper for hover docs, and a bet on a lower-momentum tool than the utility-CSS mainstream.',
  },
  {
    id: '0002',
    subject: 'Composition',
    title: 'Favor composition over configuration in component APIs',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Boolean and enum props whose only job is to toggle rendered structure multiply without bound, and each one is a decision the consumer could have made themselves with children.',
    cost: 'Call sites are longer than a configured kit, and the rule needs judgement: a prop is legitimate exactly when the root must broker a cross-part decision.',
  },
  {
    id: '0003',
    subject: 'Override contract',
    title:
      'Downstream overrides via a data-part contract, not class-name imports',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Generated class names are an implementation detail. If downstream code targets them, every internal rename becomes a breaking change nobody declared.',
    cost: 'The specificity guarantee depends on vanilla-extract emitting unlayered single-class rules — an engine swap would need re-proving.',
  },
  {
    id: '0004',
    subject: 'Dependency stance',
    title:
      'Adopt only headless third-party dependencies; build-from-scratch by default',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Styled kits have to be wrestled back out of their own opinions, and the visual identity is the one thing this system cannot outsource.',
    cost: 'More upfront work on behavior-heavy components, and a smaller pool of eligible libraries to choose from.',
  },
  {
    id: '0005',
    subject: 'Token tiers',
    title: 'Two-tier token architecture — primitives and semantics',
    status: 'accepted',
    date: '2026-07-17',
    why: 'One palette has to serve unrelated intents. Naming a value by its hue keeps it honest; naming it by its job lets a theme remap that job without renaming anything.',
    cost: 'Tracing a rendered color takes two lookups instead of one, and each theme owns its own scales rather than sharing a global set.',
  },
  {
    id: '0006',
    subject: 'Token naming',
    title:
      'Token naming — one prominence ladder, application-named where roles span destinations',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Two naming schemes had started to drift — prominence in some groups, application in others — so the same idea was being spelled two ways.',
    cost: 'Sentiment groups use `icon` rather than the more familiar `solid`, which needs explaining once before it reads as obvious.',
  },
  {
    id: '0007',
    subject: 'Treatments & roles',
    title: 'Two system tiers — treatments and roles',
    status: 'proposed',
    date: '2026-07-19',
    why: 'A shared effect slot made “this theme has no effect” inexpressible, and the inexpressible state got filled with invented ones — two themes had an effect fabricated purely to satisfy the contract.',
    cost: 'No single type enumerates every theme’s treatments, so discovering them means reading theme modules. They are deliberately not interchangeable.',
  },
  {
    id: '0008',
    subject: 'Machine-readable manifest',
    title: 'DSDS-aligned machine-readable manifest',
    status: 'proposed',
    date: '2026-08-26',
    why: 'An agent reasoning about this system needs structured facts, not prose it has to re-derive — and an external draft spec turned out to have named the same shapes independently.',
    cost: 'The manifest is not built yet, and the spec it borrows vocabulary from is pre-1.0 and may still move under it.',
  },
  {
    id: '0009',
    subject: 'JSDoc floor',
    title:
      'JSDoc stays minimum-viable; stories are the usage reference, not @example',
    status: 'accepted',
    date: '2026-08-26',
    why: 'A hand-written @example drifts from the real API the moment a prop changes, while a story is compiled against it and cannot.',
    cost: 'It presumes every component has a story demonstrating the same usage — Row currently does not, so that one is owed.',
  },
  {
    id: '0010',
    subject: 'Color & contrast',
    title:
      'Author color in OKLCH, enforce contrast on pairs, declare the fewest steps that survive',
    status: 'proposed',
    date: '2026-08-29',
    why: 'The accessibility guarantee lived in a comment covering one of four themes — and the widely-repeated claim that perceptual color spaces make contrast safe by construction was measured here and does not hold.',
    cost: 'Sanctioned pairs must be enumerated by hand and kept current. The measurement module is built; the sweep that walks every pair is not, so today this is a decision with its math ready, not a guarantee in the build.',
  },
];

const acceptedCount = decisions.filter((d) => d.status === 'accepted').length;
const proposedCount = decisions.length - acceptedCount;

/**
 * Display-only — `decision.date` itself stays the full ISO date straight
 * from each ADR's frontmatter (the real source of truth; other code may
 * eventually sort or diff on it), this only reformats it for the index row.
 * `Date.parse('YYYY-MM-DD')` reads as UTC midnight; formatting in the
 * `'UTC'` time zone keeps the displayed month from shifting a day backward
 * for any reader west of Greenwich, which local-time formatting would do.
 */
function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Each theme's canonical read: Tahitian is built around black-lip nacre and
// wants its dark pair; Pearl is the inverse. Same defaults the toolbar uses.
// Order is the display order; the mode comes from `themeSpecimens`.
const specimenOrder = ['pearl', 'tahitian', 'freshwater', 'southSea'] as const;

// Counts a reviewer could check against the repo in a minute, so they have to
// be right. `Decision records` derives from the array above rather than being
// typed in — it was the number that had already gone stale (ADR-0010 shipped
// while the page still said nine), and a page arguing that rules shouldn't
// drift is the worst possible place to hand-maintain a count.
// `Components` is the public export surface in `src/index.ts`, which is the
// honest read of "what you get"; the brand marks are deliberately not counted,
// since they aren't exported and aren't themeable canon (ADR-0007).
const stats = [
  { value: '10', label: 'Components' },
  { value: '4', label: 'Themes' },
  { value: '2', label: 'Modes each' },
  { value: String(decisions.length), label: 'Decision records' },
];

/**
 * Destinations are ROOT-relative (`/?path=...`), not bare `?path=...`. These
 * cards render inside Storybook's preview iframe, where a relative query
 * string resolves against `iframe.html` and lands on the bare preview app
 * instead of the shell. Paired with `target="_top"` so the link replaces the
 * whole page rather than nesting Storybook inside its own preview pane.
 */
const nextSteps = [
  {
    icon: PiSwatches,
    title: 'Tokens',
    body: 'The contract every theme fills — primitives, semantics, and the inverse bridge between modes.',
    href: '/?path=/story/foundations-tokens-primitives--overview',
  },
  {
    icon: PiTextAa,
    title: 'Typography',
    body: 'Size, face, element, and weight as four independent axes — plus the opt-in measure cap.',
    href: '/?path=/story/foundations-typography--overview',
  },
  {
    icon: PiCube,
    title: 'Components',
    body: 'Ten components, each with props, states, and stories as the usage reference (ADR-0009).',
    href: '/?path=/docs/components-alert--docs',
  },
  {
    icon: PiCompassRose,
    title: 'Templates',
    body: 'Whole pages assembled from those components — where the composition claims get tested.',
    href: '/?path=/docs/templates-docs--docs',
  },
];

/* ------------------------------------------------------------------ *
 * Section scaffolding
 * ------------------------------------------------------------------ */

const toKebabCase = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * A section opener: accent tick, eyebrow, title, optional standfirst. Keeps
 * every section's vertical rhythm and heading level identical instead of
 * re-deciding it eight times down the page.
 */
function SectionHead({
  eyebrow,
  title,
  standfirst,
}: {
  eyebrow: string;
  title: string;
  standfirst?: ReactNode;
}) {
  return (
    <div className={css.sectionHead}>
      <div className={css.sectionHeadLead}>
        <div className={css.sectionTick} aria-hidden="true" />
        <Text
          id={toKebabCase(eyebrow)}
          role="preheading"
          as="p"
          typeScale="caption"
          prominence="subtle"
        >
          {eyebrow}
        </Text>
        {/* `displayLg` — the top of the scale, the same step the wordmark
            takes. A section opener is a statement, and the jump from here to
            `bodyMd` beside it is where the page gets its tension. `measure`
            keeps it wrapping to two or three lines, which reads as a block of
            type rather than a stray long line. */}
        <Text as="h2" typeScale="displayLg" measure="sm" style={{ margin: 0 }}>
          {title}
        </Text>
      </div>
      {standfirst && (
        <div className={css.sectionStandfirst}>
          <Text
            as="p"
            typeScale="bodyMd"
            prominence="subtle"
            measure="sm"
            style={{ margin: 0 }}
          >
            {standfirst}
          </Text>
        </div>
      )}
    </div>
  );
}

/**
 * One theme specimen, in its own frame. See `ThemeSpecimen.tsx` for why this
 * cannot be a nested `<div>` carrying the theme class.
 */
function ThemeSpecimenFrame({ theme }: { theme: ThemeKey }) {
  const { name, mode } = themeSpecimens[theme];
  return (
    <div className={css.themeSwatch}>
      <iframe
        title={`${name} theme specimen`}
        loading="lazy"
        className={css.themeFrame}
        src={`iframe.html?id=introduction-theme-specimen--specimen&viewMode=story&globals=theme:${theme};mode:${mode}`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

/**
 * The system's front door — a high-level read of what Pearl is, the four
 * decisions that shape it, and where to go next.
 *
 * Composed entirely from shipped components (`Text`, `Card`, `Button`,
 * `Tag`, `Alert`, `Icon`, `Row`, `Stack`, `PearlSphere`), so the page is
 * itself a specimen of the thing it introduces. Where the system has no
 * component yet — page grid, the decision table — the markup is plain and
 * flagged, the same convention `Docs.tsx` and `Hero.tsx` follow.
 */
export interface IntroductionProps {
  /**
   * Class for a theme's photographic-plate treatment, applied to the decision
   * index plate. Tahitian passes its `overtonePlate` (an animated iridescent
   * screen-blend); themes without such a treatment pass nothing and the plate
   * renders as a plain inverse surface — treatments are additive, never a
   * dependency (ADR-0007 rule 3).
   */
  plateTreatment?: string;
}

export function Introduction({ plateTreatment = '' }: IntroductionProps) {
  useEffect(() => {
    // Storybook renders this story inside a preview iframe, so a
    // `#decision-log` in the top-level URL never triggers the browser's
    // native anchor-scroll — that only happens within one document. Read
    // the hash off whichever window actually has it and scroll manually.
    let hash = window.location.hash;
    if (!hash) {
      try {
        hash = window.top?.location.hash ?? '';
      } catch {
        hash = '';
      }
    }
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      {/* ---------------- Hero ----------------
          Rendered outside `page`'s max-width container, full-bleed, the same
          way `Hero.tsx`'s own story does — this page doubles as a preview of
          what a real landing page for the package would look like, so the
          nav's border and the hero band should reach the viewport edge, not
          sit padded inside the docs-page column with everything below it.
          `ctaTarget="_top"` escapes the Storybook preview iframe, matching
          how the "next steps" cards below do the same with `target="_top"`
          rather than the old `window.top!.location.href` handler this
          replaced — a native anchor attribute instead of a click handler
          doing the same thing manually. */}
      <Hero
        // `Hero` deliberately has no default for `brandRole` — Tahitian's
        // plain-white wordmark needs to pass `undefined` and have it stick,
        // so a default here would silently override that. This page is
        // Pearl-only (no theme toolbar), so it passes Pearl's own wordmark
        // data directly — the same source `ThemeSpecimen` reads — instead
        // of a second hardcoded 'pearl' that could drift from it.
        brandName={pearlBrandWordmark.text}
        brandRole={pearlBrandWordmark.role}
        primaryHref="#decision-log"
        primaryLabel="Follow the journey"
        secondaryHref="/?path=/docs/components-alert--docs"
        secondaryLabel="Browse components"
        ctaTarget="_top"
      />

      <div className={css.page}>
        <div className={css.sectionFlow}>
          {/* ---------------- Stats ---------------- */}
          <section aria-label="What is shipped">
            <Card padding="xl">
              <Row justify="between" align="center" gap="lg" wrap>
                {stats.map((stat, index) => (
                  <Fragment key={stat.label}>
                    {index > 0 && (
                      <div className={css.statDivider} aria-hidden="true" />
                    )}
                    <Stack gap="md">
                      <Text as="p" typeScale="displaySm" style={{ margin: 0 }}>
                        {stat.value}
                      </Text>
                      <Text
                        role="preheading"
                        as="p"
                        typeScale="caption"
                        prominence="subtle"
                        style={{ margin: 0 }}
                      >
                        {stat.label}
                      </Text>
                    </Stack>
                  </Fragment>
                ))}
              </Row>
            </Card>
          </section>

          {/* ---------------- Reskinning ---------------- */}
          <section>
            <div className={css.sectionBody}>
              <SectionHead
                eyebrow="Theming"
                title="One contract, any number of themes"
                standfirst="Every component reads only from the theme contract — never a hardcoded color, space, or type value. Swapping the theme files reskins the whole system with no component code touched."
              />

              <div className={css.themeGrid}>
                {specimenOrder.map((theme) => (
                  <ThemeSpecimenFrame key={theme} theme={theme} />
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- The premise ----------------
            Previously a full `SectionHead` (eyebrow + `displayLg` heading +
            standfirst paragraph) sitting ABOVE a Card that then restated the
            same idea in prose — three consecutive doses of "big statement,
            then explain it," right under the Hero doing the exact same
            thing. Collapsed into one Card: a small eyebrow (still the tick
            motif every other section uses, just not blown up to a second
            display headline immediately after the Hero's own), a modest
            statement instead of a repeated giant one, and the body broken
            into labeled beats — "The hypothesis" / "The testbed" — matching
            the same preheading-label pattern the decision log's own detail
            panel already uses for "Why" / "Accepted cost", so a reader can
            scan the labels before committing to the prose under either one.
            Copy tightened alongside the restructure, not just moved: the
            standfirst's "built to be legible to a coding agent... reasoning
            on the record" and the hypothesis paragraph were saying most of
            the same thing twice — cut instead of both kept. */}
          <section>
            <div className={css.sectionBody}>
              {/* `premiseGrid` (Introduction.css.ts) — the same asymmetric
                two-column proportion `sectionHead` uses elsewhere on this
                page, so the headline and its two beats stop stacking in one
                narrow left column with the card's other ~60% sitting empty.
                `alignItems: 'start'`, not `sectionHead`'s `'end'` — see the
                style's own comment for why this pairing needs a shared top
                edge instead of a shared bottom one. */}
              <Card padding="xl">
                <div className={css.premiseGrid}>
                  {/* Two full clauses, not a mechanical mid-sentence break —
                      "Pearl is an [experiment] —" was breaking right after a
                      bare article ("an"), which strands a weak function word
                      at the line's end, and jumping "experiment" alone to
                      displayLg mid-sentence read as a type-scale collision,
                      not deliberate emphasis. Both lines now end on a real
                      word, uniform scale throughout, "experiment" carrying
                      its emphasis via role only. "Not a finished product" is
                      PROJECT_BRIEF's own phrase ("a 2026 snapshot, not a
                      finished product"), not new copy.
                      A non-breaking space (U+00A0) sits between
                      "experiment" and the dash below — a plain space
                      there let the browser wrap the dash onto its own
                      orphaned line whenever "Pearl is an [emphasis]
                      experiment" alone already filled the column
                      (reproduced in both Pearl and Tahitian, at this
                      card's real width). The non-breaking space glues the
                      two together so they can never be split apart by the
                      wrap. */}
                  <Text as="h2" typeScale="displaySm" style={{ margin: 0 }}>
                    Pearl is an{' '}
                    <Text as="span" role="inlineEmphasis">
                      experiment
                    </Text>
                    {' —'}
                    <br />
                    not a finished product.
                  </Text>

                  <Stack gap="md">
                    <Stack gap="xs">
                      <Text
                        role="preheading"
                        as="p"
                        typeScale="caption"
                        prominence="subtle"
                      >
                        The hypothesis
                      </Text>
                      <Text
                        as="p"
                        typeScale="bodyLg"
                        measure="lg"
                        style={{ margin: 0 }}
                      >
                        A system structured for machine legibility from day one
                        needs less retrieval scaffolding than one that bolts RAG
                        onto human-only docs after the fact.
                      </Text>
                    </Stack>

                    <Stack gap="xs">
                      <Text
                        role="preheading"
                        as="p"
                        typeScale="caption"
                        prominence="subtle"
                      >
                        The testbed
                      </Text>
                      <Text
                        as="p"
                        typeScale="bodyMd"
                        prominence="subtle"
                        measure="lg"
                        style={{ margin: 0 }}
                      >
                        The component library proves the idea, not just ships
                        it. Every decision records what was weighed, what it
                        cost, and when it's worth revisiting.
                      </Text>
                    </Stack>
                  </Stack>
                </div>
              </Card>
            </div>
          </section>

          {/* ---------------- Decision log ---------------- */}
          <section>
            <div className={css.sectionBody}>
              {/* Standfirst carried "This project is itself the
                experiment..." — now redundant with the premise card above
                (Stats → Reskinning → "Pearl is an experiment"), which
                already makes that exact claim. Replaced with the "how to
                read this log" guidance instead, previously its own `Alert`
                (icon, colored box, dismiss button) sitting below the
                heading. Demoted to plain standfirst prose, same as every
                other section's standfirst on this page — the card chrome
                was doing more visual work than the message warranted, and
                a page arguing that decisions are "dated, not settled
                doctrine" doesn't need to dress that fact up as a warning. */}
              <SectionHead
                eyebrow="Decision log"
                title="Every architectural call, with its status"
                standfirst="Opinions here are dated on purpose — each record's frontmatter shows what looked right on the day it was written, not settled doctrine. Proposed means still under test; a reversal is the method working, not a failure."
              />

              {/* GAP — no Table component; this framed index is plain markup. */}
              <div className={css.indexPanel}>
                <div className={css.indexRailTop}>
                  <div className={css.indexRailCell}>
                    <Text
                      role="preheading"
                      as="p"
                      typeScale="caption"
                      prominence="subtle"
                    >
                      Decision log
                    </Text>
                  </div>
                  <div
                    className={`${css.indexRailCell} ${css.indexRailCellRange}`}
                  >
                    <Text
                      role="preheading"
                      as="p"
                      typeScale="caption"
                      prominence="subtle"
                    >
                      ADR {decisions[0]?.id} —{' '}
                      {decisions[decisions.length - 1]?.id}
                    </Text>
                  </div>
                  <div className={css.indexRailCell}>
                    <Text
                      role="preheading"
                      as="p"
                      typeScale="caption"
                      prominence="subtle"
                    >
                      Status / Date
                    </Text>
                  </div>
                </div>

                <div className={css.indexBody}>
                  {/* `Text` always writes its own color, so the inverse pair has
                    to be set per element — a `color` on the plate alone would
                    be overridden by the recipe and render ink-on-ink.

                    `plateTreatment` is threaded in from the story rather than
                    hardcoded: `overtonePlate` is Tahitian's own extension
                    treatment, and a page must render correctly with zero
                    treatments (ADR-0007 rule 3). Same pattern `Hero.stories`
                    uses for the per-theme wordmark. */}
                  <div className={`${css.indexPlate} ${plateTreatment}`.trim()}>
                    <img
                      src="/images/iridescent.jpg"
                      alt=""
                      className={css.indexPlateImage}
                    />
                    <div className={css.indexPlateContent}>
                      <Text as="p" typeScale="displaySm" style={{ margin: 0 }}>
                        The
                        <br />
                        Record
                      </Text>
                    </div>
                  </div>

                  <div className={css.indexList}>
                    {decisions.map((decision) => (
                      <details key={decision.id} className={css.indexRecord}>
                        <summary className={css.indexRow}>
                          {/* `preheading`, not a bare caption. Both themes' role
                            tables put standalone IDs and index numbers under
                            this role — Tahitian's says so explicitly, citing
                            the same reference this index is built from — and
                            it resolves to each theme's mono face. Without the
                            role the ordinal silently falls back to the body
                            font and stops reading as an index. */}
                          <Text
                            role="preheading"
                            as="span"
                            typeScale="caption"
                            prominence="subtle"
                            className={css.indexOrdinal}
                          >
                            {decision.id}
                          </Text>

                          {/* One line, like the reference. The record's full
                            title used to sit here as a second line, which left
                            every row a two-line block with the ordinal and meta
                            stranded between the lines. It now leads the
                            disclosure instead — the collapsed index stays a
                            scannable column of names. */}
                          <Text
                            as="h3"
                            typeScale="displaySm"
                            className={css.indexTitle}
                            style={{ margin: 0 }}
                          >
                            {decision.subject}
                          </Text>

                          <Row
                            gap="sm"
                            align="center"
                            className={css.indexMeta}
                          >
                            {/* Color marks the exception, not the default. Seven
                              of nine records are accepted, so coloring those
                              paints most of the column and signals nothing —
                              they stay subtle. `proposed` is the state worth
                              finding, and takes `accent`: the theme's own
                              quiet signal color, which is what accent is for
                              (ADR-0006) rather than a sentiment hue. */}
                            <Text
                              role="preheading"
                              as="span"
                              typeScale="caption"
                              prominence={
                                decision.status === 'accepted'
                                  ? 'subtle'
                                  : 'default'
                              }
                              style={
                                decision.status === 'proposed'
                                  ? { color: color.accent }
                                  : undefined
                              }
                            >
                              {decision.status} / {formatMonthYear(decision.date)}
                            </Text>
                            <Icon
                              icon={PiCaretDown}
                              size={14}
                              className={css.indexCaret}
                              aria-hidden="true"
                            />
                          </Row>
                        </summary>

                        <Stack gap="lg" className={css.indexDetail}>
                          <Text
                            as="p"
                            typeScale="bodyLg"
                            measure="sm"
                            style={{ margin: 0 }}
                          >
                            {decision.title}
                          </Text>
                          <Stack gap="xs">
                            <Text
                              role="preheading"
                              as="p"
                              typeScale="caption"
                              prominence="subtle"
                            >
                              Why
                            </Text>
                            <Text
                              as="p"
                              typeScale="bodyMd"
                              measure="lg"
                              style={{ margin: 0 }}
                            >
                              {decision.why}
                            </Text>
                          </Stack>
                          <Stack gap="xs">
                            <Text
                              role="preheading"
                              as="p"
                              typeScale="caption"
                              prominence="subtle"
                            >
                              Accepted cost
                            </Text>
                            <Text
                              as="p"
                              typeScale="bodyMd"
                              prominence="subtle"
                              measure="lg"
                              style={{ margin: 0 }}
                            >
                              {decision.cost}
                            </Text>
                          </Stack>
                        </Stack>
                      </details>
                    ))}
                  </div>
                </div>

                <div className={css.indexRailBottom}>
                  <Text
                    role="preheading"
                    as="p"
                    typeScale="caption"
                    prominence="subtle"
                  >
                    {acceptedCount} accepted / {proposedCount} proposed
                  </Text>
                  <Text
                    role="preheading"
                    as="p"
                    typeScale="caption"
                    prominence="subtle"
                  >
                    docs / decisions
                  </Text>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Next ---------------- */}
          <section>
            <div className={css.sectionBody}>
              <SectionHead eyebrow="Start here" title="Where to go next" />

              <div className={css.nextGrid}>
                {nextSteps.map((step) => (
                  <Card
                    key={step.title}
                    href={step.href}
                    padding="lg"
                    target="_top"
                  >
                    <Stack gap="md">
                      <Icon
                        icon={step.icon}
                        size={24}
                        style={{ color: color.accent }}
                      />
                      <Text as="h3" typeScale="headingSm" style={{ margin: 0 }}>
                        {step.title}
                      </Text>
                      <Text
                        as="p"
                        typeScale="bodySm"
                        prominence="subtle"
                        style={{ margin: 0 }}
                      >
                        {step.body}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
