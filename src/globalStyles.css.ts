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
});
