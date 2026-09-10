import { useEffect, useState } from 'react';
import type { ManifestRef } from '@/manifest/schema';
import {
  capitalize,
  fetchIndexEntries,
  resolveHref,
  splitId,
  type ResolvedLink,
} from './entityLinks';

// Framed from the target's point of view — the inverse of useRelatedLinks'
// own REL_DESCRIPTIONS, which is framed from the source's point of view.
const INBOUND_DESCRIPTIONS: Record<string, string> = {
  composes: 'Composes this.',
  'relates-to': 'A related concept.',
  'depends-on': 'Depends on this.',
  extends: 'Extends this.',
};

interface SourceEntity {
  id: string;
  related: ManifestRef[];
}

function idFromPath(path: string, under: string): string | null {
  const match = path.match(new RegExp(`/src/${under}/([^/]+)/`));
  return match?.[1] ?? null;
}

// One flat `related` per module's default-exported meta — component stories
// only, the meta level (not per-story: the inbound lookup is "does this
// component relate to that foundation/pattern at all", the same granularity
// Card's own pre-existing `depends-on foundation.radius` already uses).
function collectComponentSources(): SourceEntity[] {
  const modules = import.meta.glob<{
    default?: { parameters?: { manifest?: { related?: ManifestRef[] } } };
  }>('/src/components/*/*.stories.tsx', { eager: true });
  const sources: SourceEntity[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const name = idFromPath(path, 'components');
    const related = mod.default?.parameters?.manifest?.related;
    if (name && related?.length) sources.push({ id: `component.${name}`, related });
  }
  return sources;
}

// doc.ts sidecars export exactly one meaningful const (spaceDoc, radiusDoc,
// alignmentDoc, ...) — grab whichever export actually has `related` rather
// than assuming its name, since callers don't share a naming convention.
// `import.meta.glob` requires a literal string at each call site (Vite
// statically analyzes it, so it can't be threaded through a parameter) —
// that's why this is three near-identical blocks instead of one helper.
function docSourcesFromModules(
  modules: Record<string, Record<string, { related?: ManifestRef[] } | unknown>>,
  under: string,
  kind: string,
): SourceEntity[] {
  const sources: SourceEntity[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const name = idFromPath(path, under);
    if (!name) continue;
    const doc = Object.values(mod).find(
      (v): v is { related: ManifestRef[] } =>
        typeof v === 'object' && v !== null && Array.isArray((v as { related?: unknown }).related),
    );
    if (doc?.related.length) sources.push({ id: `${kind}.${name}`, related: doc.related });
  }
  return sources;
}

function buildInboundMap(): Map<string, { from: string; rel: string }[]> {
  const foundationModules = import.meta.glob<
    Record<string, { related?: ManifestRef[] } | unknown>
  >('/src/foundations/**/*.doc.ts', { eager: true });
  const patternModules = import.meta.glob<
    Record<string, { related?: ManifestRef[] } | unknown>
  >('/src/patterns/*/*.doc.ts', { eager: true });
  const rationaleModules = import.meta.glob<
    Record<string, { related?: ManifestRef[] } | unknown>
  >('/src/rationale/*/*.doc.ts', { eager: true });

  const sources = [
    ...collectComponentSources(),
    ...docSourcesFromModules(foundationModules, 'foundations', 'foundation'),
    ...docSourcesFromModules(patternModules, 'patterns', 'pattern'),
    ...docSourcesFromModules(rationaleModules, 'rationale', 'rationale'),
  ];
  const map = new Map<string, { from: string; rel: string }[]>();
  for (const source of sources) {
    for (const ref of source.related) {
      if (!ref.to) continue;
      const list = map.get(ref.to) ?? [];
      list.push({ from: source.id, rel: ref.rel });
      map.set(ref.to, list);
    }
  }
  return map;
}

// Computed once per session — every source module is already eager-imported
// by the glob calls above regardless of which entity asks, so there's
// nothing to gain by recomputing per entityId.
let inboundMap: Map<string, { from: string; rel: string }[]> | null = null;

/**
 * The reverse of `related`: every OTHER entity that declares a relation
 * pointing at `entityId`, computed by inverting the whole `related` graph
 * (component/pattern/rationale stories + foundation/pattern/rationale
 * doc.ts sidecars) rather than hand-maintained on the target's own page —
 * see `src/manifest/schema.ts`'s own comment on `related`: authored on the
 * specific/stable side, "the reverse direction is derived by a consumer".
 * This is that consumer.
 */
export function useInboundRelated(entityId: string): ResolvedLink[] {
  inboundMap ??= buildInboundMap();
  const inbound = inboundMap.get(entityId) ?? [];
  const [hrefs, setHrefs] = useState<Record<number, string | undefined>>({});

  useEffect(() => {
    let cancelled = false;
    fetchIndexEntries().then((entries) => {
      if (cancelled || !entries) return;
      const next: Record<number, string | undefined> = {};
      inbound.forEach((link, i) => {
        const { kind, name } = splitId(link.from);
        next[i] = resolveHref(entries, kind, name);
      });
      setHrefs(next);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  return inbound.map((link, i) => {
    const { name } = splitId(link.from);
    return {
      title: capitalize(name),
      description: INBOUND_DESCRIPTIONS[link.rel] ?? 'Related.',
      href: hrefs[i],
    };
  });
}
