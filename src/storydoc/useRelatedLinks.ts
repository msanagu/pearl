import { useEffect, useState } from 'react';
import type { ManifestRef } from '@/manifest/schema';
import {
  splitId,
  capitalize,
  fetchIndexEntries,
  resolveHref,
  type ResolvedLink,
} from './entityLinks';

export type { ResolvedLink };

const REL_DESCRIPTIONS: Record<string, string> = {
  composes: 'Composed in this pattern.',
  'relates-to': 'A related concept.',
  'depends-on': 'A dependency of this pattern.',
  extends: 'Extended by this entry.',
};

/**
 * Resolves a doc's own outbound `related` (ManifestRef[]) into renderable
 * link cards — title/description come straight from the ref's own id and
 * rel (no fetch needed); `href` resolves asynchronously against Storybook's
 * own story index, since a target's real path depends on whether that
 * component has split into `.api`/`.usage` files, which nothing in `related`
 * itself encodes. Cards render immediately, un-linked, and pick up their
 * href once the index resolves. See useInboundRelated for the reverse
 * direction — entities that point at this one, not the other way round.
 */
export function useRelatedLinks(related: ManifestRef[] | undefined): ResolvedLink[] {
  const refs = related ?? [];
  const [hrefs, setHrefs] = useState<Record<number, string | undefined>>({});

  useEffect(() => {
    let cancelled = false;
    fetchIndexEntries().then((entries) => {
      if (cancelled || !entries) return;
      const next: Record<number, string | undefined> = {};
      refs.forEach((ref, i) => {
        if (ref.href) return; // already a literal external href, nothing to resolve
        if (!ref.to) return;
        const { kind, name } = splitId(ref.to);
        next[i] = resolveHref(entries, kind, name);
      });
      setHrefs(next);
    });
    return () => {
      cancelled = true;
    };
    // Keyed on the serialized refs, not the array reference — `related`
    // comes from a doc.ts module and is stable in content but not identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(refs)]);

  return refs.map((ref, i) => {
    const { name } = splitId(ref.to ?? '');
    return {
      title: ref.to ? capitalize(name) : ref.rel,
      description: REL_DESCRIPTIONS[ref.rel] ?? 'Related.',
      href: ref.href ?? hrefs[i],
    };
  });
}
