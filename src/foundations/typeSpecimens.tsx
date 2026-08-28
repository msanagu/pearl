import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { color, fontFamily } from '../tokens';
import { Text } from '../components/Text/Text';
import { pearlBrandWordmark } from '../themes/pearl.roles';
import { tahitianBrandWordmark } from '../themes/tahitian.roles';
import { southSeaBrandWordmark } from '../themes/south-sea.roles';
import * as css from './tokens.css';

/**
 * Shared specimen components for Foundations stories — used by both
 * Tokens.stories.tsx (canon color/space/etc.) and Typography.stories.tsx
 * (canon type + per-theme role treatments). Not a story file itself.
 */

/** Which brand wordmark to show for the Storybook toolbar's active theme — Freshwater falls back to Pearl's rather than fabricating one (it has no role table yet). */
export const brandWordmarkByTheme: Record<string, { text: string; role?: 'inlineEmphasis' }> = {
  pearl: pearlBrandWordmark,
  tahitian: tahitianBrandWordmark,
  southSea: southSeaBrandWordmark,
};

/** The theme's own nav wordmark (same markup as `HeroNav`) rather than a plain heading, so a docs page shows the real branded mark, not a label standing in for it. */
export function Wordmark({
  wordmark,
  className,
}: {
  wordmark: { text: string; role?: 'inlineEmphasis' };
  className?: string;
}) {
  return (
    <Text
      as="h2"
      role={wordmark.role}
      typeScale="displayLg"
      data-component="brand-wordmark"
      className={className}
    >
      {wordmark.text}
    </Text>
  );
}

/**
 * Reads one or more computed CSS properties off the DOM node it's attached
 * to — or, when `selector` is given, off the first descendant matching it.
 * The selector form exists for components (like `Text`) that don't forward
 * `ref`: attach the returned ref to a wrapping element instead and let this
 * hook look inside for the actual styled node.
 *
 * Re-reads whenever `deps` changes, not just on mount. A callback `ref`
 * alone only fires when the DOM NODE is attached/detached — switching the
 * Storybook theme toolbar swaps a CSS class on an ancestor, not the node
 * itself, so a ref-only read goes stale and keeps showing whichever
 * theme's computed style happened to be active at first mount. Pass the
 * active theme (or anything else the resolved value depends on) as `deps`
 * so this re-reads on every value that could change what's computed.
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
    for (const prop of props) next[prop] = computed.getPropertyValue(prop).trim();
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

export function FamilySwatch({ name, cssVar, theme }: { name: string; cssVar: string; theme?: string }) {
  const [ref, resolved] = useComputed<HTMLDivElement>(['font-family'], undefined, [theme]);
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

export function WeightSwatch({ name, cssVar, theme }: { name: string; cssVar: string; theme?: string }) {
  const [ref, resolved] = useComputed<HTMLDivElement>(['font-weight'], undefined, [theme]);
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
  variant: { fontSize: string; lineHeight: string; fontWeight: string; letterSpacing: string };
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
        {roundPx(resolved['font-size'])} / {roundPx(resolved['line-height'])} · weight{' '}
        {resolved['font-weight']} · tracking {resolved['letter-spacing']}
      </span>
    </div>
  );
}
