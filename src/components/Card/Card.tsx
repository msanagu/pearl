import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { card, cardInteractive, cardHeader, cardBody } from './Card.css';

/**
 * Interior padding — and, since the card's radius derives from it
 * (`radius.control + padding`), its shape. Steps run `md` -> `xl`; no `sm`,
 * which is too tight to carry the derived corner.
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

// Card.Header / Card.Body are static-property namespacing, not a Context
// compound component — no shared state.
//
// `href` makes the whole card a link and sets data-interactive. Card stays
// theme-unaware; a theme file turns data-interactive into a hover treatment.
function CardRoot({ children, className, href, padding, ...rest }: CardProps) {
  // Consumed by the recipe, never spread onto the DOM node.
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

function CardHeader({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
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

function CardBody({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
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
 * A surface container. Compose `Card.Header` / `Card.Body` for structure; the
 * root is the surface/border/radius shell. Pass `href` to make the whole card a
 * link — only then does it pick up hover feedback.
 *
 * `padding` sets interior spacing and corner radius together
 * (`radius.control + padding`); hard-edged themes opt out via `radius.nesting`.
 *
 * **As a flex or grid item, give it a `min-width`.** Card sets `overflow:
 * hidden`, which drops an item's automatic minimum size to zero — without a
 * floor it shrinks past its content and clips it, with no warning.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
