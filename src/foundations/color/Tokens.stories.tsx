import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import {
  alabaster,
  squidInk,
  urchin,
  squidInkAlpha,
  alabasterAlpha,
  pearlSentiment,
} from '@themes/pearl/pearl.css';
import {
  tahitianPlatinum,
  tahitianCharcoal,
  tahitianPeacock,
  tahitianSeaglass,
  tahitianSentiment,
} from '@themes/tahitian/tahitian.css';
import {
  freshwaterIce,
  freshwaterGraphite,
  freshwaterGlacier,
  freshwaterSentiment,
} from '@themes/freshwater/freshwater.css';
import {
  southSeaSand,
  southSeaDriftwood,
  southSeaConch,
  southSeaSentiment,
} from '@themes/south-sea/south-sea.css';
import { pearlBrandWordmark } from '@themes/pearl/pearl.roles';
import { tahitianBrandWordmark } from '@themes/tahitian/tahitian.roles';
import { freshwaterBrandWordmark } from '@themes/freshwater/freshwater.roles';
import { southSeaBrandWordmark } from '@themes/south-sea/south-sea.roles';
import { WordMark } from '@components/_brand/WordMark/WordMark';
import { color } from '@tokens';
import { FitToWidth } from '../typography/typeSpecimens';
import * as primCss from './primitives.css';
import * as semCss from './tokens.css';

/**
 * Foundations → Color/Tokens: the whole color contract on one page. Primitives
 * (raw theme-scoped hex, per the toolbar theme) on top; Semantic (the role
 * each color token plays, reacting live to the toolbar) below. Only color —
 * space/radius/control-height specimens live on their own foundation pages.
 *
 * Primitives values print as literal hex, no DOM-computed rgba; alpha steps
 * print their derivation (hue[step] @ N%) since opacity is the meaningful fact.
 *
 * Primitives are theme-internal — not re-exported from the package. Consumers
 * only ever touch the semantic tier (color.*).
 */

// --- Primitives ------------------------------------------------------------

// Palest steps sit near the page background's lightness, so a fixed border
// token is nearly invisible — derive the ring from each swatch's own lightness.
function contrastBorder(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.35)';
}

