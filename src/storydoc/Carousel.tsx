import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { Button } from '@components/Button/Button';
import { Icon } from '@components/Icon/Icon';
import { Row } from '@components/Row/Row';
import { Text } from '@components/Text/Text';
import * as css from './Carousel.css';

export interface CarouselProps {
  /** Section heading. Rendered here, not by the caller, so the prev/next
   * controls can share its row and label the track. */
  heading: string;
  children: ReactNode[];
}

/**
 * A horizontally scrollable, snap-aligned row with prev/next controls — for
 * a set of cards too long for one row (see StoryDoc's "Related to"). One
 * layout at every count: a short set simply doesn't scroll, and drops the
 * controls. Not virtualized or infinite; a plain native scroll container is
 * enough at the few-dozen-items scale this renders at.
 *
 * storydoc-only for now — evaluate for promotion to components/ if a second
 * consumer needs a carousel.
 */
export function Carousel({ heading, children }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  // A focused card snaps to the track edge, i.e. under a fade — which would
  // wash out its focus ring on every tab stop. Drop the fades while focus is
  // in the track; the controls still carry the affordance.
  const [focusWithin, setFocusWithin] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 1px slack: fractional layout widths leave scrollLeft a hair short of its
    // true maximum, which would strand `next` enabled at the end of the track.
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Layout effect, not effect: measuring before paint keeps the controls from
  // flashing in once a track that overflows has been measured.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, children.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // No `behavior` — defers to the track's CSS scroll-behavior, which drops
    // to `auto` under prefers-reduced-motion.
    el.scrollBy({ left: direction * el.clientWidth * 0.9 });
  };

  return (
    <div>
      <Row justify="between" align="center" gap="md" className={css.header}>
        <Text
          as="h2"
          typeScale="headingSm"
          id={headingId}
          className={css.heading}
        >
          {heading}
        </Text>
        {(canScrollPrev || canScrollNext) && (
          <div className={css.controls}>
            <Button
              variant="secondary"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              aria-label="Scroll left"
            >
              <Icon icon={PiCaretLeft} size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label="Scroll right"
            >
              <Icon icon={PiCaretRight} size={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      </Row>
      <div
        className={css.viewport}
        onFocus={() => setFocusWithin(true)}
        onBlur={() => setFocusWithin(false)}
      >
        <div
          ref={trackRef}
          className={css.track}
          onScroll={measure}
          // Focusable and named: a scroll container is otherwise unreachable by
          // keyboard in Chrome, and unannounced as a region in a screen reader.
          tabIndex={0}
          role="group"
          aria-labelledby={headingId}
        >
          {children.map((child, i) => (
            <div key={i} className={css.item}>
              {child}
            </div>
          ))}
        </div>
        <div
          className={css.fadeStart}
          style={{ opacity: canScrollPrev && !focusWithin ? 1 : 0 }}
        />
        <div
          className={css.fadeEnd}
          style={{ opacity: canScrollNext && !focusWithin ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
