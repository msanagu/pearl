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
import { Text } from '@components/Text/Text';
import { Icon } from '@components/Icon/Icon';
import type { IconType } from 'react-icons';
import {
  PiCheckCircleFill,
  PiXCircleFill,
  PiWarningCircleFill,
  PiInfoFill,
} from 'react-icons/pi';
import { color } from '@tokens';
import { FitToWidth } from '../../typography/typeSpecimens';
import * as css from './tokens.css';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { tokensDoc } from './Tokens.doc';

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
    <div className={css.scaleRow}>
      <span className={css.scaleLabel}>{label}</span>
      <div className={css.stepList}>
        {ordered.map((stepValue) => {
          // Always defined — `ordered` is derived from `Object.keys(steps)`.
          const hex = steps[stepValue] as string;
          return (
            <div key={stepValue} className={css.step}>
              <div
                className={css.stepSwatch}
                style={{ background: hex, borderColor: contrastBorder(hex) }}
              />
              <span className={css.stepNumber}>{stepValue}</span>
              <span className={css.stepHex}>{hex}</span>
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
              <div
                className={css.alphaSwatchFill}
                style={{ backgroundColor: steps[pct] }}
              />
            </div>
            <span className={css.stepHex}>@ {pct}%</span>
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
    <div className={css.hueGroup}>
      {Object.entries(sentiment).map(([hue, steps]) => (
        <Scale key={hue} label={hue} steps={steps} />
      ))}
    </div>
  );
}

function PearlSection() {
  return (
    <section className={css.themeSection} style={{ borderBottom: 'none' }}>
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={pearlBrandWordmark.text}
          role={pearlBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div className={css.hueGroup}>
        <Scale label="alabaster" steps={alabaster} />
        <Scale label="squidInk" steps={squidInk} />
        <Scale label="urchin" steps={urchin} />
      </div>

      <h3 className={css.groupTitle}>Alpha</h3>
      <div className={css.hueGroup}>
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

      <h3 className={css.groupTitle}>Sentiment</h3>
      <SentimentScales sentiment={pearlSentiment} />
    </section>
  );
}

function TahitianSection() {
  return (
    <section
      className={`${css.themeSection} ${css.squareSwatches}`}
      style={{ borderBottom: 'none' }}
    >
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={tahitianBrandWordmark.text}
          role={tahitianBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div className={css.hueGroup}>
        <Scale label="platinum" steps={tahitianPlatinum} />
        <Scale label="charcoal" steps={tahitianCharcoal} />
      </div>

      <h3 className={css.groupTitle}>Accent</h3>
      <div className={css.hueGroup}>
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
      <FitToWidth maxWidth="28rem">
        <WordMark
          text={freshwaterBrandWordmark.text}
          role={freshwaterBrandWordmark.role}
          scale={1.4}
        />
      </FitToWidth>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div className={css.hueGroup}>
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
      <FitToWidth maxWidth="28rem">
        <WordMark text={southSeaBrandWordmark.text} scale={1.4} />
      </FitToWidth>

      <h3 className={css.groupTitle}>Neutral</h3>
      <div className={css.hueGroup}>
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

function PrimitivesHalf({ theme }: { theme: string }) {
  const Section = sectionByTheme[theme];
  if (!Section) {
    return (
      <Text as="p" typeScale="bodySm" prominence="subtle">
        Unrecognized theme "{theme}" — switch the toolbar's Theme to Pearl,
        Tahitian, Freshwater, or South Sea.
      </Text>
    );
  }
  return <Section />;
}

// --- Semantic ------------------------------------------------------------

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell}>
      <div className={css.swatch} style={{ background: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

function BorderSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell}>
      <div className={css.borderRule} style={{ borderTopColor: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

const sentimentGroups = ['positive', 'negative', 'warn', 'info'] as const;
const sentimentFields = ['surface', 'border', 'text', 'icon', 'fill'] as const;

// Same sentiment→icon pairing documented in Icon.stories.tsx's Tone story.
const sentimentIcon: Record<(typeof sentimentGroups)[number], IconType> = {
  positive: PiCheckCircleFill,
  negative: PiXCircleFill,
  warn: PiWarningCircleFill,
  info: PiInfoFill,
};

function SemanticHalf() {
  // No theme wrapper — the global preview decorator supplies the active
  // theme's CSS vars; every swatch below reacts to the toolbar purely
  // through `color.*` custom properties.
  return (
    <>
      <section className={css.section}>
        <h3 className={css.subsectionTitle}>Surface</h3>
        <div className={css.row}>
          <ColorSwatch name="color.background" cssVar={color.background} />
          <ColorSwatch name="color.surface" cssVar={color.surface} />
          <ColorSwatch name="color.overlay" cssVar={color.overlay} />
        </div>

        <h3 className={css.subsectionTitle}>Text</h3>
        <div className={css.row}>
          <ColorSwatch name="color.text" cssVar={color.text} />
          <ColorSwatch name="color.textSubtle" cssVar={color.textSubtle} />
        </div>

        <h3 className={css.subsectionTitle}>Border</h3>
        <div className={css.row}>
          <BorderSwatch name="color.border" cssVar={color.border} />
          <BorderSwatch name="color.borderStrong" cssVar={color.borderStrong} />
          <BorderSwatch name="color.borderSubtle" cssVar={color.borderSubtle} />
        </div>

        <h3 className={css.subsectionTitle}>Shadow</h3>
        <div className={css.row}>
          <ColorSwatch name="color.shadow" cssVar={color.shadow} />
        </div>

        <h3 className={css.subsectionTitle}>Accent &amp; focus</h3>
        <div className={css.row} style={{ alignItems: 'flex-end' }}>
          <ColorSwatch name="color.accent" cssVar={color.accent} />
          <ColorSwatch name="color.accentHover" cssVar={color.accentHover} />
          <ColorSwatch name="color.accentSubtle" cssVar={color.accentSubtle} />
          <div className={css.cell}>
            <div className={css.accentPill}>
              <span style={{ color: color.onAccent }}>Aa onAccent</span>
            </div>
            <span>color.accent + color.onAccent</span>
          </div>
          <div className={css.cell}>
            <div className={css.focusDemo} />
            <span>color.focusRing</span>
          </div>
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Sentiment</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sentimentGroups.map((group) => {
            const tokens = color[group];
            return (
              <div key={group} className={css.sentimentGroup}>
                <span className={css.sentimentGroupLabel}>color.{group}</span>
                <div className={css.sentimentRow}>
                  {sentimentFields.map((field) => (
                    <div
                      key={field}
                      className={css.cell}
                      style={{ alignItems: 'center' }}
                    >
                      <div
                        className={css.sentimentCard}
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
                          <Icon
                            icon={sentimentIcon[group]}
                            tone={group}
                            size={16}
                            aria-hidden="true"
                          />
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
    <div className={css.page}>
      <h2 className={css.sectionTitle} id="primitives-raw-palette">
        Primitives — raw palette
      </h2>
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="md">
        Theme-internal — not exported from the package. Build against the
        semantic tier (color.*) below, never a raw ramp step.
      </Text>
      <PrimitivesHalf theme={theme} />
      <h2 className={css.sectionTitle} id="semantic-token-roles">
        Semantic — token roles
      </h2>
      <SemanticHalf />
    </div>
  );
}

const DEMO_SECTIONS = [
  // Shares StoryDoc's "Primitives" caption with tokensDoc's own note — both
  // land in one rail group instead of the swatches demo sitting ungrouped.
  {
    title: 'Primitives — raw palette',
    id: 'primitives-raw-palette',
    caption: 'Primitives',
  },
  { title: 'Semantic — token roles', id: 'semantic-token-roles' },
];

const meta: Meta<typeof TokensPreview> = {
  title: 'Foundations/Color/Tokens',
  component: TokensPreview,
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TokensPreview>;

export const Tokens: Story = {
  render: (args) => (
    <StoryDoc doc={tokensDoc} demoSections={DEMO_SECTIONS} entityId="foundation.color">
      <TokensPreview theme={args.theme} />
    </StoryDoc>
  ),
};
