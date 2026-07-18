import { style } from '@vanilla-extract/css';
import { color, fontFamily, fontWeight, radius, space, text } from '../tokens';

export const experience = style({
  minHeight: '100vh',
  margin: '-2rem',
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
});

// Deliberately NOT using the *Inverse tokens here — those are for a
// section-scoped "show the other mode" effect (see theme.css.ts's contract
// comment), which would fight a real, working mode switcher: selecting Light
// should show a light hero, not a hero frozen to look like dark mode. `surface`
// (one step off the page `background`) keeps a mild editorial distinction
// without contradicting the selected mode.
export const hero = style({
  position: 'relative',
  display: 'grid',
  gridTemplateRows: 'auto minmax(560px, 76vh)',
  overflow: 'hidden',
  padding: '28px clamp(24px, 5vw, 88px) 40px',
  background: color.surface,
  color: color.text,
});

export const heroMeta = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: space.lg,
  borderBottom: `1px solid ${color.border}`,
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  fontWeight: fontWeight.medium,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  '@media': {
    'screen and (max-width: 580px)': { alignItems: 'flex-start', gap: space.md, flexDirection: 'column' },
  },
});

export const brandMark = style({
  color: color.text,
  letterSpacing: '0.18em',
});

export const heroIndex = style({ color: color.textSubtle });

// The site's own theme/mode switcher — a real production site can't depend on
// Storybook's toolbar, so this recreates the mechanism natively: local state
// + a small control group, not `.storybook/preview.tsx`'s decorator.
export const switcherGroup = style({
  display: 'flex',
  gap: space.xs,
  fontFamily: fontFamily.body,
  textTransform: 'none',
  letterSpacing: 'normal',
});

export const switcherButton = style({
  padding: `${space.xs} ${space.sm}`,
  border: `1px solid ${color.border}`,
  borderRadius: radius.full,
  background: 'transparent',
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
  fontWeight: fontWeight.medium,
  cursor: 'pointer',
  transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
  selectors: {
    '&[data-active="true"]': {
      background: color.accent,
      borderColor: color.accent,
      color: color.onAccent,
    },
    '&:not([data-active="true"]):hover': {
      borderColor: color.accent,
      color: color.text,
    },
    '&:focus-visible': {
      outline: `2px solid ${color.accent}`,
      outlineOffset: '2px',
    },
  },
});

export const heroContent = style({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.7fr) minmax(220px, 0.55fr)',
  alignItems: 'end',
  gap: 'clamp(32px, 7vw, 120px)',
  paddingTop: 'clamp(84px, 16vh, 220px)',
  '@media': {
    'screen and (max-width: 760px)': {
      gridTemplateColumns: '1fr',
      paddingTop: '96px',
    },
  },
});

export const heroStatement = style({
  maxWidth: '780px',
  margin: 0,
  fontFamily: fontFamily.display,
  fontSize: 'clamp(54px, 8.2vw, 148px)',
  fontWeight: fontWeight.medium,
  letterSpacing: '-0.075em',
  lineHeight: '0.89',
});

export const heroAside = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
  paddingBottom: '8px',
  color: color.textSubtle,
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyLg.lineHeight,
});

export const heroNumber = style({
  color: color.accent,
  fontFamily: fontFamily.display,
  fontSize: 'clamp(52px, 7vw, 112px)',
  fontWeight: fontWeight.regular,
  letterSpacing: '-0.08em',
  lineHeight: '0.8',
});

export const heroWord = style({
  position: 'absolute',
  right: '-0.08em',
  bottom: '-0.19em',
  color: color.background,
  fontFamily: fontFamily.display,
  fontSize: 'clamp(155px, 30vw, 540px)',
  fontWeight: fontWeight.bold,
  letterSpacing: '-0.13em',
  lineHeight: 1,
  pointerEvents: 'none',
  userSelect: 'none',
});

export const docs = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(190px, 0.42fr) minmax(0, 1.58fr)',
  columnGap: 'clamp(32px, 7vw, 128px)',
  padding: 'clamp(48px, 8vw, 128px) clamp(24px, 5vw, 88px)',
  '@media': {
    'screen and (max-width: 880px)': { gridTemplateColumns: '1fr', rowGap: space.xl },
  },
});

export const docsRail = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.md,
  '@media': {
    'screen and (min-width: 881px)': { position: 'sticky', top: '24px', alignSelf: 'start' },
  },
});

export const railLabel = style({
  margin: 0,
  color: color.accent,
  fontSize: text.bodySm.fontSize,
  fontWeight: fontWeight.semibold,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
});

export const railHeading = style({
  margin: 0,
  fontFamily: fontFamily.heading,
  fontSize: text.headingMd.fontSize,
  fontWeight: fontWeight.semibold,
  letterSpacing: '-0.04em',
  lineHeight: text.headingMd.lineHeight,
});

export const railLinks = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: space.lg,
  borderTop: `1px solid ${color.border}`,
});

export const railLink = style({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: `1px solid ${color.borderSubtle}`,
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
  textDecoration: 'none',
  selectors: {
    '&:hover': { color: color.accent },
    '&[data-current="true"]': { color: color.text, fontWeight: fontWeight.semibold },
  },
});

export const docsContent = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(56px, 9vw, 144px)',
});

export const intro = style({ maxWidth: '900px' });

