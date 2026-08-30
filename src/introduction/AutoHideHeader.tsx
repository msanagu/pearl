import { useRef, useState } from 'react';
import type { FocusEvent, ReactNode, RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import * as css from './AutoHideHeader.css';

/**
 * The landing page's masthead behavior, wrapped around `<SiteHeader>`.
 *
 * - **While the hero is on screen** the masthead is a plain sticky header,
 *   always visible — no animation, so nothing "pops in" partway down.
 * - **Once the hero is scrolled past**, it starts hiding: scrolling *up*
 *   dismisses it almost instantly, scrolling *down* summons it back and holds
 *   it for {@link IDLE_MS} — long enough to reach the theme / mode switchers —
 *   then it slides away.
 * - Moving the pointer over it, or focusing a control inside it, cancels the
 *   countdown and suspends scroll-up-to-dismiss, so it can't vanish mid
 *   theme-change. Leaving / blurring restarts the countdown.
 *
 * Landing-page only — `motion` and `lenis` are devDependencies scoped to
 * `src/introduction/` (DECISIONS.md 0009). Under `prefers-reduced-motion` the
 * summon / dismiss is dropped: it stays a plain sticky header throughout.
 */
const IDLE_MS = 3000;

// Ignore sub-pixel scroll jitter when reading direction.
const DIR_THRESHOLD_PX = 0.5;

interface AutoHideHeaderProps {
  children: ReactNode;
  /**
   * Marks the bottom edge of the hero. While it sits below the top of the
   * viewport the masthead stays put; once it passes above, the summon / dismiss
   * behavior takes over.
   */
  heroSentinelRef: RefObject<HTMLElement | null>;
}

export function AutoHideHeader({
  children,
  heroSentinelRef,
}: AutoHideHeaderProps) {
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const pastHero = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScroll = useRef(0);
  const held = useRef(false);

  const clearIdle = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = null;
  };

  const armIdle = () => {
    clearIdle();
    idleTimer.current = setTimeout(() => {
      if (!held.current) setHidden(true);
    }, IDLE_MS);
  };

  useLenis((lenis: Lenis) => {
    if (reduceMotion) return;
    const y = lenis.scroll;
    const delta = y - lastScroll.current;
    lastScroll.current = y;

    const sentinel = heroSentinelRef.current;
    pastHero.current = sentinel
      ? sentinel.getBoundingClientRect().top <= 0
      : false;

    if (!pastHero.current) {
      // Hero still in view — plain sticky header, always shown.
      clearIdle();
      setHidden(false);
      return;
    }
    // Past the hero — summon on scroll-down, dismiss on scroll-up.
    if (delta > DIR_THRESHOLD_PX) {
      setHidden(false);
      armIdle();
    } else if (delta < -DIR_THRESHOLD_PX && !held.current) {
      clearIdle();
      setHidden(true);
    }
  });

  const hold = () => {
    held.current = true;
    clearIdle();
    setHidden(false);
  };
  const release = () => {
    held.current = false;
    if (pastHero.current) armIdle();
  };
  const releaseOnBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    release();
  };

  if (reduceMotion) {
    return <div className={css.bar}>{children}</div>;
  }

  return (
    <motion.div
      className={css.bar}
      data-hidden={hidden || undefined}
      initial={false}
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={releaseOnBlur}
    >
      {children}
    </motion.div>
  );
}
