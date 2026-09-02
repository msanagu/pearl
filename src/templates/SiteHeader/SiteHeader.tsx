import type { ReactNode } from 'react';
import { Text } from '@components/Text/Text';
import { Link } from '@components/Link/Link';
import { Row } from '@components/Row/Row';
import { WordMark } from '@components/_brand/WordMark/WordMark';
import { PearlSphere } from '@components/_brand/PearlSphere/PearlSphere';
import * as css from './SiteHeader.css';

const REPO = 'https://github.com/msanagu/pearl';
const PLAYGROUND = 'https://msanagu.github.io/pearl-playground/';

/** A utility link that leaves the site — bare underlined text, quieted so it
 * sits under the wordmark rather than beside it. No `↗`: the header is tight
 * and the footer rail already carries the formal external mark. */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Text as="span" typeScale="bodySm" prominence="subtle">
        {children}
      </Text>
    </Link>
  );
}

export interface SiteHeaderProps {
  /** @default 'https://github.com/msanagu/pearl' */
  githubHref?: string;
  /** Where the Playground link points. @default the GitHub Pages URL */
  playgroundHref?: string;
  /** Wordmark text. @default 'pearl' */
  brandName?: string;
  /** Typography role decorating the wordmark, or `undefined` for plain text. */
  brandRole?: 'inlineEmphasis';
  /** Literal colour for a `_` in `brandName` — see `WordMark.tsx`. */
  brandUnderscoreColor?: string;
  /** Optional controls rendered in the brand row, right-aligned opposite the
   * wordmark — e.g. the introduction page's theme switcher. */
  actions?: ReactNode;
}

/**
 * The persistent site masthead: wordmark, an optional controls slot, and the
 * two external links the footer rail also carries. Utility chrome, deliberately
 * not the docs sidebar.
 *
 * Used as this template's story and as the introduction page's header — where
 * it is wrapped in that page's `AutoHideHeader` for sticky, summon-on-scroll
 * behavior. That motion layer is landing-page-only and lives in
 * `src/introduction/`, not here.
 *
 * Full-bleed: the caller places it edge to edge; `inner` re-applies the shared
 * content column so it lines up with the hero band and the page body.
 */
export function SiteHeader({
  githubHref = REPO,
  playgroundHref = PLAYGROUND,
  brandName = 'pearl',
  brandRole,
  brandUnderscoreColor,
  actions,
}: SiteHeaderProps) {
  return (
    <header className={css.bar}>
      <div className={css.inner}>
        {/* Brand + controls share one row that never wraps internally — the
            theme switcher belongs next to the mark that names what it's
            switching, not demoted to the links' row below. Only the two
            external links (grouped so `wrap` treats them as one flex item —
            split apart, GitHub could land on the controls' line while
            Playground fell to a line of its own) drop to a second line, via
            `inner`'s phone-width `flexWrap`, once the bar can't fit both
            groups on one line. */}
        <Row gap="lg" align="center" justify="between" className={css.brandRow}>
          <Row gap="sm" align="center" className={css.brand}>
            {/* Stand-in for the hero's body sphere once that drops out (mobile). */}
            <div className={css.navSphere}>
              <PearlSphere />
            </div>
            <WordMark
              text={brandName}
              role={brandRole}
              underscoreColor={brandUnderscoreColor}
            />
          </Row>
          {actions}
        </Row>
        <Row gap="lg" align="center" className={css.links}>
          <NavLink href={githubHref}>GitHub</NavLink>
          <NavLink href={playgroundHref}>Playground</NavLink>
        </Row>
      </div>
    </header>
  );
}
