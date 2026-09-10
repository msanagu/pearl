import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PiCheckCircleFill, PiXCircleFill } from 'react-icons/pi';
import { Text } from '@components/Text/Text';
import type { ManifestRef } from '@/manifest/schema';
import type {
  StoryDoc as StoryDocData,
  DocSection,
  GuidelinesBlock,
  StepsBlock,
} from './types';
import { useRelatedLinks } from './useRelatedLinks';
import { useInboundRelated } from './useInboundRelated';
import { LinkCard } from './LinkCard';
import { Carousel } from './Carousel';
import * as css from './StoryDoc.css';

// `inverseConvention` -> `Inverse convention`. Only used when a doc gives no
// explicit `heading`.
function humanize(name: string): string {
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sectionAnchor(section: DocSection, index: number): string {
  return section.title ? slug(section.title) : `section-${index + 1}`;
}

// One rail row: either a doc section or a `demoSections` entry — same shape
// once reduced to what the rail needs to render and group.
type RailEntry = { key: string; href: string; label: string; caption?: string };
type RailGroup = { caption?: string; entries: RailEntry[] };

// Entries are keyed by caption, not by adjacency: a demo entry (rendered
// early, before doc.sections) and a doc-section entry can share a caption
// without sitting next to each other in the combined list, and should still
// land in one rail group. First occurrence sets the group's position;
// uncaptioned entries never merge and each keep their own flat slot.
function groupRailEntries(entries: RailEntry[]): RailGroup[] {
  const groups: RailGroup[] = [];
  const byCaption = new Map<string, RailGroup>();
  for (const entry of entries) {
    if (entry.caption) {
      let group = byCaption.get(entry.caption);
      if (!group) {
        group = { caption: entry.caption, entries: [] };
        byCaption.set(entry.caption, group);
        groups.push(group);
      }
      group.entries.push(entry);
    } else {
      groups.push({ caption: undefined, entries: [entry] });
    }
  }
  return groups;
}

function GuidelineGroup({
  kind,
  items,
}: {
  kind: 'do' | 'dont';
  items: GuidelinesBlock['items'];
}) {
  const isDont = kind === 'dont';
  const Glyph = isDont ? PiXCircleFill : PiCheckCircleFill;
  return (
    <div className={css.guidelineGroup}>
      <p className={css.groupHead}>
        <Glyph
          size={16}
          className={isDont ? css.markerDont : css.markerDo}
          aria-hidden="true"
        />
        {isDont ? 'Don’t' : 'Do'}
      </p>
      <ul
        className={`${css.groupItems} ${
          isDont ? css.groupItemsDont : css.groupItemsDo
        }`}
      >
        {items.map((i, n) => {
          const soft = i.level === 'should' || i.level === 'should-not';
          return (
            <li
              key={n}
              className={`${css.statement} ${
                soft ? css.statementSoft : ''
              }`.trim()}
            >
              {i.statement}
              {i.detail && <span className={css.detail}>{i.detail}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GuidelinesSection({ block }: { block: GuidelinesBlock }) {
  const dos = block.items.filter((i) => !i.level.includes('not'));
  const donts = block.items.filter((i) => i.level.includes('not'));
  return (
    <>
      {dos.length > 0 && <GuidelineGroup kind="do" items={dos} />}
      {donts.length > 0 && <GuidelineGroup kind="dont" items={donts} />}
    </>
  );
}

// Numbered procedure — only reachable when `showSteps` keeps 'steps' blocks
// in `visible` (see StoryDoc below); otherwise they're filtered out before
// SectionBody ever sees one.
function StepsSection({ block }: { block: StepsBlock }) {
  return (
    <ol className={css.stepsList}>
      {block.items.map((item, n) => (
        <li key={n} className={css.stepItem}>
          <span className={css.stepNumber} aria-hidden="true">
            {n + 1}
          </span>
          <div>
            <Text as="p" typeScale="bodyMd" className={css.stepTitle}>
              {item.title}
            </Text>
            {item.description && (
              <Text
                as="p"
                typeScale="bodyMd"
                prominence="subtle"
                className={css.stepDescription}
              >
                {item.description}
              </Text>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function SectionBody({ section }: { section: DocSection }) {
  switch (section.kind) {
    case 'guidelines':
      return <GuidelinesSection block={section} />;
    case 'definitions':
      return (
        <div className={css.tableScroll}>
          <table className={css.table}>
            <tbody>
              {section.items.map((d, n) => (
                <tr key={n}>
                  <th scope="row" className={css.term}>
                    {d.term}
                  </th>
                  <td className={css.def}>
                    {d.definition}
                    {d.usage && <span className={css.usage}>{d.usage}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'steps':
      return <StepsSection block={section} />;
    case 'note':
      return (
        <Text as="p" measure="lg" className={css.noteBody}>
          {section.body}
        </Text>
      );
  }
}

function RelatedSection({
  related,
  entityId,
}: {
  related: ManifestRef[];
  entityId?: string;
}) {
  const outbound = useRelatedLinks(related);
  const inbound = useInboundRelated(entityId ?? '');
  // Dedupe by title — a component could in principle be reachable both
  // ways (it points at this entity AND this entity points at it), which
  // should still read as one card, not two.
  const seen = new Set(outbound.map((l) => l.title));
  const links = [...outbound, ...inbound.filter((l) => !seen.has(l.title))];
  if (links.length === 0) return null;
  const cards = links.map((link, i) => (
    <LinkCard
      key={i}
      title={link.title}
      description={link.description}
      href={link.href}
    />
  ));
  return (
    <section className={css.section} id="related-to">
      <Carousel heading="Related to">{cards}</Carousel>
    </section>
  );
}

export interface StoryDocProps {
  doc: StoryDocData;
  /** The live demo — rendered between the overview and the guidance. */
  children?: ReactNode;
  /**
   * TOC entries for headings that live inside `children` — a live demo's
   * markup isn't data StoryDoc can read `title`/anchor off of like `doc.sections`,
   * so the caller declares them here and owns matching `id`s on its own headings.
   * An optional `caption` joins the entry into the same rail group as any
   * doc section sharing that caption.
   */
  demoSections?: { title: string; id: string; caption?: string }[];
  /**
   * Render `steps` blocks as a numbered list instead of hiding them.
   * Steps are contributor/agent verification content — manifest-only by
   * default (see the `visible` filter below). No page currently opts in.
   */
  showSteps?: boolean;
  /**
   * This entity's own manifest id (e.g. `foundation.space`, `pattern.alignment`)
   * — powers the "Related to" section's inbound half (every other entity that
   * points at this one; see useInboundRelated). Not derivable from `doc` alone:
   * `doc.name` is a separate, unrelated namespace (`spaceDoc.name` is
   * `'sizingGrid'`, not `'space'`). Omit on a page with no id (rare) to skip
   * only the inbound half — a page's own outbound `doc.related` still renders.
   */
  entityId?: string;
}

export function StoryDoc({
  doc,
  children,
  demoSections = [],
  showSteps = false,
  entityId,
}: StoryDocProps) {
  // `steps` is manifest-only unless `showSteps` opts a page into rendering it.
  const visible = doc.sections
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => showSteps || s.kind !== 'steps');
  const titled = visible.filter(({ s }) => s.title);

  // Section headings and the rail only earn their place when there's more than
  // one section to navigate between. A lone section's Do/Don't headers label it.
  const multi = visible.length > 1;
  const hasRail = demoSections.length + titled.length > 1;

  // Demo entries first — they render before doc.sections on the page, and
  // groupRailEntries preserves that ordering inside a merged caption group.
  const railEntries: RailEntry[] = [
    ...demoSections.map((d) => ({
      key: `demo-${d.id}`,
      href: `#${d.id}`,
      label: d.title,
      caption: d.caption,
    })),
    ...titled.map(({ s, i }) => ({
      key: `doc-${i}`,
      href: `#${sectionAnchor(s, i)}`,
      label: s.title as string,
      caption: s.caption,
    })),
  ];

  // Scroll-spy: which rail entry is "current" as the reader scrolls the
  // article. Keyed by id string (not the array) so the effect only
  // re-observes when the actual set of anchors changes between stories.
  const railIds = railEntries.map((e) => e.href.slice(1));
  const railIdsKey = railIds.join('|');
  const [activeId, setActiveId] = useState<string | undefined>(railIds[0]);
  const intersectingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Reset baseline whenever the section list itself changes (Storybook
    // switching stories) — otherwise a stale id from the previous doc could
    // stick until the next scroll/intersection event fires.
    setActiveId(railIds[0]);
    // No rail below the 1180px breakpoint (css.rail: display: none) and
    // nothing to spy on for a single-section page — skip the observer.
    if (!hasRail || railIds.length === 0) return;
    const elements = railIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    intersectingRef.current = new Set();
    const lastId = railIds[railIds.length - 1];

    // Single source of truth for both triggers below, so they can't race
    // and stomp on each other's result on the same scroll tick.
    function resolveActive(): string | undefined {
      // A short trailing section can end before its heading ever reaches
      // the band below — nothing left to scroll through. Reaching the true
      // page bottom always means "reading the last section," so that wins
      // outright rather than leaving the last rail entry unreachable.
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 2) return lastId;
      // Otherwise: last id (in document order) still inside the band —
      // the section whose heading most recently crossed near the top.
      return railIds.filter((id) => intersectingRef.current.has(id)).pop();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            intersectingRef.current.add(entry.target.id);
          else intersectingRef.current.delete(entry.target.id);
        }
        const next = resolveActive();
        if (next) setActiveId(next);
      },
      // Thin band near the top of the viewport, not the whole screen —
      // sections don't overlap, so at most one heading occupies it at a
      // time. Avoids two simultaneously-visible sections both reading "current".
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    function onScroll() {
      const next = resolveActive();
      if (next) setActiveId(next);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasRail, railIdsKey]);

  return (
    <div className={`${css.page} ${hasRail ? css.pageWithRail : ''}`.trim()}>
      <article className={css.article}>
        <header className={css.header}>
          <Text as="h1" typeScale="headingLg">
            {doc.heading ?? humanize(doc.name)}
          </Text>
          <Text
            as="p"
            typeScale="bodyLg"
            prominence="subtle"
            measure="md"
            className={css.lede}
          >
            {doc.overview}
          </Text>
        </header>

        {children && <div className={css.demo}>{children}</div>}

        {visible.map(({ s: section, i }, idx) => {
          // A category boundary is a caption change from the prior rendered
          // section — including into/out of no caption. The first section
          // never counts: nothing precedes it to separate from.
          const isNewCategory =
            idx > 0 && section.caption !== visible[idx - 1]?.s.caption;
          return (
            <section
              key={i}
              className={`${css.section} ${
                isNewCategory ? css.sectionNewCategory : ''
              }`.trim()}
              id={sectionAnchor(section, i)}
            >
              {multi && section.caption && (
                <Text
                  role="contextLabel"
                  as="p"
                  typeScale="caption"
                  prominence={isNewCategory ? 'default' : 'subtle'}
                  className={`${css.sectionCaption} ${
                    isNewCategory ? css.sectionCaptionNewCategory : ''
                  }`.trim()}
                >
                  {section.caption}
                </Text>
              )}
              {multi && section.title && (
                <Text
                  as="h2"
                  typeScale="headingSm"
                  className={css.sectionTitle}
                >
                  {section.title}
                </Text>
              )}
              <SectionBody section={section} />
            </section>
          );
        })}

        {(doc.related?.length || entityId) && (
          <RelatedSection related={doc.related ?? []} entityId={entityId} />
        )}
      </article>

      {hasRail && (
        <nav className={css.rail} aria-label="On this page">
          <Text
            as="p"
            typeScale="caption"
            prominence="subtle"
            className={css.railLabel}
          >
            On this page
          </Text>
          {/* role="list": a nested <ul> now sits inside this one, and
              list-style: none already risks Safari/VoiceOver dropping list
              semantics (see Setup.tsx's role="list" fix for the same bug). */}
          <ul className={css.railList} role="list">
            {groupRailEntries(railEntries).map((group, gi) =>
              group.caption ? (
                <li key={`group-${gi}`} className={css.railGroup}>
                  <Text
                    id={`rail-group-${gi}`}
                    as="p"
                    typeScale="caption"
                    prominence="subtle"
                    className={css.railGroupLabel}
                  >
                    {group.caption}
                  </Text>
                  <ul
                    className={css.railSubList}
                    role="list"
                    aria-labelledby={`rail-group-${gi}`}
                  >
                    {group.entries.map((e) => (
                      <li key={e.key}>
                        <a
                          className={css.railLink}
                          href={e.href}
                          aria-current={
                            activeId === e.href.slice(1) ? 'true' : undefined
                          }
                        >
                          {e.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                // Uncaptioned entries are always a single-entry group (see
                // groupRailEntries) — same top-level spacing as a caption group.
                group.entries.map((e) => (
                  <li key={e.key} className={css.railGroup}>
                    <a
                      className={css.railLink}
                      href={e.href}
                      aria-current={
                        activeId === e.href.slice(1) ? 'true' : undefined
                      }
                    >
                      {e.label}
                    </a>
                  </li>
                ))
              ),
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
