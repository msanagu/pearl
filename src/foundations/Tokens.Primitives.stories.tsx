import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { alabaster, squidInk, marineLayer, squidInkAlpha, alabasterAlpha, pearlSentiment } from '@themes/pearl/pearl.css';
import { tahitianPlatinum, tahitianCharcoal, tahitianPeacock, tahitianSeaglass, tahitianSentiment } from '@themes/tahitian/tahitian.css';
import {
  freshwaterIce,
  freshwaterGraphite,
  freshwaterGlacier,
  freshwaterSentiment,
} from '@themes/freshwater/freshwater.css';
import { southSeaSand, southSeaDriftwood, southSeaConch, southSeaSentiment } from '@themes/south-sea/south-sea.css';
import { pearlBrandWordmark } from '@themes/pearl/pearl.roles';
import { tahitianBrandWordmark } from '@themes/tahitian/tahitian.roles';
import { freshwaterBrandWordmark } from '@themes/freshwater/freshwater.roles';
import { southSeaBrandWordmark } from '@themes/south-sea/south-sea.roles';
import { WordMark } from '@components/_brand/WordMark';
import * as css from './primitives.css';

/**
 * Foundations → Tokens/Primitives: the raw hex palette (ADR-0005's primitive
 * tier) for the ACTIVE theme, laid out like Tailwind's color docs — one row
 * per hue, one swatch per step the hue actually defines. Reads the
 * Storybook toolbar's theme global and shows only that theme's section, the
 * same pattern Typography.stories.tsx uses for role treatments — not every
 * theme side by side, since only one is ever the thing being inspected at a
 * time.
 *
 * Purpose: a reference for building a step-pairing ruleset — e.g. "surface at
 * 100, text at 700 is always ≥4.5:1" — checked against real values here rather
 * than assumed from the numbers. Values print as their literal hex source, no
 * DOM-computed rgba. Alpha steps are the exception — instead of the rgba
 * string, they print as their derivation (`hue[step] @ N%`), since the
 * opacity is the meaningful fact, not the composited channel math.
 *
 * All four themes' neutrals are now numeric ramps (`Scale`) — Freshwater and
 * South Sea's used to be named hexes with no shared step number between
 * light and dark, but both were consolidated onto the same one-hue-per-
 * register pattern Pearl's `alabaster`/`squidInk` already used (2026-08-29).
 */

// Pearl's palest steps (e.g. alabaster[100], `#FDFCFA`) sit within a few
// lightness points of both the page background and the fixed theme border
// token — nearly invisible. A border picked from the swatch's OWN lightness
// (dark ring on light fills, light ring on dark fills) stays legible
// regardless of how close the fill sits to the surrounding page, instead of
// relying on one border color to work against every fill in the palette.
function contrastBorder(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.35)';
}

