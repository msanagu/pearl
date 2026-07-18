import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { card, cardHeader, cardBody } from './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// `Card.Header` / `Card.Body` are static-property namespacing, NOT a Context
// compound component — there is no shared state, so none is used (ADR-0002,
// composition-patterns-examples.md). Each subcomponent is independently simple
// and renders the `data-component`/`data-part` override contract.
function CardRoot({ children, className, ...rest }: CardProps) {
  return (
    <div data-component="card" className={clsx(card, className)} {...rest}>
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...rest }: CardProps) {
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

function CardBody({ children, className, ...rest }: CardProps) {
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
 *
 * @example
 * <Card>
 *   <Card.Header><Text variant="headingSm" as="h2">Profile</Text></Card.Header>
 *   <Card.Body>…</Card.Body>
 * </Card>
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
