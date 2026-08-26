import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { card, cardInteractive, cardHeader, cardBody } from './Card.css';

export type CardProps =
  | ({ href?: undefined; children?: ReactNode } & HTMLAttributes<HTMLDivElement>)
  | ({ href: string; children?: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>);

// `Card.Header` / `Card.Body` are static-property namespacing, NOT a Context
// compound component — there is no shared state, so none is used (ADR-0002).
// Each subcomponent is independently simple
// and renders the `data-component`/`data-part` override contract.
//
// `href` makes the whole card a link — `data-interactive` is the only signal
// this file gives about it. Card stays theme-unaware (ADR-0007 rule 3: components
// render correctly with zero extension capabilities); Pearl's own file is what
// turns `data-interactive` into the luster hover glow, the same way `Text`
// writes `data-role` without knowing what any theme does with it. A card with
// no `href` is not interactive and never lusters, on any theme — luster signals
// "this takes you somewhere," not "this is a card."
function CardRoot({ children, className, href, ...rest }: CardProps) {
  if (href !== undefined) {
    return (
      <a
        data-component="card"
        data-interactive="true"
        href={href}
        className={clsx(card, cardInteractive, className)}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <div
      data-component="card"
      className={clsx(card, className)}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-component="card"
      data-part="header"
      className={clsx(cardHeader, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardBody({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-component="card"
      data-part="body"
      className={clsx(cardBody, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * A surface container. Compose `Card.Header` and `Card.Body` for structure; the
 * root is just the surface/border/radius shell (layout via CSS, no Context).
 * Pass `href` to make the whole card a link — only then does it pick up hover
 * feedback (and, on Pearl, the luster glow); a non-link card stays inert.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