function Scale({ label, steps }: { label: string; steps: Record<number, string> }) {
  const ordered = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <div className={css.scaleRow}>
      <span className={css.scaleLabel}>{label}</span>
      <div className={css.stepList}>
        {ordered.map((stepValue) => {
          // Always defined — `ordered` is derived from `Object.keys(steps)`.
          const hex = steps[stepValue] as string;
          return (
            <div key={stepValue} className={css.step}>
              <div className={css.stepSwatch} style={{ background: hex, borderColor: contrastBorder(hex) }} />
              <span className={css.stepNumber}>{stepValue}</span>
              <span className={css.stepHex}>{hex}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// `{anchorLabel} @ {pct}%` (e.g. "squidInk[900] @ 10%") repeated per swatch
// ran wider than the 64px swatch column at 10px monospace and wrapped onto
// multiple lines, crowding into the row above/below — the anchor now prints
// once, in the row label, and each swatch just carries its own percent.
// `anchorHex` also gives `contrastBorder` something to key off, since the
// swatch's own fill is a partial-opacity composite, not a flat color.
function AlphaScale({
  label,
  anchorLabel,
  anchorHex,
  steps,
}: {
  label: string;
  anchorLabel: string;
  anchorHex: string;
  steps: Record<number, string>;
}) {
  const ordered = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);
  const border = contrastBorder(anchorHex);
  return (
    <div className={css.scaleRow}>
      <span className={css.scaleLabel}>
        {label}
        <br />
        <span style={{ fontWeight: 400, opacity: 0.7 }}>({anchorLabel})</span>
      </span>
      <div className={css.stepList}>
        {ordered.map((pct) => (
          <div key={pct} className={css.step}>
            <div className={css.alphaSwatch} style={{ borderColor: border }}>
              <div className={css.alphaSwatchFill} style={{ backgroundColor: steps[pct] }} />
            </div>
            <span className={css.stepHex}>@ {pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentScales({ sentiment }: { sentiment: Record<string, Record<number, string>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Object.entries(sentiment).map(([hue, steps]) => (
        <Scale key={hue} label={hue} steps={steps} />
      ))}
    </div>
  );
}

function PearlSection() {
  return (
    <section className={css.themeSection} style={{ borderBottom: 'none' }}>
      <div className={css.themeTitle}>
        <WordMark text={pearlBrandWordmark.text} role={pearlBrandWordmark.role} scale={1.4} />
      </div>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Scale label="alabaster" steps={alabaster} />
        <Scale label="squidInk" steps={squidInk} />
        <Scale label="marineLayer" steps={marineLayer} />
      </div>

      <h3 className={css.groupTitle}>Alpha</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AlphaScale label="squidInkAlpha" anchorLabel="squidInk[900]" anchorHex={squidInk[900]} steps={squidInkAlpha} />
        <AlphaScale label="alabasterAlpha" anchorLabel="alabaster[300]" anchorHex={alabaster[300]} steps={alabasterAlpha} />
      </div>

      <h3 className={css.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={pearlSentiment} />
    </section>
  );
}

function TahitianSection() {
  return (
    <section className={`${css.themeSection} ${css.squareSwatches}`} style={{ borderBottom: 'none' }}>
      <div className={css.themeTitle}>
        <WordMark text={tahitianBrandWordmark.text} role={tahitianBrandWordmark.role} scale={1.4} />
      </div>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Scale label="platinum" steps={tahitianPlatinum} />
        <Scale label="charcoal" steps={tahitianCharcoal} />
      </div>

      <h3 className={css.groupTitle}>Accent</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Scale label="peacock" steps={tahitianPeacock} />
        <Scale label="seaglass" steps={tahitianSeaglass} />
      </div>

      <h3 className={css.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={tahitianSentiment} />
    </section>
  );
}

function FreshwaterSection() {
  return (
    <section className={css.themeSection} style={{ borderBottom: 'none' }}>
      <div className={css.themeTitle}>
        <WordMark text={freshwaterBrandWordmark.text} role={freshwaterBrandWordmark.role} scale={1.4} />
      </div>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Scale label="ice" steps={freshwaterIce} />
        <Scale label="graphite" steps={freshwaterGraphite} />
      </div>

      <h3 className={css.groupTitle}>Accent</h3>
      <Scale label="glacier" steps={freshwaterGlacier} />

      <h3 className={css.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={freshwaterSentiment} />
    </section>
  );
}

function SouthSeaSection() {
  return (
    <section className={css.themeSection} style={{ borderBottom: 'none' }}>
      <div className={css.themeTitle}>
        <WordMark text={southSeaBrandWordmark.text} role={southSeaBrandWordmark.role} scale={1.4} />
      </div>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Scale label="sand" steps={southSeaSand} />
        <Scale label="driftwood" steps={southSeaDriftwood} />
      </div>

      <h3 className={css.groupTitle}>Accent</h3>
      <Scale label="conch" steps={southSeaConch} />

      <h3 className={css.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={southSeaSentiment} />
    </section>
  );
}

const sectionByTheme: Record<string, (() => ReactNode) | undefined> = {
  pearl: PearlSection,
  tahitian: TahitianSection,
  freshwater: FreshwaterSection,
  southSea: SouthSeaSection,
};

function PrimitivesPreview({ theme = 'pearl' }: { theme?: string }) {
  const Section = sectionByTheme[theme];
  return (
    <div className={css.page}>
      {Section ? (
        <Section />
      ) : (
        <p style={{ fontSize: 13, color: 'inherit', opacity: 0.7 }}>
          Unrecognized theme "{theme}" — switch the toolbar's Theme to Pearl,
          Tahitian, Freshwater, or South Sea.
        </p>
      )}
    </div>
  );
}

const meta: Meta<typeof PrimitivesPreview> = {
  title: 'Foundations/Tokens/Primitives',
  component: PrimitivesPreview,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />,
  ],
};
export default meta;

type Story = StoryObj<typeof PrimitivesPreview>;

export const Overview: Story = {};

