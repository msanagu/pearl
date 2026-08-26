import type { Meta, StoryObj } from '@storybook/react-vite';
import { alabaster, squidInk, marineLayer, squidInkAlpha, alabasterAlpha, pearlSentiment } from '../themes/pearl.css';
import * as css from './primitives.css';

/**
 * Foundations → Tokens/Primitives: the raw hex palette (ADR-0005's primitive
 * tier) for the active theme, laid out like Tailwind's color docs — one row
 * per hue, one swatch per step the hue actually defines. Pearl only for now;
 * the other three themes will be modeled on Pearl's primitive structure once
 * it's settled, then added here.
 *
 * Purpose: a reference for building a step-pairing ruleset — e.g. "surface at
 * 100, text at 700 is always ≥4.5:1" — checked against real values here rather
 * than assumed from the numbers. Values print as their literal hex source, no
 * DOM-computed rgba. Alpha steps are the exception — instead of the rgba
 * string, they print as their derivation (`hue[step] @ N%`), since the
 * opacity is the meaningful fact, not the composited channel math.
 */

function Scale({ label, steps }: { label: string; steps: Record<number, string> }) {
  const ordered = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <div className={css.scaleRow}>
      <span className={css.scaleLabel}>{label}</span>
      <div className={css.stepList}>
        {ordered.map((stepValue) => (
          <div key={stepValue} className={css.step}>
            <div className={css.stepSwatch} style={{ background: steps[stepValue] }} />
            <span className={css.stepNumber}>{stepValue}</span>
            <span className={css.stepHex}>{steps[stepValue]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlphaScale({
  label,
  anchorLabel,
  steps,
}: {
  label: string;
  anchorLabel: string;
  steps: Record<number, string>;
}) {
  const ordered = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <div className={css.scaleRow}>
      <span className={css.scaleLabel}>{label}</span>
      <div className={css.stepList}>
        {ordered.map((pct) => (
          <div key={pct} className={css.step}>
            <div className={css.stepSwatch} style={{ background: steps[pct] }} />
            <span className={css.stepHex}>
              {anchorLabel} @ {pct}%
            </span>
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

function PrimitivesPreview() {
  return (
    <div className={css.page}>
      <section className={css.themeSection} style={{ borderBottom: 'none' }}>
        <h2 className={css.themeTitle}>Pearl</h2>

        <h3 className={css.groupTitle}>Neutral</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Scale label="alabaster" steps={alabaster} />
          <Scale label="squidInk" steps={squidInk} />
          <Scale label="marineLayer" steps={marineLayer} />
        </div>

        <h3 className={css.groupTitle}>Alpha</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AlphaScale label="squidInkAlpha" anchorLabel="squidInk[900]" steps={squidInkAlpha} />
          <AlphaScale label="alabasterAlpha" anchorLabel="alabaster[300]" steps={alabasterAlpha} />
        </div>

        <h3 className={css.groupTitle}>Sentiment</h3>
        <SentimentScales sentiment={pearlSentiment} />
      </section>
    </div>
  );
}

const meta: Meta<typeof PrimitivesPreview> = {
  title: 'Foundations/Tokens/Primitives',
  component: PrimitivesPreview,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PrimitivesPreview>;

export const Overview: Story = {};
