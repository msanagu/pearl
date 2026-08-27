import type { Meta, StoryObj } from '@storybook/react-vite';
import { color, controlHeight, radius, space } from '../tokens';
import * as css from './tokens.css';

/**
 * Foundations → Tokens/Semantic: a live specimen of the whole token contract,
 * rendered under whichever theme is active in the Storybook toolbar. This is
 * not a component — it's a validation surface for the semantic tier (ADR-0005
 * tiers, ADR-0006 naming). Raw values live on Tokens/Primitives instead; this
 * page is about the role each token plays, not its resolved hex.
 */

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell}>
      <div className={css.swatch} style={{ background: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

function BorderSwatch({
  name,
  cssVar,
  captionColor,
}: {
  name: string;
  cssVar: string;
  /**
   * `css.cell` defaults to `color.textSubtle`, which is only legible on a
   * light-register background. Pass the inverse token when this swatch sits
   * inside an inverse panel — see the a11y finding this fixes: reusing the
   * light-mode default here was a real WCAG AA failure (3.18:1), not a token
   * defect.
   */
  captionColor?: string;
}) {
  return (
    <div className={css.cell}>
      <div className={css.borderRule} style={{ borderTopColor: cssVar }} />
      <span style={captionColor ? { color: captionColor } : undefined}>{name}</span>
    </div>
  );
}

function SpaceBar({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 40 }}>{name}</span>
      <div className={css.spaceBar} style={{ width: cssVar }} />
    </div>
  );
}

function ControlHeightSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell} style={{ alignItems: 'center' }}>
      <div className={css.controlHeightBar} style={{ width: 64, height: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

function RadiusSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className={css.cell}>
      <div className={css.radiusBox} style={{ borderRadius: cssVar }} />
      <span>{name}</span>
    </div>
  );
}

const sentimentGroups = ['positive', 'negative', 'warn', 'info'] as const;
const sentimentFields = ['surface', 'border', 'text', 'icon'] as const;

function TokensPreview() {
  // No theme wrapper here — the global preview decorator supplies the active
  // theme (Pearl by default). Alternate values are demonstrated by switching
  // the Storybook toolbar, not by re-wrapping here.
  return (
    <div className={css.page}>
      <section className={css.section}>
        <h2 className={css.sectionTitle}>Color</h2>

        <h3 className={css.subsectionTitle}>Surface</h3>
        <div className={css.row}>
          <ColorSwatch name="background" cssVar={color.background} />
          <ColorSwatch name="surface" cssVar={color.surface} />
          <ColorSwatch name="overlay" cssVar={color.overlay} />
        </div>

        <h3 className={css.subsectionTitle}>Text</h3>
        <div className={css.row}>
          <ColorSwatch name="text" cssVar={color.text} />
          <ColorSwatch name="textSubtle" cssVar={color.textSubtle} />
        </div>

        <h3 className={css.subsectionTitle}>Border</h3>
        <div className={css.row}>
          <BorderSwatch name="border" cssVar={color.border} />
          <BorderSwatch name="borderStrong" cssVar={color.borderStrong} />
          <BorderSwatch name="borderSubtle" cssVar={color.borderSubtle} />
        </div>

        <h3 className={css.subsectionTitle}>Shadow</h3>
        <div className={css.row}>
          <ColorSwatch name="shadow" cssVar={color.shadow} />
        </div>

        <h3 className={css.subsectionTitle}>Accent &amp; focus</h3>
        <div className={css.row} style={{ alignItems: 'center' }}>
          <ColorSwatch name="accent" cssVar={color.accent} />
          <ColorSwatch name="accentHover" cssVar={color.accentHover} />
          <ColorSwatch name="accentSubtle" cssVar={color.accentSubtle} />
          <div className={css.cell}>
            <div className={css.accentPill}>
              <span style={{ color: color.onAccent }}>Aa onAccent</span>
            </div>
            <span>accent + onAccent, in use</span>
          </div>
          <div className={css.cell}>
            <div className={css.focusDemo} />
            <span>focusRing, in use</span>
          </div>
        </div>

        <h3 className={css.subsectionTitle}>
          Inverse — rendered in context, not as isolated swatches
        </h3>
        <div className={css.inversePanel}>
          <div className={css.inverseCard}>
            <span style={{ color: color.textInverse, fontWeight: 600 }}>textInverse</span>
            <span style={{ color: color.textInverseSubtle, fontSize: '13px' }}>
              textInverseSubtle — a section that renders as if the other mode were active,
              without flipping the global mode.
            </span>
            <BorderSwatch
              name="borderInverse"
              cssVar={color.borderInverse}
              captionColor={color.textInverseSubtle}
            />
          </div>
          <span className={css.subsectionTitle} style={{ color: color.textInverseSubtle }}>
            panel: backgroundInverse · card: surfaceInverse
          </span>
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Sentiment</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sentimentGroups.map((group) => {
            const tokens = color[group];
            return (
              <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 64, fontSize: 12 }}>{group}</span>
                <div className={css.sentimentRow}>
                  {sentimentFields.map((field) => (
                    <div key={field} className={css.cell} style={{ alignItems: 'center' }}>
                      <div
                        className={css.sentimentCard}
                        style={{
                          background: field === 'surface' ? tokens.surface : color.surface,
                          border: `1px solid ${field === 'border' ? tokens.border : color.border}`,
                        }}
                      >
                        {field === 'text' && (
                          // The intended pairing (ADR-0005's worked example): sentiment.text
                          // (700) is authored to sit ON sentiment.surface (100), not on the
                          // neutral page surface — showing it there is both the honest specimen
                          // AND what passes AA (~7-8.5:1 across all four families).
                          <span style={{ color: tokens.text, fontSize: 13, fontWeight: 500 }}>
                            Aa
                          </span>
                        )}
                        {field === 'icon' && (
                          <span aria-hidden="true" style={{ color: tokens.icon, fontSize: 16 }}>
                            ●
                          </span>
                        )}
                        {/* surface/border demonstrate themselves via the card's own fill/ring —
                            no inner mark needed, and one would misleadingly imply icon color. */}
                      </div>
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Space</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(space).map(([name, cssVar]) => (
            <SpaceBar key={name} name={name} cssVar={cssVar} />
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Control Height (density lever)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          {Object.entries(controlHeight).map(([name, cssVar]) => (
            <ControlHeightSwatch key={name} name={name} cssVar={cssVar} />
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Radius</h2>
        <div className={css.row}>
          {Object.entries(radius).map(([name, cssVar]) => (
            <RadiusSwatch key={name} name={name} cssVar={cssVar} />
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof TokensPreview> = {
  title: 'Foundations/Tokens/Semantic',
  component: TokensPreview,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof TokensPreview>;

export const Overview: Story = {};
