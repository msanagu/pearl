import type { Meta, StoryObj } from '@storybook/react-vite';
import { color, controlHeight, radius, space, text } from '../tokens';
import * as css from './tokens.css';

/**
 * Foundations → Tokens: a live specimen of the whole token contract, rendered
 * under `lightThemeClass`. This is not a component — it's a validation surface
 * for the token layer (ADR-0005 tiers, ADR-0006 naming). Values shown are
 * whatever the active theme defines; colors are PLACEHOLDERS pending the
 * visual-language exploration.
 */

// Flat (non-nested) color tokens — sentiment groups are rendered separately.
const flatColorEntries = Object.entries(color).filter(
  ([, value]) => typeof value === 'string',
) as [string, string][];

const sentimentGroups = ['positive', 'negative', 'warn', 'info'] as const;

function TokensPreview() {
  // No theme wrapper here — the global preview decorator supplies Pearl's
  // authored theme. Alternate values are demonstrated in Pearl/Experience.
  return (
      <div className={css.page}>
        <section className={css.section}>
          <h2 className={css.sectionTitle}>Color</h2>
          <div className={css.row}>
            {flatColorEntries.map(([name, cssVar]) => (
              <div className={css.cell} key={name}>
                <div className={css.swatch} style={{ background: cssVar }} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={css.section}>
          <h2 className={css.sectionTitle}>Sentiment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sentimentGroups.map((group) => {
              const tokens = color[group];
              return (
                <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 64, fontSize: 12 }}>{group}</span>
                  <div className={css.sentimentRow}>
                    <div
                      className={css.sentimentCard}
                      style={{
                        background: tokens.surface,
                        border: `1px solid ${tokens.border}`,
                      }}
                    >
                      <span style={{ color: tokens.text, fontSize: 11 }}>surface</span>
                      <span style={{ color: tokens.icon, fontSize: 16 }}>●</span>
                    </div>
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
              <div
                className={css.cell}
                key={name}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <span style={{ width: 40 }}>{name}</span>
                <div className={css.spaceBar} style={{ width: cssVar }} />
              </div>
            ))}
          </div>
        </section>

        <section className={css.section}>
          <h2 className={css.sectionTitle}>Control Height (density lever)</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            {Object.entries(controlHeight).map(([name, cssVar]) => (
              <div className={css.cell} key={name} style={{ alignItems: 'center' }}>
                <div className={css.controlHeightBar} style={{ width: 64, height: cssVar }} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={css.section}>
          <h2 className={css.sectionTitle}>Radius</h2>
          <div className={css.row}>
            {Object.entries(radius).map(([name, cssVar]) => (
              <div className={css.cell} key={name}>
                <div className={css.radiusBox} style={{ borderRadius: cssVar }} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={css.section}>
          <h2 className={css.sectionTitle}>Typography</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(text).map(([name, v]) => (
              <div className={css.cell} key={name}>
                <span>{name}</span>
                <span
                  style={{
                    color: color.text,
                    fontSize: v.fontSize,
                    lineHeight: v.lineHeight,
                    fontWeight: v.fontWeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
  );
}

const meta: Meta<typeof TokensPreview> = {
  title: 'Foundations/Tokens',
  component: TokensPreview,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof TokensPreview>;

export const Overview: Story = {};