function Scale({
  label,
  steps,
}: {
  label: string;
  steps: Record<number, string>;
}) {
  const ordered = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <div className={primCss.scaleRow}>
      <span className={primCss.scaleLabel}>{label}</span>
      <div className={primCss.stepList}>
        {ordered.map((stepValue) => {
          // Always defined — `ordered` is derived from `Object.keys(steps)`.
          const hex = steps[stepValue] as string;
          return (
            <div key={stepValue} className={primCss.step}>
              <div
                className={primCss.stepSwatch}
                style={{ background: hex, borderColor: contrastBorder(hex) }}
              />
              <span className={primCss.stepNumber}>{stepValue}</span>
              <span className={primCss.stepHex}>{hex}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// `{anchorLabel} @ {pct}%` repeated per swatch overflowed the 64px column at
// 10px monospace — anchor now prints once in the row label, each swatch
// carries just its percent. anchorHex also gives contrastBorder something to
// key off, since the swatch's own fill is a partial-opacity composite.
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
    <div className={primCss.scaleRow}>
      <span className={primCss.scaleLabel}>
        {label}
        <br />
        <span style={{ fontWeight: 400, opacity: 0.7 }}>({anchorLabel})</span>
      </span>
      <div className={primCss.stepList}>
        {ordered.map((pct) => (
          <div key={pct} className={primCss.step}>
            <div
              className={primCss.alphaSwatch}
              style={{ borderColor: border }}
            >
              <div
                className={primCss.alphaSwatchFill}
                style={{ backgroundColor: steps[pct] }}
              />
            </div>
            <span className={primCss.stepHex}>@ {pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentScales({
  sentiment,
}: {
  sentiment: Record<string, Record<number, string>>;
}) {
  return (
    <div className={primCss.hueGroup}>
      {Object.entries(sentiment).map(([hue, steps]) => (
        <Scale key={hue} label={hue} steps={steps} />
      ))}
    </div>
  );
}

function PearlSection() {
  return (
    <section className={primCss.themeSection} style={{ borderBottom: 'none' }}>
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={pearlBrandWordmark.text}
          role={pearlBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={primCss.groupTitle}>Neutral</h3>
      <div className={primCss.hueGroup}>
        <Scale label="alabaster" steps={alabaster} />
        <Scale label="squidInk" steps={squidInk} />
        <Scale label="urchin" steps={urchin} />
      </div>

      <h3 className={primCss.groupTitle}>Alpha</h3>
      <div className={primCss.hueGroup}>
        <AlphaScale
          label="squidInkAlpha"
          anchorLabel="squidInk[900]"
          anchorHex={squidInk[900]}
          steps={squidInkAlpha}
        />
        <AlphaScale
          label="alabasterAlpha"
          anchorLabel="alabaster[300]"
          anchorHex={alabaster[300]}
          steps={alabasterAlpha}
        />
      </div>

      <h3 className={primCss.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={pearlSentiment} />
    </section>
  );
}

function TahitianSection() {
  return (
    <section
      className={`${primCss.themeSection} ${primCss.squareSwatches}`}
      style={{ borderBottom: 'none' }}
    >
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={tahitianBrandWordmark.text}
          role={tahitianBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={primCss.groupTitle}>Neutral</h3>
      <div className={primCss.hueGroup}>
        <Scale label="platinum" steps={tahitianPlatinum} />
        <Scale label="charcoal" steps={tahitianCharcoal} />
      </div>

      <h3 className={primCss.groupTitle}>Accent</h3>
      <div className={primCss.hueGroup}>
        <Scale label="peacock" steps={tahitianPeacock} />
        <Scale label="seaglass" steps={tahitianSeaglass} />
      </div>

      <h3 className={primCss.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={tahitianSentiment} />
    </section>
  );
}

function FreshwaterSection() {
  return (
    <section className={primCss.themeSection} style={{ borderBottom: 'none' }}>
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={freshwaterBrandWordmark.text}
          role={freshwaterBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={primCss.groupTitle}>Neutral</h3>
      <div className={primCss.hueGroup}>
        <Scale label="ice" steps={freshwaterIce} />
        <Scale label="graphite" steps={freshwaterGraphite} />
      </div>

      <h3 className={primCss.groupTitle}>Accent</h3>
      <Scale label="glacier" steps={freshwaterGlacier} />

      <h3 className={primCss.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={freshwaterSentiment} />
    </section>
  );
}

function SouthSeaSection() {
  return (
    <section className={primCss.themeSection} style={{ borderBottom: 'none' }}>
      <FitToWidth maxWidth="28rem">
        <WordMark text={southSeaBrandWordmark.text} scale={1.4} />
      </FitToWidth>

      <h3 className={primCss.groupTitle}>Neutral</h3>
      <div className={primCss.hueGroup}>
        <Scale label="sand" steps={southSeaSand} />
        <Scale label="driftwood" steps={southSeaDriftwood} />
      </div>

      <h3 className={primCss.groupTitle}>Accent</h3>
      <Scale label="conch" steps={southSeaConch} />

      <h3 className={primCss.groupTitle}>Sentiment</h3>
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

function PrimitivesHalf({ theme }: { theme: string }) {
  const Section = sectionByTheme[theme];
  if (!Section) {
    return (
      <p style={{ fontSize: 13, color: 'inherit', opacity: 0.7 }}>
        Unrecognized theme "{theme}" — switch the toolbar's Theme to Pearl,
        Tahitian, Freshwater, or South Sea.
      </p>
    );
  }
  return <Section />;
}

// --- Semantic ------------------------------------------------------------

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={semCss.cell}>
      <div className={semCss.swatch} style={{ background: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

function BorderSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={semCss.cell}>
      <div className={semCss.borderRule} style={{ borderTopColor: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

const sentimentGroups = ['positive', 'negative', 'warn', 'info'] as const;
const sentimentFields = ['surface', 'border', 'text', 'icon', 'fill'] as const;

function SemanticHalf() {
  // No theme wrapper — the global preview decorator supplies the active
  // theme's CSS vars; every swatch below reacts to the toolbar purely
  // through `color.*` custom properties.
  return (
    <>
      <section className={semCss.section}>
        <h3 className={semCss.subsectionTitle}>Surface</h3>
        <div className={semCss.row}>
          <ColorSwatch name="color.background" cssVar={color.background} />
          <ColorSwatch name="color.surface" cssVar={color.surface} />
          <ColorSwatch name="color.overlay" cssVar={color.overlay} />
        </div>

        <h3 className={semCss.subsectionTitle}>Text</h3>
        <div className={semCss.row}>
          <ColorSwatch name="color.text" cssVar={color.text} />
          <ColorSwatch name="color.textSubtle" cssVar={color.textSubtle} />
        </div>

        <h3 className={semCss.subsectionTitle}>Border</h3>
        <div className={semCss.row}>
          <BorderSwatch name="color.border" cssVar={color.border} />
          <BorderSwatch name="color.borderStrong" cssVar={color.borderStrong} />
          <BorderSwatch name="color.borderSubtle" cssVar={color.borderSubtle} />
        </div>

        <h3 className={semCss.subsectionTitle}>Shadow</h3>
        <div className={semCss.row}>
          <ColorSwatch name="color.shadow" cssVar={color.shadow} />
        </div>

        <h3 className={semCss.subsectionTitle}>Accent &amp; focus</h3>
        <div className={semCss.row} style={{ alignItems: 'flex-end' }}>
          <ColorSwatch name="color.accent" cssVar={color.accent} />
          <ColorSwatch name="color.accentHover" cssVar={color.accentHover} />
          <ColorSwatch name="color.accentSubtle" cssVar={color.accentSubtle} />
          <div className={semCss.cell}>
            <div className={semCss.accentPill}>
              <span style={{ color: color.onAccent }}>Aa onAccent</span>
            </div>
            <span>color.accent + color.onAccent</span>
          </div>
          <div className={semCss.cell}>
            <div className={semCss.focusDemo} />
            <span>color.focusRing</span>
          </div>
        </div>
      </section>

      <section className={semCss.section}>
        <h2 className={semCss.sectionTitle}>Sentiment</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sentimentGroups.map((group) => {
            const tokens = color[group];
            return (
              <div key={group} className={semCss.sentimentGroup}>
                <span className={semCss.sentimentGroupLabel}>
                  color.{group}
                </span>
                <div className={semCss.sentimentRow}>
                  {sentimentFields.map((field) => (
                    <div
                      key={field}
                      className={semCss.cell}
                      style={{ alignItems: 'center' }}
                    >
                      <div
                        className={semCss.sentimentCard}
                        style={{
                          background:
                            field === 'surface'
                              ? tokens.surface
                              : field === 'fill'
                                ? tokens.fill
                                : color.surface,
                          border: `1px solid ${field === 'border' ? tokens.border : color.border}`,
                        }}
                      >
                        {field === 'fill' && (
                          // The solid pair: onFill on fill. Light mode 400/800
                          // (dark ink on vivid), dark mode 600/100 (light on
                          // deep); AA in both — see sentimentFillContrast.test.ts.
                          <span
                            style={{
                              color: tokens.onFill,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            Aa ●
                          </span>
                        )}
                        {field === 'text' && (
                          // The intended pairing: sentiment.text
                          // (700) is authored to sit ON sentiment.surface (100), not on the
                          // neutral page surface — showing it there is both the honest specimen
                          // AND what passes AA (~7-8.5:1 across all four families).
                          <span
                            style={{
                              color: tokens.text,
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Aa
                          </span>
                        )}
                        {field === 'icon' && (
                          <span
                            aria-hidden="true"
                            style={{ color: tokens.icon, fontSize: 16 }}
                          >
                            ●
                          </span>
                        )}
                        {/* surface/border demonstrate themselves via the card's own fill/ring —
                            no inner mark needed, and one would misleadingly imply icon color. */}
                      </div>
                      <span>{field === 'fill' ? 'fill / onFill' : field}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// --- Story ------------------------------------------------------------

function TokensPreview({ theme = 'pearl' }: { theme?: string }) {
  return (
    <div className={primCss.page}>
      <h2 className={semCss.sectionTitle}>Primitives — raw palette</h2>
      <p style={{ margin: 0, maxWidth: '42rem', fontSize: 13, opacity: 0.7 }}>
        Theme-internal — not exported from the package. Build against the
        semantic tier (color.*) below, never a raw ramp step.
      </p>
      <PrimitivesHalf theme={theme} />
      <h2 className={semCss.sectionTitle}>Semantic — token roles</h2>
      <SemanticHalf />
    </div>
  );
}

const meta: Meta<typeof TokensPreview> = {
  title: 'Foundations/Color/Tokens',
  component: TokensPreview,
  parameters: {
    layout: 'fullscreen',
    manifest: {
      name: 'tokenSemantics',
      description:
        'What each sentiment-color sub-field (surface/border/text/icon/fill/onFill) is actually for — pick by where it applies, not how bold it looks.',
      sections: [
        {
          kind: 'guidelines',
          title: 'Token semantics',
          for: 'agent',
          items: [
            {
              level: 'must',
              statement:
                'Pick a sentiment sub-field (color.positive/negative/warn/info) by where it applies, not how strong/bold it looks. Tinted treatment: surface (tinted background fill), border (tinted border), text (accessible content on surface), icon (saturated mark on surface). Solid treatment: fill (one saturated background — a filled status badge, a destructive primary button) paired with onFill (accessible content on fill).',
            },
            {
              level: 'must-not',
              statement:
                'Never reach for icon as a general "strong version of this sentiment" — e.g. color.negative.icon as a button background is a category error. For a solid sentiment surface use color.negative.fill + color.negative.onFill, which are contrast-checked as a pair; icon is only ever a mark on surface.',
            },
          ],
        },
        {
          kind: 'steps',
          title: 'Token semantics verification',
          for: 'agent',
          ordered: false,
          items: [
            {
              title:
                'For a solid, high-emphasis sentiment element (filled badge, destructive CTA) use color.<sentiment>.fill for the background and color.<sentiment>.onFill for text and icons on it — never surface (too tinted), text, or icon. There is exactly one solid intensity; if a design needs two solid weights, flag the gap rather than inventing a second fill.',
            },
          ],
        },
      ],
    },
  },
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TokensPreview>;

export const Tokens: Story = {};
