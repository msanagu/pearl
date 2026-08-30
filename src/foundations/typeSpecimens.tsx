import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { color, fontFamily } from '@tokens';
import * as css from './tokens.css';

/**
 * Shared specimen components for Foundations stories — used by both
 * Tokens.stories.tsx (canon color/space/etc.) and Typography.stories.tsx
 * (canon type + per-theme role treatments). Not a story file itself.
 */

// Re-exported so specimens and nav render from one source, not parallel copies.
export { brandWordmarkByTheme } from '@components/_brand/WordMark/brandWordmark';
export { WordMark } from '@components/_brand/WordMark/WordMark';

/**
 * Reads computed CSS properties off the attached node, or off the first
 * descendant matching `selector` (for components like `Text` that don't
 * forward `ref`).
 *
 * Re-reads on `deps` change, not just mount — switching the Storybook theme
 * swaps a class on an ancestor, not the node, so a ref-only read goes stale.
 * Pass the active theme as `deps`.
 */
export function useComputed<T extends HTMLElement>(
  props: string[],
  selector?: string,
  deps: unknown[] = [],
) {
  const [values, setValues] = useState<Record<string, string>>({});
  const nodeRef = useRef<T | null>(null);
  const key = props.join(',');

  const read = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    const target = selector ? node.querySelector<HTMLElement>(selector) : node;
    if (!target) return;
    const computed = getComputedStyle(target);
    const next: Record<string, string> = {};
    for (const prop of props)
      next[prop] = computed.getPropertyValue(prop).trim();
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `props` is a fresh array each render; `key` is the real dependency.
  }, [key, selector]);

  const ref = useCallback(
    (node: T | null) => {
      nodeRef.current = node;
      read();
    },
    [read],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` is caller-supplied and intentionally spread; `read` is stable per `key`/`selector`.
  useLayoutEffect(read, [read, ...deps]);

  return [ref, values] as const;
}

export function FamilySwatch({
  name,
  cssVar,
  theme,
}: {
  name: string;
  cssVar: string;
  theme?: string;
}) {
  const [ref, resolved] = useComputed<HTMLDivElement>(
    ['font-family'],
    undefined,
    [theme],
  );
  return (
    <div className={css.cell}>
      <span
        ref={ref}
        className={css.familySample}
        style={{ fontFamily: cssVar, color: color.text }}
      >
        Aa — quick brown fox
      </span>
      <span>{name}</span>
      <span className={css.resolvedValue}>{resolved['font-family']}</span>
    </div>
  );
}

export function WeightSwatch({
  name,
  cssVar,
  theme,
}: {
  name: string;
  cssVar: string;
  theme?: string;
}) {
  const [ref, resolved] = useComputed<HTMLDivElement>(
    ['font-weight'],
    undefined,
    [theme],
  );
  return (
    <div className={css.cell}>
      <span
        ref={ref}
        className={css.weightSwatch}
        style={{
          fontWeight: cssVar,
          color: color.text,
          fontFamily: fontFamily.body,
        }}
      >
        Ag
      </span>
      <span>{name}</span>
      <span className={css.resolvedValue}>{resolved['font-weight']}</span>
    </div>
  );
}

/** Rounds a computed `"15.9995px"` value to `"16px"` — sub-pixel drift from CSS calc() isn't meaningful to show. */
function roundPx(value?: string): string {
  if (!value) return '';
  const match = value.match(/^(-?[\d.]+)px$/);
  if (!match) return value;
  return `${Math.round(Number(match[1]))}px`;
}

export function TypeSpecimen({
  name,
  variant,
  theme,
}: {
  name: string;
  variant: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
  };
  theme?: string;
}) {
  const [ref, resolved] = useComputed<HTMLSpanElement>(
    ['font-size', 'line-height', 'font-weight', 'letter-spacing'],
    undefined,
    [theme],
  );
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
        {roundPx(resolved['font-size'])} / {roundPx(resolved['line-height'])} ·
        weight {resolved['font-weight']} · tracking {resolved['letter-spacing']}
      </span>
    </div>
  );
}
