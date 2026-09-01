import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';

/**
 * The landing page's motion vocabulary — one easing, one distance, one rule:
 * motion reveals content that is already there, it never performs.
 *
 * Everything here is scoped to `src/introduction/`. The shipped components
 * animate on their own terms; nothing in this file reaches them.
 *
 * Under `prefers-reduced-motion` every export degrades to a plain wrapper that
 * renders its children with no transform, no delay, and no counting.
 */

/** Expo-out — the same curve `AutoHideHeader` uses, so the page moves as one. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Reveals travel a short distance. Anything further reads as a slideshow. */
const RISE_PX = 22;

const DURATION = 0.75;

/** Reveal once, slightly before the element's edge clears the fold. */
const VIEWPORT = { once: true, margin: '-12% 0px -8% 0px' } as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds to hold before starting — for hand-tuned pairs, not sequences. */
  delay?: number;
  className?: string;
  /** Set `0` to fade in place (used where a rise would fight a sticky edge). */
  y?: number;
}

/**
 * The workhorse: fade and rise into view, once. Used for whole sections and for
 * single blocks that have no internal set to stagger.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = RISE_PX,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A set that arrives in sequence — specimen frames, stat columns, link cards.
 * The stagger is short on purpose: it should read as one gesture with internal
 * texture, not as items queueing up.
 */
export function Stagger({
  children,
  className,
  gap = 0.1,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        shown: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The item half of `Stagger`, as bare variants — for sets whose items must stay
 * the exact element the CSS expects (the record list's `<details>` siblings
 * carry hairline borders keyed to their position, so they can't be wrapped).
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: RISE_PX },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

/** One item in a `Stagger`. Inherits its timing from the parent's variants. */
export function StaggerItem({
  children,
  className,
  y = RISE_PX,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The accent tick that opens a section, drawn from its left edge. The one piece
 * of decorative motion on the page — it earns its place by being the thing that
 * announces a section, and it is over in a third of a second.
 */
export function DrawTick({ className }: { className: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} aria-hidden="true" />;
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      style={{ transformOrigin: 'left center' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.45, ease: EASE }}
    />
  );
}

/**
 * A stat that counts up the first time it is seen. The page's claims are
 * literal counts derived from the export surface (`liveStats.ts`), so watching
 * them resolve is the one moment where motion carries meaning rather than
 * polish. Non-numeric values and reduced motion render the final value flat.
 */
export function CountUp({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const target = Number(value);
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) return;
    const controls = animate(count, target, { duration: 1.1, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, target, count]);

  if (reduce || Number.isNaN(target)) return <span>{value}</span>;
  return <motion.span ref={ref}>{shown}</motion.span>;
}
