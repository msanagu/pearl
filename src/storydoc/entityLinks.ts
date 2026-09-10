// Shared by useRelatedLinks (a doc's own outbound `related`) and
// useInboundRelated (every other entity's `related` that points back at this
// one) — both need the same id parsing, title-guessing, and story-index
// lookup, just walking the graph in opposite directions.

export interface ResolvedLink {
  title: string;
  description: string;
  href?: string;
}

// `component.Tag` -> ('component', 'Tag'); `foundation.space` -> ('foundation', 'space').
export function splitId(to: string): { kind: string; name: string } {
  const dot = to.indexOf('.');
  return dot === -1
    ? { kind: to, name: '' }
    : { kind: to.slice(0, dot), name: to.slice(dot + 1) };
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Storybook `title`s to try, most-specific first — a split component
// (Tag, Stack: .api/.usage sibling files) has no single combined title, so
// Usage (more relevant to a "related to" cross-ref than raw props) is tried
// before the bare/API forms. Foundations, patterns and rationale entries are
// each still one flat page, so they only ever have the one candidate.
export function titleCandidates(kind: string, name: string): string[] {
  switch (kind) {
    case 'component':
      return [`Components/${name}/Usage`, `Components/${name}`, `Components/${name}/API`];
    case 'foundation':
      return [`Foundations/${capitalize(name)}`];
    case 'pattern':
      return [`Patterns/${capitalize(name)}`];
    case 'rationale':
      return [`Getting Started/Rationale/${capitalize(name)}`];
    default:
      return [];
  }
}

export interface IndexEntry {
  id: string;
  title: string;
  type?: string;
}

// Fetched once per session, relative (not `/index.json`) so it resolves
// correctly under a deployed subpath the same way Setup's own `?path=`
// hrefs do — both share this preview document's own URL as their base.
let indexPromise: Promise<IndexEntry[] | null> | null = null;
export function fetchIndexEntries(): Promise<IndexEntry[] | null> {
  indexPromise ??= fetch('index.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((json: unknown) => {
      if (!json || typeof json !== 'object') return null;
      const { entries, stories } = json as {
        entries?: Record<string, IndexEntry>;
        stories?: Record<string, IndexEntry>;
      };
      return Object.values(entries ?? stories ?? {});
    })
    .catch(() => null);
  return indexPromise;
}

export function resolveHref(
  entries: IndexEntry[],
  kind: string,
  name: string,
): string | undefined {
  for (const title of titleCandidates(kind, name)) {
    const matches = entries.filter((e) => e.title === title);
    const found = matches.find((e) => e.type === 'docs') ?? matches[0];
    if (found) return `./?path=/${found.type ?? 'story'}/${found.id}`;
  }
  return undefined;
}
