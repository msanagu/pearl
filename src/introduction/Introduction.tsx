import { Fragment, useEffect, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
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
import { Icon } from '@components/Icon/Icon';
import { Link } from '@components/Link/Link';
import { Hero } from '@/templates/Hero/Hero';
import { SiteHeader } from '@/templates/SiteHeader/SiteHeader';
import { Footer } from '@/templates/Footer/Footer';
import { pearlFooterPlate } from '@/templates/Footer/footerPlate';
import { pearlBrandWordmark } from '@themes/pearl/pearl.roles';
import { color } from '@tokens';
import { themeSpecimens, type ThemeKey } from './ThemeSpecimen';
import { componentCount, themeCount, modesPerTheme } from './liveStats';
import { AutoHideHeader } from './AutoHideHeader';
import * as css from './Introduction.css';

/* Content is a view over the docs it summarises, not re-invented here. */

/**
 * The "The Record" index. Mirrors `DECISIONS.md` (the canonical public digest):
 * adopted conventions first, then the ones under evaluation, each block in the
 * order it was recorded. Two entries consolidate a pair each.
 */
const decisions: {
  id: string;
  subject: string;
  title: string;
  status: 'accepted' | 'proposed';
  /** Month the convention was recorded — rendered as "July 2026". */
  date: string;
  /** The forcing problem — what made a decision necessary at all. */
  why: string;
  /** The cost the record accepts with its eyes open. */
  cost: string;
  /** Optional pointer to where this one is being worked out in the open. */
  link?: { label: string; href: string };
}[] = [
  {
    id: '0001',
    subject: 'Styling engine',
    title: 'Zero-runtime styling, driven by a compile-checked theme contract',
    status: 'accepted',
    date: '2026-07',
    why: 'The reskinning promise needs a contract the compiler can prove is complete — a theme missing a token fails the build, not silently at runtime. vanilla-extract models that natively and is zero-runtime: plain compiled CSS, nothing generating styles in the browser the way CSS-in-JS does, and theme switching is just a class swap and a CSS-variable cascade. It also keeps styling out of the markup with predictable specificity, unlike utility CSS.',
    cost: 'vanilla-extract doesn’t surface documented, filterable token autocomplete on its own — that needs a wrapper layer, hand-maintained today, with no generator producing it from the contract yet.',
  },
  {
    id: '0002',
    subject: 'Composition',
    title: 'Favor composition over configuration in component APIs',
    status: 'accepted',
    date: '2026-07',
    why: 'Every prop is permanent API surface — to document, test, keep stable, and support indefinitely — and configuration-first components accumulate them without bound, one per use case the author happened to foresee. Composition keeps that surface deliberately small: build UI from parts already in the system, not new props, so there is far less to maintain as it grows.',
    cost: 'New props aren’t added on spec — composition is the first answer, and a prop earns its place only once repeated real use shows the component itself must make a decision that depends on its content. That restraint takes judgement, and call sites run a little longer than a kit that ships every prop up front.',
  },
  {
    id: '0003',
    subject: 'Override contract',
    title: 'A stable styling hook for feature teams — greppable, not guesswork',
    status: 'accepted',
    date: '2026-07',
    why: 'When a feature team needs to adjust a component from the outside, they target a stable data-part attribute — from one place per feature — instead of reaching for inline styles or the component’s internal class names, which are an implementation detail that breaks silently on refactor. And because every override goes through the same named, greppable hook, the same one recurring across teams is a readable signal that the system itself should grow a real variant or token.',
    cost: 'Composition stays the default — an override is a costed exception, and the team that writes one owns keeping it correct when the component’s internals move.',
  },
  {
    id: '0004',
    subject: 'Dependency stance',
    title: 'Prefer headless dependencies; build by default, adopt deliberately',
    status: 'accepted',
    date: '2026-07',
    why: 'The visual identity and markup are the one thing this system can’t outsource, so the preference is headless dependencies — behavior, logic, and accessibility only, with rendering and styling left entirely to us — and building from scratch by default. The exception is a few genuinely heavy components, like a data grid or charts, where the feature surface is large enough that a more opinionated dependency can be worth the cost of overriding it for the robust functionality it brings out of the box.',
    cost: 'More upfront work on everything built in-house, and where a heavier dependency is adopted, an ongoing cost to keep its styling bent to the system rather than the other way around.',
  },
  {
    id: '0005',
    subject: 'Token conventions',
    title: 'A semantic token tier between components and the raw palette',
    status: 'accepted',
    date: '2026-07',
    why: 'Components never read a raw color or spacing value — they read semantic tokens (surface, border, text) that sit on their own tier and map onto the palette underneath. Keeping that layer separate is what lets the mapping be re-tuned or re-pointed per theme without touching a component. And because each semantic token is scoped to one job, the combinations that reach the screen are ones designed to go together — which is where accessible contrast comes from.',
    cost: 'One more layer to author and hold in your head, and tracing a rendered value back to its raw hex takes two hops instead of one.',
  },
  {
    id: '0006',
    subject: 'Theme extensions',
    title: 'Themes can add their own visual effects, not just their own values',
    status: 'proposed',
    date: '2026-07',
    why: 'Each theme should be able to bring visual character the shared system doesn’t define — an iridescent sheen, a tinted photo overlay. The first attempt gave the contract one slot for “the theme’s effect” and forced every theme to fill it, so themes with none had one invented just to satisfy the structure.',
    cost: 'There’s no single list of every theme’s effects — finding them means reading each theme. That’s deliberate: an effect belongs to the theme that defines it, not to a shared vocabulary.',
  },
  {
    id: '0007',
    subject: 'Machine-readable manifest',
    title:
      'A manifest for coding agents, with stories as the usage context it points at',
    status: 'proposed',
    date: '2026-08',
    why: 'The bet: guidance that ships as structured data — generated from the same source as the components, so it can’t drift — keeps a coding agent accurate without a retrieval layer bolted on afterward. The manifest carries the component contracts, token roles, and usage rules. Its usage examples are the Storybook stories: written once for the docs a person reads, and surfaced through the manifest for an agent — one set of examples, nothing duplicated.',
    cost: 'Whether it actually makes an agent more accurate is being measured, not assumed — generation runs against a real package install are logged in the open as they happen. Separately, the emerging standards the shape’s structure leans on are still young enough to move.',
    link: {
      label: 'Open the playground',
      href: 'https://msanagu.github.io/pearl-playground/',
    },
  },
  {
    id: '0008',
    subject: 'Color & contrast',
    title:
      'Color authored for perceptual consistency, accessibility enforced by measurement',
    status: 'proposed',
    date: '2026-08',
    why: 'OKLCH is the authoring space because it makes a palette perceptually consistent — across four themes, steps and hues that look evenly related actually are. Contrast is measured and enforced separately on the real foreground/background pairs, by math rather than by eye.',
    cost: 'Sanctioned pairs have to be enumerated by hand and kept current. The measurement code is built; the sweep that walks every pair is not — so today this is a convention with its math ready, not yet a guarantee the build enforces.',
  },
  {
    id: '0009',
    subject: 'Motion dependencies',
    title:
      'A modern motion stack, tried on this landing page before the system commits to it',
    status: 'proposed',
    date: '2026-09',
    why: 'The dependency stance says build by default and adopt deliberately — but "deliberately" needs evidence, and animation is a place where a good library saves real work. So `motion` and `lenis` come in as devDependencies used only under `src/introduction/`: this page is the testbed. The build already keeps them out of the shipped package — nothing here is re-exported from `src/index.ts`, and the declaration build excludes the directory — so the experiment costs consumers nothing while it runs.',
    cost: 'The boundary is convention, not enforced: a stray import from a component file would not fail the build, only review. And living with two animation approaches — these libraries here, hand-rolled transitions everywhere else — until the evaluation resolves one way or the other.',
  },
];

const acceptedCount = decisions.filter((d) => d.status === 'accepted').length;
const proposedCount = decisions.length - acceptedCount;

// Format in UTC so the displayed month doesn't shift a day backward for
// readers west of Greenwich.
function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Display order; the mode for each comes from `themeSpecimens`.
const specimenOrder = ['pearl', 'tahitian', 'freshwater', 'southSea'] as const;

// Every value here is derived, not typed in — `liveStats.ts` reads the real
// public export surface (`src/index.ts`), and `Conventions` comes from the
// array above. The brand marks stay uncounted: they aren't exported, so the
// component detector never sees them.
const stats = [
  { value: String(componentCount), label: 'Components' },
  { value: String(themeCount), label: 'Themes' },
  { value: String(modesPerTheme), label: 'Modes each' },
  { value: String(decisions.length), label: 'Conventions' },
];

// Root-relative (`/?path=...`), not bare — inside Storybook's preview iframe a
// relative query string resolves against `iframe.html`. Paired with
// `target="_top"` so the link replaces the whole page.
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
    body: 'Every component, with its props, states, and the story that doubles as its usage reference.',
    href: '/?path=/docs/components-alert--docs',
  },
  {
    icon: PiCompassRose,
    title: 'Templates',
    body: 'Whole pages assembled from those components — where the composition claims get tested.',
    href: '/?path=/docs/templates-docs--docs',
  },
];

