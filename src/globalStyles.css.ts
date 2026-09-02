import { globalStyle } from '@vanilla-extract/css';

/**
 * Explicit root font-size — the base every `text.*.fontSize` rem value is
 * relative to. Matches the browser default, but stated rather than assumed:
 * an accidental `html { font-size: 62.5% }` reset elsewhere would silently
 * break every rem token's math. See docs/foundations/typography.md and WCAG SC 1.4.4
 * (Resize Text) — rem is what lets text scale with the user's browser/OS
 * setting instead of staying fixed.
 *
 * Side-effect only module — import for registration, no exports.
 */
globalStyle('html', {
  fontSize: '16px',
  // `clip`, not `hidden`: a full-bleed element (e.g. `indexPanel`'s
  // `50vw` breakout) can make the page horizontally scrollable under Lenis on
  // mobile (darkroomengineering/lenis#355) — a documented, unresolved upstream
  // gotcha. `overflow: hidden` on html/body is the naive fix, but it opens a
  // new scroll container that silently breaks `position: sticky` everywhere
  // downstream (breaks AutoHideHeader) and, per lenis#419, can break Lenis's
  // own scrolling outright. `clip` suppresses the same overflow without
  // creating that container.
  overflowX: 'clip',
});

globalStyle('body', {
  overflowX: 'clip',
});
