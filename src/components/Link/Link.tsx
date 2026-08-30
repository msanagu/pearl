import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { link } from './Link.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

/**
 * Navigation — bare text with an underline, per the affordance split in
 * `docs/foundations/control-affordances.md`: a bordered or filled box reads as
 * an action on this page, underlined text reads as "you will end up somewhere
 * else". This is the component that owns the text-only look, not a borderless
 * `Button` variant.
 *
 * Always an `<a>`. A text-only *action* (a tertiary "Cancel") should stay a
 * `<button>` in the markup for keyboard and AT semantics while wearing link
 * clothing — pass this component's class to it rather than reaching for
 * `Link` and an `onClick`.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <a
        ref={ref}
        data-component="link"
        className={clsx(link, className)}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

Link.displayName = 'Link';
