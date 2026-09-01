import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { skeleton } from './Skeleton.css';

type SkeletonVariants = NonNullable<RecipeVariants<typeof skeleton>>;
export type SkeletonVariant = NonNullable<SkeletonVariants['variant']>;
export type SkeletonTypeScale = NonNullable<SkeletonVariants['typeScale']>;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `text` for a line of copy (sized from `typeScale`), `block` for a sized
   * object — an image, a control, a card — and `circle` for an avatar or dot.
   * @default 'text'
   */
  variant?: SkeletonVariant;
  /**
   * Which line box a `text` placeholder matches, so the real copy replaces it
   * without shifting. Ignored by the other variants.
   * @default 'bodyMd'
   */
  typeScale?: SkeletonTypeScale;
  /** Vary this across the lines of a paragraph — see the component note. */
  width?: CSSProperties['width'];
  /** Required for `block`; there is no sensible default size for "an object". */
  height?: CSSProperties['height'];
}

/**
 * A loading placeholder shaped like the content that will replace it.
 *
 * There is no `lines` or `rows` prop, and no per-shape component: a paragraph
 * is three `Skeleton`s in a `Stack`, a card header is a circle beside two
 * lines. Composing the real layout out of placeholders is what makes the swap
 * invisible — a configured "paragraph skeleton" can only ever approximate a
 * layout it cannot see.
 *
 * Motion is plain CSS, deliberately: a Skeleton paints before whatever
 * JavaScript the consumer is waiting on, so it can't depend on an animation
 * runtime. It drops to a static tint under `prefers-reduced-motion`.
 *
 * Accessibility: a Skeleton is decorative and hidden from assistive tech —
 * announcing "loading, loading, loading" per placeholder is noise. Say it once
 * on the region instead, with `aria-busy` on the container (and `aria-live` if
 * the wait is long enough to warrant an announcement).
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      typeScale = 'bodyMd',
      width,
      height,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-component="skeleton"
        data-variant={variant}
        className={clsx(
          skeleton({
            variant,
            // The scale only sizes a line of type; on a `block` it would fight
            // the caller's own `height`, and on a `circle` its aspect ratio.
            typeScale: variant === 'text' ? typeScale : undefined,
          }),
          className,
        )}
        style={{ width, height, ...style }}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
