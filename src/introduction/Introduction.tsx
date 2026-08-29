import { Fragment, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  PiCaretDown,
  PiCompassRose,
  PiCube,
  PiSwatches,
  PiTextAa,
} from 'react-icons/pi';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Alert } from '@components/Alert/Alert';
import { Icon } from '@components/Icon/Icon';
import { PearlSphere } from '@components/_brand/PearlSphere';
import { color } from '@tokens';
import { themeSpecimens, type ThemeKey } from './ThemeSpecimen';
import * as css from './Introduction.css';

/* ------------------------------------------------------------------ *
 * Content — lifted from the docs it summarizes, not re-invented here.
 * Each block cites the file that owns the claim, so this page stays a
 * VIEW over the docs rather than a second source of truth that drifts.
 * ------------------------------------------------------------------ */

const principles = [
  {
    n: '01',
    title: 'Composition over configuration',
    adr: 'ADR-0002',
    body:
      'A prop is legitimate exactly when the root must broker a decision about its own parts — Alert’s heading shifts where its icon sits. Everything else is children. The test is coupling, not taste.',
  },
  {
    n: '02',
    title: 'Two tiers, applied twice',
    adr: 'ADR-0005 · ADR-0007',
    body:
      'Primitives are named for what they are, semantics for what they’re for. The same split runs one level up: treatments are mechanics a theme owns, roles are the jobs it puts them to.',
  },
  {
    n: '03',
    title: 'A sanctioned override contract',
    adr: 'ADR-0003',
    body:
      'Every component renders data-component and data-part. Those attributes are public API; generated class names never are. Downstream styling has a supported door instead of a hack.',
  },
  {
    n: '04',
    title: 'Build by default, adopt deliberately',
    adr: 'ADR-0004',
    body:
      'Hand-built where the value is in composition and craft. Where the problem is deep and already solved — positioning math, focus traps, data grids, charting — adopt, but only libraries that compute rather than render, so the markup and styling stay ours.',
  },
];

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
  },  {
    id: '0002',
    subject: 'Composition',
    title: 'Favor composition over configuration in component APIs',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Boolean and enum props whose only job is to toggle rendered structure multiply without bound, and each one is a decision the consumer could have made themselves with children.',
    cost: 'Call sites are longer than a configured kit, and the rule needs judgement: a prop is legitimate exactly when the root must broker a cross-part decision.',
  },  {
    id: '0003',
    subject: 'Override contract',
    title: 'Downstream overrides via a data-part contract, not class-name imports',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Generated class names are an implementation detail. If downstream code targets them, every internal rename becomes a breaking change nobody declared.',
    cost: 'The specificity guarantee depends on vanilla-extract emitting unlayered single-class rules — an engine swap would need re-proving.',
  },  {
    id: '0004',
    subject: 'Dependency stance',
    title: 'Adopt only headless third-party dependencies; build-from-scratch by default',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Styled kits have to be wrestled back out of their own opinions, and the visual identity is the one thing this system cannot outsource.',
    cost: 'More upfront work on behavior-heavy components, and a smaller pool of eligible libraries to choose from.',
  },  {
    id: '0005',
    subject: 'Token tiers',
    title: 'Two-tier token architecture — primitives and semantics',
    status: 'accepted',
    date: '2026-07-17',
    why: 'One palette has to serve unrelated intents. Naming a value by its hue keeps it honest; naming it by its job lets a theme remap that job without renaming anything.',
    cost: 'Tracing a rendered color takes two lookups instead of one, and each theme owns its own scales rather than sharing a global set.',
  },  {
    id: '0006',
    subject: 'Token naming',
    title: 'Token naming — one prominence ladder, application-named where roles span destinations',
    status: 'accepted',
    date: '2026-07-17',
    why: 'Two naming schemes had started to drift — prominence in some groups, application in others — so the same idea was being spelled two ways.',
    cost: 'Sentiment groups use `icon` rather than the more familiar `solid`, which needs explaining once before it reads as obvious.',
  },  {
    id: '0007',
    subject: 'Treatments & roles',
    title: 'Two system tiers — treatments and roles',
    status: 'proposed',
    date: '2026-07-19',
    why: 'A shared effect slot made “this theme has no effect” inexpressible, and the inexpressible state got filled with invented ones — two themes had an effect fabricated purely to satisfy the contract.',
    cost: 'No single type enumerates every theme’s treatments, so discovering them means reading theme modules. They are deliberately not interchangeable.',
  },  {
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
    title: 'JSDoc stays minimum-viable; stories are the usage reference, not @example',
    status: 'accepted',
    date: '2026-08-26',
    why: 'A hand-written @example drifts from the real API the moment a prop changes, while a story is compiled against it and cannot.',
    cost: 'It presumes every component has a story demonstrating the same usage — Row currently does not, so that one is owed.',
  },];

const acceptedCount = decisions.filter((d) => d.status === 'accepted').length;
const proposedCount = decisions.length - acceptedCount;