export const docsKicker = style({
  margin: 0,
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

export const docsHeading = style({
  maxWidth: '760px',
  margin: `${space.md} 0 ${space.lg}`,
  fontFamily: fontFamily.display,
  fontSize: 'clamp(44px, 6.2vw, 96px)',
  fontWeight: fontWeight.medium,
  letterSpacing: '-0.07em',
  lineHeight: '0.92',
});

export const docsLead = style({
  maxWidth: '590px',
  margin: 0,
  color: color.textSubtle,
  fontSize: 'clamp(18px, 2vw, 24px)',
  lineHeight: '1.45',
});

export const specimenGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.35fr) minmax(240px, 0.65fr)',
  gap: 'clamp(24px, 4vw, 64px)',
  alignItems: 'start',
  '@media': { 'screen and (max-width: 760px)': { gridTemplateColumns: '1fr' } },
});

export const sectionEyebrow = style({
  margin: `0 0 ${space.sm}`,
  color: color.accent,
  fontSize: text.bodySm.fontSize,
  fontWeight: fontWeight.semibold,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

export const sectionHeading = style({
  margin: 0,
  fontFamily: fontFamily.heading,
  fontSize: text.headingLg.fontSize,
  fontWeight: fontWeight.semibold,
  letterSpacing: '-0.05em',
  lineHeight: text.headingLg.lineHeight,
});

export const sectionCopy = style({
  maxWidth: '600px',
  margin: `${space.md} 0 ${space.xl}`,
  color: color.textSubtle,
  fontSize: text.bodyLg.fontSize,
  lineHeight: text.bodyLg.lineHeight,
});

export const actionRow = style({ display: 'flex', flexWrap: 'wrap', gap: space.sm });

export const releaseModule = style({
  position: 'relative',
  minHeight: '250px',
  overflow: 'hidden',
  padding: space.lg,
  background: color.surface,
  border: `1px solid ${color.borderStrong}`,
  borderRadius: radius.surface,
  boxShadow: `inset 0 1px 0 ${color.surface}, 0 14px 30px -26px ${color.borderStrong}`,
  transition: 'border-color 300ms ease, transform 300ms ease',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '-45%',
      backgroundImage: `radial-gradient(ellipse at center, ${color.accentSubtle}, transparent 62%)`,
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translate3d(-16%, 8%, 0)',
      transition: 'opacity 700ms ease, transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
    },
    '&::before': {
      content: '',
      position: 'absolute',
      zIndex: 1,
      inset: '1px',
      border: `1px solid ${color.surface}`,
      borderRadius: `calc(${radius.surface} - 1px)`,
      opacity: 0.9,
      pointerEvents: 'none',
    },
    '&:hover': {
      borderColor: color.accent,
      transform: 'translateY(-2px)',
    },
    '&:hover::after': { opacity: 0.72, transform: 'translate3d(14%, -8%, 0)' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const releaseContent = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  height: '100%',
  minHeight: '202px',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const releaseNumber = style({
  color: color.accent,
  fontFamily: fontFamily.display,
  fontSize: '72px',
  fontWeight: fontWeight.medium,
  letterSpacing: '-0.09em',
  lineHeight: 0.8,
});

export const releaseTitle = style({
  margin: 0,
  fontFamily: fontFamily.heading,
  fontSize: text.headingSm.fontSize,
  fontWeight: fontWeight.semibold,
});

export const releaseCopy = style({
  maxWidth: '220px',
  margin: `${space.xs} 0 0`,
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodyMd.lineHeight,
});

export const playground = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 0.7fr)',
  gap: 'clamp(24px, 5vw, 80px)',
  paddingTop: 'clamp(48px, 7vw, 104px)',
  borderTop: `1px solid ${color.border}`,
  '@media': { 'screen and (max-width: 760px)': { gridTemplateColumns: '1fr' } },
});

export const playgroundCopy = style({ maxWidth: '560px' });

export const playgroundTitle = style({
  margin: 0,
  fontFamily: fontFamily.heading,
  fontSize: text.headingLg.fontSize,
  fontWeight: fontWeight.semibold,
  letterSpacing: '-0.05em',
});

export const playgroundBody = style({
  margin: `${space.md} 0 0`,
  color: color.textSubtle,
  fontSize: text.bodyLg.fontSize,
  lineHeight: text.bodyLg.lineHeight,
});

export const tokenEditor = style({
  display: 'grid',
  gap: 0,
  borderTop: `1px solid ${color.border}`,
});

export const tokenRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  alignItems: 'center',
  gap: space.sm,
  minHeight: '52px',
  borderBottom: `1px solid ${color.borderSubtle}`,
});

export const tokenName = style({
  fontSize: text.bodySm.fontSize,
  fontWeight: fontWeight.medium,
});

export const colorInput = style({
  width: '28px',
  height: '28px',
  padding: 0,
  overflow: 'hidden',
  border: `1px solid ${color.border}`,
  borderRadius: radius.full,
  background: 'transparent',
  cursor: 'pointer',
});

export const tokenValue = style({
  width: '76px',
  border: 0,
  background: 'transparent',
  color: color.textSubtle,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: '11px',
  textAlign: 'right',
  textTransform: 'uppercase',
  selectors: {
    '&:focus-visible': { outline: `2px solid ${color.focusRing}`, outlineOffset: '2px' },
  },
});
