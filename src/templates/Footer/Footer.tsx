import type { ReactNode } from 'react';
import { Text } from '@components/Text/Text';
import { Link } from '@components/Link/Link';
import { Row } from '@components/Row/Row';
import { WordMark } from '@components/_brand/WordMark/WordMark';
import * as css from './Footer.css';

const REPO = 'https://github.com/msanagu/pearl';

export interface FooterProps {
  /** @default 'https://github.com/msanagu/pearl' */
  githubHref?: string;
  /** @default the GitHub Pages playground URL */
  playgroundHref?: string;
  /** Plate photo — resolved per theme by the caller (`footerPlate.ts`). */
  plateImageSrc?: string;
  plateImageAlt?: string;
  /** Poster wordmark text. @default 'pearl' */
  brandName?: string;
  /** Typography role decorating the wordmark, or `undefined` for plain text. */
  brandRole?: 'inlineEmphasis';
  /** Literal colour for a `_` in `brandName` — see `WordMark.tsx`. */
  brandUnderscoreColor?: string;
  /** @default '© 2026 Mary San Agustin' */
  copyright?: string;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Text as="span" typeScale="bodySm">
        {children}
      </Text>
    </Link>
  );
}

/**
 * The page's closing colophon — the name story, the poster wordmark, the
 * licence. Used as this template's story and as the introduction page's
 * bottom section; loosely after South Sea's atelier footer (13a): a framed
 * plate, the statement beside it, the mark, a meta rail.
 *
 * The "Why Pearl" analogy is baked in — it's the point of the section, not
 * mount-specific. What varies (plate photo, wordmark, link targets) is a prop.
 * The fuller version lives in `docs/theme/why-pearl-name.md`.
 */
export function Footer({
  githubHref = REPO,
  playgroundHref = 'https://msanagu.github.io/pearl-playground/',
  plateImageSrc = '/images/silver-reflection.jpg',
  plateImageAlt = 'Silver-toned reflected light',
  brandName = 'pearl',
  brandRole,
  brandUnderscoreColor,
  copyright = '© 2026 Mary San Agustin',
}: FooterProps) {
  return (
    <footer className={css.band}>
      <div className={css.inner}>
        <div className={css.leftCol}>
          <div className={css.top}>
            <Text as="h2" typeScale="headingSm" style={{ margin: 0 }}>
              Why “Pearl”?
            </Text>
            <Text as="p" typeScale="bodyLg" measure="lg" style={{ margin: 0 }}>
              A cultured pearl grows under conditions particular to one place —
              one organism, one stretch of water, its own culture. A pearl forms
              as a response to friction: an irritant the organism adapts around,
              one layer at a time. A design system grows in much the same way,
              around the problems an organization keeps running into, shaped by
              its culture. Just as no two organisms are alike, neither are any
              two pearls.
            </Text>
            <div className={css.coda}>
              <Text
                as="p"
                typeScale="bodySm"
                prominence="subtle"
                measure="md"
                style={{ margin: 0 }}
              >
                This one’s a starting point — reskin it, tune the visual
                treatments, shape it to your own needs.
              </Text>
              <Text
                as="p"
                typeScale="bodyMd"
                measure="md"
                style={{ margin: 0 }}
              >
                The oyster’s <Text role="inlineEmphasis">yours</Text>.
              </Text>
            </div>
          </div>

          {/* Signature: poster wordmark, then copyright + links directly under
              its left edge as one unit. */}
          <div className={css.sign}>
            <WordMark
              text={brandName}
              role={brandRole}
              underscoreColor={brandUnderscoreColor}
              scale={2.8}
            />
            <div className={css.meta}>
              <Text
                as="p"
                typeScale="caption"
                prominence="subtle"
                style={{ margin: 0 }}
              >
                {copyright}
              </Text>
              <Row gap="lg" align="center" className={css.metaLinks}>
                <ExternalLink href={githubHref}>GitHub ↗</ExternalLink>
                <ExternalLink href={playgroundHref}>Playground ↗</ExternalLink>
              </Row>
            </div>
          </div>
        </div>

        <figure className={css.plate}>
          <img
            src={plateImageSrc}
            alt={plateImageAlt}
            className={css.plateImage}
          />
        </figure>
      </div>
    </footer>
  );
}