// Each theme's canonical read: Tahitian is built around black-lip nacre and
// wants its dark pair; Pearl is the inverse. Same defaults the toolbar uses.
// Order is the display order; the mode comes from `themeSpecimens`.
const specimenOrder = ['pearl', 'tahitian', 'freshwater', 'southSea'] as const;

const stats = [
  { value: '11', label: 'Components' },
  { value: '4', label: 'Themes' },
  { value: '2', label: 'Modes each' },
  { value: '9', label: 'Decision records' },
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
    body: 'Eleven primitives, each with props, states, and stories as the usage reference (ADR-0009).',
    href: '/?path=/docs/components-alert--docs',
  },
  {
    icon: PiCompassRose,
    title: 'Templates',
    body: 'Whole pages assembled from those primitives — where the composition claims get tested.',
    href: '/?path=/docs/templates-docs--docs',
  },
];

/* ------------------------------------------------------------------ *
 * Section scaffolding
 * ------------------------------------------------------------------ */

const toKebabCase = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
        <Text id={toKebabCase(eyebrow)} role="preheading" as="p" typeScale="caption" prominence="subtle">
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
          <Text as="p" typeScale="bodyMd" prominence="subtle" measure="sm" style={{ margin: 0 }}>
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
 * Composed entirely from shipped primitives (`Text`, `Card`, `Button`,
 * `Tag`, `Alert`, `Icon`, `Row`, `Stack`, `PearlSphere`), so the page is
 * itself a specimen of the thing it introduces. Where the system has no
 * primitive yet — page grid, the decision table — the markup is plain and
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
  const [showDecisionLogInfo, setShowDecisionLogInfo] = useState(true);

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
    <div className={css.page}>
      <div className={css.sectionFlow}>
        {/* ---------------- Hero ---------------- */}
        {/* GAP — no page-layout primitive; this grid is plain markup. */}
        <header className={css.heroGrid}>
          <Stack gap="lg">
            <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
              2026 snapshot
            </Text>

            <Stack gap="md">
              <Text as="h1" typeScale="displayXl" style={{ margin: 0 }}>
                <Text as="span" role="inlineEmphasis">
                  Pearl
                </Text>
              </Text>
              <Text as="p" typeScale="bodyLg" measure="md" prominence="subtle" style={{ margin: 0 }}>
                A pearl forms as a living thing answers friction — layer over layer, until
                the irritant becomes the value. A design system is the same shape of
                object: not a library of parts, but an organization’s accumulated answer
                to the problems it keeps meeting.
              </Text>
            </Stack>

            <Row gap="md" wrap>
              <Button
                variant="primary"
                onClick={() => document.getElementById('decision-log')?.scrollIntoView()}
              >
                Read the decisions
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  // `target="_top"` isn't available on a native button, so
                  // navigate the top frame directly — matches the Card links
                  // below, which escape the Storybook preview iframe the
                  // same way.
                  window.top!.location.href = '/?path=/docs/components-alert--docs';
                }}
              >
                Browse components
              </Button>
            </Row>
          </Stack>

          <div className={css.heroArt} aria-hidden="true">
            <PearlSphere />
          </div>
        </header>

        {/* ---------------- The premise ---------------- */}
        <section>
          <div className={css.sectionBody}>
            <SectionHead
              eyebrow="The premise"
              title="An experiment with a date on it"
              standfirst={
                <>
                  Pearl tests what a design system looks like when it’s built to be legible
                  to a coding agent, not just a human. The reasoning behind every decision is
                  on the record.
                </>
              }
            />

            <Card padding="xl">
              <Stack gap="md">
                <Text as="p" typeScale="bodyLg" measure="lg" style={{ margin: 0 }}>
                  The hypothesis: a system whose token layer, component API, and governance
                  docs are structured for machine legibility from day one needs{' '}
                  <Text as="span" role="inlineEmphasis">
                    less
                  </Text>{' '}
                  retrieval scaffolding to stay accurate for an AI agent than one that bolts
                  a RAG layer onto human-only docs after the fact.
                </Text>
                <Text as="p" typeScale="bodyMd" prominence="subtle" measure="lg" style={{ margin: 0 }}>
                  The component library is the testbed, not just the deliverable. What’s built
                  to last is the reasoning: every decision records the options that were
                  weighed, the trade-offs accepted, and the conditions that would make it
                  worth revisiting.
                </Text>
              </Stack>
            </Card>
          </div>
        </section>

        {/* ---------------- Principles ---------------- */}
        <section>
          <div className={css.sectionBody}>
            <SectionHead
              eyebrow="Principles"
              title="Four decisions that shape everything else"
              standfirst="Each one is an architecture decision record: options weighed, trade-offs named, and a status that can still change."
            />

            <div className={css.principleGrid}>
              {principles.map((principle) => (
                <Card key={principle.n} padding="lg">
                  <Stack gap="md" style={{ height: '100%' }}>
                    {/* GAP — `FlexBox` has no `baseline` align, which is what
                        pairing a display numeral with a caption actually wants.
                        `end` is the closest available and reads correctly here. */}
                    <Row justify="between" align="end" gap="sm">
                      <Text as="span" typeScale="displaySm" style={{ color: color.accent }}>
                        {principle.n}
                      </Text>
                      <Text as="span" typeScale="caption" prominence="subtle">
                        {principle.adr}
                      </Text>
                    </Row>
                    <Text as="h3" typeScale="headingSm" style={{ margin: 0 }}>
                      {principle.title}
                    </Text>
                    <Text as="p" typeScale="bodySm" prominence="subtle" style={{ margin: 0 }}>
                      {principle.body}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </div>
          </div>
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

            <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg" style={{ margin: 0 }}>
              These are live, not screenshots — the same markup rendered under four theme
              classes. Pearl and Tahitian carry authored palettes; Freshwater and South Sea
              are still rough drafts.
            </Text>
          </div>
        </section>

        {/* ---------------- Stats ---------------- */}
        <section aria-label="What is shipped">
          <Card padding="xl">
            <Row justify="between" align="center" gap="lg" wrap>
              {stats.map((stat, index) => (
                <Fragment key={stat.label}>
                  {index > 0 && <div className={css.statDivider} aria-hidden="true" />}
                  <Stack gap="md">
                    <Text as="p" typeScale="displaySm" style={{ margin: 0 }}>
                      {stat.value}
                    </Text>
                    <Text role="preheading" as="p" typeScale="caption" prominence="subtle" style={{ margin: 0 }}>
                      {stat.label}
                    </Text>
                  </Stack>
                </Fragment>
              ))}
            </Row>
          </Card>
        </section>

        {/* ---------------- Decision log ---------------- */}
        <section>
          <div className={css.sectionBody}>
            <SectionHead
              eyebrow="Decision log"
              title="Every architectural call, with its status"
              standfirst="Proposed means still under test. A record that gets reversed is the method working, not a failure — the reversal and its reasoning are the artifact."
            />

            {/* GAP — no Table primitive; this framed index is plain markup. */}
            <div className={css.indexPanel}>
              <div className={css.indexRailTop}>
                <div className={css.indexRailCell}>
                  <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                    Decision log
                  </Text>
                </div>
                <div className={`${css.indexRailCell} ${css.indexRailCellRange}`}>
                  <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                    ADR {decisions[0]?.id} — {decisions[decisions.length - 1]?.id}
                  </Text>
                </div>
                <div className={css.indexRailCell}>
                  <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
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
                  <img src="/images/iridescent.jpg" alt="" className={css.indexPlateImage} />
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
                        <Text as="h3" typeScale="displaySm" className={css.indexTitle} style={{ margin: 0 }}>
                          {decision.subject}
                        </Text>

                        <Row gap="sm" align="center" className={css.indexMeta}>
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
                            prominence={decision.status === 'accepted' ? 'subtle' : 'default'}
                            style={
                              decision.status === 'proposed'
                                ? { color: color.accent }
                                : undefined
                            }
                          >
                            {decision.status} / {decision.date}
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
                        <Text as="p" typeScale="bodyLg" measure="lg" style={{ margin: 0 }}>
                          {decision.title}
                        </Text>
                        <Stack gap="xs">
                          <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                            Why
                          </Text>
                          <Text as="p" typeScale="bodyMd" measure="lg" style={{ margin: 0 }}>
                            {decision.why}
                          </Text>
                        </Stack>
                        <Stack gap="xs">
                          <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
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
                <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                  {acceptedCount} accepted / {proposedCount} proposed
                </Text>
                <Text role="preheading" as="p" typeScale="caption" prominence="subtle">
                  docs / decisions
                </Text>
              </div>
            </div>

            {showDecisionLogInfo && (
              <Alert variant="info" heading="How to read Decision Log" onDismiss={() => {setShowDecisionLogInfo(false);}}>
                <Text as="p" typeScale="bodyLg">
                Opinions here are dated on purpose. Treat every decision as current opinion
                under test rather than settled doctrine — the design engineering landscape
                moves, and the ADR frontmatter records what looked right on the day it was
                written.
              </Text>
            </Alert>)}
          </div>
        </section>


        {/* ---------------- Next ---------------- */}
        <section>
          <div className={css.sectionBody}>
            <SectionHead eyebrow="Start here" title="Where to go next" />

            <div className={css.nextGrid}>
              {nextSteps.map((step) => (
                <Card key={step.title} href={step.href} padding="lg" target="_top">
                  <Stack gap="md">
                    <Icon icon={step.icon} size={24} style={{ color: color.accent }} />
                    <Text as="h3" typeScale="headingSm" style={{ margin: 0 }}>
                      {step.title}
                    </Text>
                    <Text as="p" typeScale="bodySm" prominence="subtle" style={{ margin: 0 }}>
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
  );
}
