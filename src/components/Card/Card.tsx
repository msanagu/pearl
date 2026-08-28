import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { card, cardInteractive, cardHeader, cardBody } from './Card.css';

/**
 * Interior padding — and, because the card's radius derives from it, its shape.
 * See `Card.css.ts`: `radius = radius.control + padding`, so a roomier card is
 * automatically a rounder one, staying concentric with the controls inside it.
 *
 * Steps run `md` -> `xl`; there is no `sm`, which is too tight to carry the
 * derived corner. See the `padding` variant in `Card.css.ts`.
 */
export type CardPadding = 'md' | 'lg' | 'xl';

type CardOwnProps = {
  /** Interior padding for `Card.Header` / `Card.Body`. Defaults to `lg`. */
  padding?: CardPadding;
  children?: ReactNode;
};

export type CardProps =
  | ({ href?: undefined } & CardOwnProps & HTMLAttributes<HTMLDivElement>)
  | ({ href: string } & CardOwnProps & AnchorHTMLAttributes<HTMLAnchorElement>);

// `Card.Header` / `Card.Body` are static-property namespacing, NOT a Context
// compound component — there is no shared state, so none is used (ADR-0002).
// Each subcomponent is independently simple
// and renders the `data-component`/`data-part` override contract.
//
// `href` makes the whole card a link — `data-interactive` is the only signal
// this file gives about it. Card stays theme-unaware (ADR-0007 rule 3: components
// render correctly with zero extension treatments); Pearl's own file is what
// turns `data-interactive` into the luster hover glow, the same way `Text`
// writes `data-role` without knowing what any theme does with it. A card with
// no `href` is not interactive and never lusters, on any theme — luster signals
// "this takes you somewhere," not "this is a card."
function CardRoot({ children, className, href, padding, ...rest }: CardProps) {
  // `padding` is consumed by the recipe, never spread onto the DOM node. An
  // undefined value falls through to the recipe's own `defaultVariants`.
  const rootClass = card({ padding });

  if (href !== undefined) {
    return (
      <a
        data-component="card"
        data-interactive="true"
        href={href}
        className={clsx(rootClass, cardInteractive, className)}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <div
      data-component="card"
      className={clsx(rootClass, className)}
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
 *
 * `padding` sets the interior spacing AND the corner radius together — the
 * radius is derived as `radius.control + padding`, so the card stays concentric
 * with the controls nested inside it. Hard-edged themes opt out via
 * `radius.nesting` and stay square at every padding.
 *
 * **As a flex or grid item, give it a `min-width`.** Card sets `overflow:
 * hidden` (to clip media and backgrounds to the derived radius), and that
 * changes an item's automatic minimum size from `min-content` to zero — so a
 * card in a row will shrink past its own content and clip it rather than
 * refusing to. Nothing warns you; the content just disappears.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