/* Section scaffolding */

const toKebabCase = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// The hero's primary CTA smooth-scrolls to the Conventions section;
// `href="#conventions"` is the no-JS fallback (the id comes from `SectionHead`).
// `lenis` is passed when the page's smooth-scroll layer is active so the jump
// shares its easing; without it (reduced motion) this is a native smooth scroll.
function scrollToConventions(
  event: MouseEvent<HTMLAnchorElement>,
  lenis: ReturnType<typeof useLenis>,
) {
  const anchor = document.getElementById('conventions');
  if (!anchor) return;
  event.preventDefault();
  if (lenis) lenis.scrollTo(anchor, { offset: -16 });
  else anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** A section opener: accent tick, preheading, title, optional standfirst. */
function SectionHead({
  preheading,
  title,
  standfirst,
}: {
  preheading: string;
  title: string;
  standfirst?: ReactNode;
}) {
  return (
    <div className={css.sectionHead}>
      <div className={css.sectionHeadLead}>
        <div className={css.sectionTick} aria-hidden="true" />
        <Text
          id={toKebabCase(preheading)}
          role="preheading"
          as="p"
          typeScale="caption"
          prominence="subtle"
          style={{ scrollMarginTop: '2.5rem' }} // breathing room when a CTA scrolls to this id
        >
          {preheading}
        </Text>
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

/* Page */

/**
 * The system's front door. Composed entirely from shipped components, so the
 * page is itself a specimen of the thing it introduces. Where the system has no
 * component yet (page grid, the record index) the markup is plain and flagged.
 */
export interface IntroductionProps {
  /**
   * A theme's photographic-plate treatment, applied to the record index plate.
   * Optional — treatments are additive, never a dependency; a theme without one
   * passes nothing and the plate renders as a plain inverse surface.
   */
  plateTreatment?: string;
  /**
   * A theme's effect treatment, applied ambiently to the stats card — a demo of
   * a downstream team reusing an exported treatment on a plain surface. South
   * Sea has none and passes nothing.
   */
  statsTreatment?: string;
  /**
   * The footer plate photo — resolved per theme by the story, the same shape
   * as `plateTreatment`. Defaults to Pearl's for a standalone render.
   */
  footerPlateSrc?: string;
  footerPlateAlt?: string;
  /**
   * The page's theme switcher, rendered in the masthead's `actions` slot.
   * Threaded in from the story (it drives Storybook's globals); the page
   * renders fine without it.
   */
  themeControl?: ReactNode;
}

/**
 * Wraps the page in `lenis`'s smooth-scroll layer so `useLenis` works in the
 * page and its sticky header. Landing-page-only experiment — `lenis` / `motion`
 * are devDependencies scoped to `src/introduction/` (DECISIONS.md 0009). Under
 * `prefers-reduced-motion` the layer is skipped and everything falls back to
 * native scrolling.
 */
export function Introduction(props: IntroductionProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <IntroductionPage {...props} />;
  return (
    <ReactLenis root>
      <IntroductionPage {...props} />
    </ReactLenis>
  );
}

function IntroductionPage({
  plateTreatment = '',
  statsTreatment = '',
  footerPlateSrc = pearlFooterPlate.src,
  footerPlateAlt = pearlFooterPlate.alt,
  themeControl,
}: IntroductionProps) {
  const lenis = useLenis();
  // Marks the hero's bottom edge for `AutoHideHeader` — while it's on screen the
  // masthead rides in flow; past it, the masthead goes sticky and summon-on-scroll.
  const heroSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In Storybook's preview iframe a hash in the top-level URL never triggers
    // the browser's native anchor-scroll. Read it off whichever window has it
    // and scroll manually.
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
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { immediate: true });
    else el.scrollIntoView();
  }, [lenis]);

  return (
    <>
      {/* Masthead + hero are full-bleed, outside `page`'s max-width container,
          so their borders reach the viewport edge. `AutoHideHeader` gives the
          masthead its sticky / summon-on-scroll behavior once the hero is past;
          the sentinel below the hero is how it knows. */}
      <AutoHideHeader heroSentinelRef={heroSentinelRef}>
        <SiteHeader
          // Pearl-only page — the wordmark comes straight from
          // `pearlBrandWordmark` so there's no second hardcoded 'pearl'.
          brandName={pearlBrandWordmark.text}
          brandRole={pearlBrandWordmark.role}
          actions={themeControl}
        />
      </AutoHideHeader>

      {/* Primary CTA scrolls to Conventions; secondary jumps to the component
          docs (`_top` escapes the preview iframe). The playground has its own
          section below, not a hero CTA. */}
      <Hero
        primaryHref="#conventions"
        primaryLabel="See how it's built"
        onPrimaryClick={(e) => scrollToConventions(e, lenis)}
        secondaryHref="/?path=/docs/components-alert--docs"
        secondaryLabel="Browse components"
        secondaryTarget="_top"
      />
      <div ref={heroSentinelRef} aria-hidden="true" style={{ height: 0 }} />

      <div className={css.page}>
        <div className={css.sectionFlow}>
          {/* Reskinning — show, then tell: the live theme specimens (the proof)
              come first, the title and standfirst follow as a caption. Not
              `SectionHead` — its title-beside-standfirst shape is for the
              tell-first case. */}
          <section>
            <div className={css.sectionBody}>
              <Stack gap="sm">
                <Text
                  as="h2"
                  typeScale="displaySm"
                  measure="sm"
                  style={{ margin: 0, textAlign: 'center' }}
                >
                  One contract, any number of themes
                </Text>
              </Stack>

              <div className={css.themeGrid}>
                {specimenOrder.map((theme) => (
                  <ThemeSpecimenFrame key={theme} theme={theme} />
                ))}
              </div>

              <Stack gap="sm">
                <Text
                  as="p"
                  typeScale="bodyMd"
                  prominence="subtle"
                  measure="sm"
                  style={{ margin: 0 }}
                >
                  Every component reads only from the theme contract — never a
                  hardcoded color, space, or type value. Swapping the theme
                  files reskins the whole system with no component code touched.
                </Text>
              </Stack>
            </div>
          </section>

          {/* The premise — one Card, headline beside two labelled beats
              ("The shift" / "The testbed"), the same preheading-label pattern
              the record's detail panel uses. */}
          <section>
            <div className={css.sectionBody}>
              <Card padding="xl">
                <div className={css.premiseGrid}>
                  <Text
                    as="h2"
                    typeScale="displaySm"
                    measure="sm"
                    style={{ margin: 0, maxWidth: '11ch' }}
                  >
                    Pearl is an{' '}
                    <Text as="span" role="inlineEmphasis">
                      experiment
                    </Text>{' '}
                    — not a finished product.
                  </Text>

                  <Stack gap="md">
                    <Stack gap="xs">
                      <Text
                        role="preheading"
                        as="p"
                        typeScale="caption"
                        prominence="subtle"
                      >
                        The shift
                      </Text>
                      <Text
                        as="p"
                        typeScale="bodyLg"
                        measure="lg"
                        style={{ margin: 0 }}
                      >
                        AI is changing what a design system can be — foundations
                        and component contracts as data an agent reads directly,
                        documentation that can't drift from the code,
                        conventions legible enough to build against without
                        exhaustive onboarding or guesswork.
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
                        measure="lg"
                        style={{ margin: 0 }}
                      >
                        Pearl is where those possibilities get tried, met with
                        curiosity. Exploration runs wide; adoption is deliberate
                        and slow — an approach becomes convention only once
                        building with it has shown it worth keeping.
                      </Text>
                    </Stack>
                  </Stack>
                </div>
              </Card>
            </div>
          </section>

          {/* Conventions */}
          <section>
            <div className={css.sectionBody}>
              <SectionHead
                preheading="Conventions"
                title="How Pearl is built — and what's still being tested"
                standfirst="The conventions the system commits to, and the ones still being evaluated. Adopted ones would take a real reason to reverse; the open ones are approaches taken up to find out whether they hold up — where reversing later is the method working, not a failure. Each is dated to when the thinking behind it was done."
              />

              {/* No Table component — this framed index is plain markup. */}
              <div className={css.indexPanel}>
                <div className={css.indexRailTop}>
                  <div className={css.indexRailCell}>
                    <Text
                      role="preheading"
                      as="p"
                      typeScale="caption"
                      prominence="subtle"
                    >
                      Convention
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
                      No. {decisions[0]?.id} —{' '}
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
                  {/* `plateTreatment` is threaded in from the story; the page
                    must render correctly with none. */}
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
                          {/* `preheading` resolves to each theme's mono face —
                            without the role the ordinal reads as body text, not
                            an index number. */}
                          <Text
                            role="preheading"
                            as="span"
                            typeScale="caption"
                            prominence="subtle"
                            className={css.indexOrdinal}
                          >
                            {decision.id}
                          </Text>

                          <div className={css.indexTitleCell}>
                            <Text
                              as="h3"
                              typeScale="displayLg"
                              className={css.indexTitle}
                              style={{ margin: 0 }}
                            >
                              {decision.subject}
                            </Text>
                          </div>

                          <Row
                            gap="sm"
                            align="center"
                            className={css.indexMeta}
                          >
                            {/* Colour marks the exception: most rows are
                              adopted and stay subtle; the in-evaluation ones
                              take `accent`. */}
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
                              {decision.status === 'accepted'
                                ? 'adopted'
                                : 'in evaluation'}{' '}
                              / {formatMonthYear(decision.date)}
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
                              measure="lg"
                              style={{ margin: 0 }}
                            >
                              {decision.cost}
                            </Text>
                            {decision.link && (
                              <Link
                                href={decision.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {decision.link.label} →
                              </Link>
                            )}
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
                    {acceptedCount} adopted / {proposedCount} in evaluation
                  </Text>
                  <Text
                    role="preheading"
                    as="p"
                    typeScale="caption"
                    prominence="subtle"
                  >
                    the conventions
                  </Text>
                </div>
              </div>
            </div>
          </section>

          {/* Playground — the manifest convention shown working. The run is
              written up in `docs/playground/`; regenerate the image
              (`public/images/`) if the assistant's output changes materially. */}
          <section>
            <div className={css.sectionBody}>
              <div className={css.playgroundHead}>
                <div className={css.playgroundHeadLead}>
                  <div className={css.sectionTick} aria-hidden="true" />
                  <Text
                    id="playground"
                    role="preheading"
                    as="p"
                    typeScale="caption"
                    prominence="subtle"
                  >
                    Playground
                  </Text>
                  <Text
                    as="h2"
                    typeScale="headingLg"
                    measure="sm"
                    style={{ margin: 0 }}
                  >
                    An agent builds with Pearl
                  </Text>
                  <div className={css.playgroundCta}>
                    <a
                      href="https://msanagu.github.io/pearl-playground/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="primary">Open the playground →</Button>
                    </a>
                    <Text
                      as="p"
                      typeScale="bodySm"
                      prominence="subtle"
                      measure="md"
                      className={css.playgroundNote}
                    >
                      Runs in your browser with your own Anthropic API key.
                    </Text>
                  </div>
                </div>
                <Text
                  as="p"
                  typeScale="bodyMd"
                  prominence="subtle"
                  measure="md"
                  style={{ margin: 0 }}
                >
                  Pearl's manifest and llms.txt ship in the package, so any
                  coding agent works from that context directly — no retrieval
                  layer, no MCP server. The aim: build from real primitives,
                  compose what's missing from them, and flag the gap rather than
                  invent an API. The playground is one way to try it.
                </Text>
              </div>

              <figure className={css.playgroundShot}>
                <div className={css.playgroundFrame}>
                  <img
                    src="/images/pearl-playground-thread.png"
                    alt="Pearl Playground: on the left, a coding agent's thread reasoning about the design system; on the right, a live-rendered notification settings panel with a success alert, three toggle rows, and Save changes / Reset buttons."
                    className={css.playgroundImage}
                  />
                </div>
                <figcaption className={css.playgroundCaption}>
                  <Text
                    as="p"
                    typeScale="bodySm"
                    prominence="subtle"
                    measure="md"
                    style={{ margin: 0 }}
                  >
                    One prompt — “a notification settings panel”. Pearl has no
                    toggle component, so the agent surfaced that as a gap,
                    composed a candidate from existing primitives using the
                    system's own tokens, and flagged it for promotion into the
                    system — rather than inventing an API that isn't there.
                  </Text>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Stats */}
          <section className={css.narrowContent} aria-label="What is shipped">
            <Card padding="xl" className={statsTreatment}>
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

          {/* Next */}
          <section>
            <div className={css.sectionBody}>
              <SectionHead preheading="Start here" title="Where to go next" />

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

      {/* Footer — full-bleed outside `page`, the way the hero is. The wordmark
          is Pearl's own text; the plate photo is threaded in per theme by the
          story, like `plateTreatment`. */}
      <Footer
        brandName={pearlBrandWordmark.text}
        brandRole={pearlBrandWordmark.role}
        plateImageSrc={footerPlateSrc}
        plateImageAlt={footerPlateAlt}
      />
    </>
  );
}
