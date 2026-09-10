import { useRef } from 'react';
import type { ReactNode } from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { Button } from '@components/Button/Button';
import { Icon } from '@components/Icon/Icon';
import * as css from './Carousel.css';

export interface CarouselProps {
  children: ReactNode[];
}

/**
 * A horizontally scrollable, snap-aligned row with prev/next controls — for
 * a set of cards too long for one wrapped row (see StoryDoc's "Related to").
 * Not virtualized or infinite; a plain native scroll container is enough at
 * the few-dozen-items scale this renders at.
 */
export function Carousel({ children }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div>
      <div ref={trackRef} className={css.track}>
        {children.map((child, i) => (
          <div key={i} className={css.item}>
            {child}
          </div>
        ))}
      </div>
      <div className={css.controls}>
        <Button
          variant="secondary"
          onClick={() => scrollByPage(-1)}
          aria-label="Scroll left"
        >
          <Icon icon={PiCaretLeft} size={16} aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => scrollByPage(1)}
          aria-label="Scroll right"
        >
          <Icon icon={PiCaretRight} size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
