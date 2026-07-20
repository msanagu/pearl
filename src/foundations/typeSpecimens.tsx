import { useCallback, useState } from 'react';
import { color, fontFamily } from '../tokens';
import * as css from './tokens.css';

/**
 * Shared specimen components for Foundations stories — used by both
 * Tokens.stories.tsx (canon color/space/etc.) and Typography.stories.tsx
 * (canon type + per-theme role treatments). Not a story file itself.
 */

/** Reads one or more computed CSS properties off the DOM node it's attached to. */
export function useComputed<T extends HTMLElement>(props: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const key = props.join(',');
  const ref = useCallback(
    (node: T | null) => {
      if (!node) return;
      const computed = getComputedStyle(node);
      const next: Record<string, string> = {};
      for (const prop of props) next[prop] = computed.getPropertyValue(prop).trim();
      setValues(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `props` is a fresh array each render; `key` is the real dependency.
    [key],
  );
  return [ref, values] as const;
}

export function FamilySwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const [ref, resolved] = useComputed<HTMLDivElement>(['font-family']);
  return (
    <div className={css.cell}>
      <span ref={ref} className={css.familySample} style={{ fontFamily: cssVar, color: color.text }}>
        Aa — quick brown fox
      </span>
      <span>{name}</span>
      <span className={css.resolvedValue}>{resolved['font-family']}</span>
    </div>
  );
}

export function WeightSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const [ref, resolved] = useComputed<HTMLDivElement>(['font-weight']);
  return (
    <div className={css.cell}>
      <span
        ref={ref}
        className={css.weightSwatch}
        style={{ fontWeight: cssVar, color: color.text, fontFamily: fontFamily.body }}
      >
        Ag
      </span>
      <span>{name}</span>
      <span className={css.resolvedValue}>{resolved['font-weight']}</span>
    </div>
  );
}

export function TypeSpecimen({
  name,
  variant,
}: {
  name: string;
  variant: { fontSize: string; lineHeight: string; fontWeight: string; letterSpacing: string };
}) {
  const [ref, resolved] = useComputed<HTMLSpanElement>([
    'font-size',
    'line-height',
    'font-weight',
    'letter-spacing',
  ]);
  return (
    <div className={css.cell}>
      <span>{name}</span>
      <span
        ref={ref}
        style={{
          color: color.text,
          fontSize: variant.fontSize,
          lineHeight: variant.lineHeight,
          fontWeight: variant.fontWeight,
          letterSpacing: variant.letterSpacing,
        }}
      >
        The quick brown fox jumps over the lazy dog
      </span>
      <span className={css.resolvedValue}>
        {resolved['font-size']} / {resolved['line-height']} · weight {resolved['font-weight']} ·
        tracking {resolved['letter-spacing']}
      </span>
    </div>
  );
}
