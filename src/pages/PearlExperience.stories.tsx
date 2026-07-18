import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { tahitianDarkThemeClass } from '../themes/tahitian.css';
import { color } from '../tokens';
import * as css from './pearl-experience.css';

type EditableToken = 'background' | 'surface' | 'text' | 'border' | 'accent' | 'focusRing';

interface EditorControl {
  key: EditableToken;
  label: string;
  reference: string;
  initialValue: string;
}

// The editor changes emitted CSS custom properties on its preview wrapper. It
// does not recompile a theme in the browser — this is the runtime proof that
// every component consumes the semantic contract rather than hard-coded values.
// Initial values mirror `tahitianDarkThemeClass` (currently a placeholder
// alias of the generic dark theme — see themes/tahitian.css.ts).
const editorControls: readonly EditorControl[] = [
  { key: 'background', label: 'Background', reference: color.background, initialValue: '#0E0E10' },
  { key: 'surface', label: 'Surface', reference: color.surface, initialValue: '#1A1A1D' },
  { key: 'text', label: 'Text', reference: color.text, initialValue: '#F5F5F7' },
  { key: 'border', label: 'Border', reference: color.border, initialValue: '#2C2C30' },
  { key: 'accent', label: 'Accent', reference: color.accent, initialValue: '#6D84FF' },
  { key: 'focusRing', label: 'Focus', reference: color.focusRing, initialValue: '#6D84FF' },
];

const initialEditorValues = Object.fromEntries(
  editorControls.map(({ key, initialValue }) => [key, initialValue]),
) as Record<EditableToken, string>;

function customPropertyName(reference: string): string {
  const match = reference.match(/^var\((--[^,)]+)/);
  if (!match?.[1]) {
    throw new Error(`Expected a CSS variable reference, received: ${reference}`);
  }
  return match[1];
}

function inlineThemeOverrides(values: Record<EditableToken, string>): CSSProperties {
  const overrides: Record<string, string> = {};
  for (const { key, reference } of editorControls) {
    overrides[customPropertyName(reference)] = values[key];
  }
  return overrides as CSSProperties;
}

function PearlExperience() {
  const [values, setValues] = useState<Record<EditableToken, string>>(initialEditorValues);
  const style = useMemo(() => inlineThemeOverrides(values), [values]);

  function updateToken(key: EditableToken, value: string) {
    setValues((current) => ({ ...current, [key]: value.toUpperCase() }));
  }

  return (
    <div className={`${tahitianDarkThemeClass} ${css.experience}`} style={style}>
      <section className={css.hero} aria-labelledby="pearl-hero-heading">
        <header className={css.heroMeta}>
          <span className={css.brandMark}>Pearl / DS</span>
          <span className={css.heroIndex}>A system for identities that refuse sameness</span>
        </header>

        <div className={css.heroContent}>
          <h1 className={css.heroStatement} id="pearl-hero-heading">
            Built to change.
            <br />
            Designed to hold.
          </h1>
          <div className={css.heroAside}>
            <span className={css.heroNumber}>01</span>
            <span>
              Pearl gives teams a stable system of decisions—then leaves identity where it belongs:
              with them.
            </span>
          </div>
        </div>

        <span className={css.heroWord} aria-hidden="true">PEARL</span>
      </section>

      <main className={css.docs} id="documentation">
        <aside className={css.docsRail} aria-label="Documentation sections">
          <p className={css.railLabel}>Documentation</p>
          <h2 className={css.railHeading}>Start with what holds.</h2>
          <nav className={css.railLinks}>
            <a className={css.railLink} data-current="true" href="#foundations">
              Foundations <span>01</span>
            </a>
            <a className={css.railLink} href="#components">
              Components <span>02</span>
            </a>
            <a className={css.railLink} href="#playground">
              Token Playground <span>03</span>
            </a>
          </nav>
        </aside>

        <div className={css.docsContent}>
          <section className={css.intro} id="foundations" aria-labelledby="foundations-heading">
            <p className={css.docsKicker}>Foundations / 01</p>
            <h2 className={css.docsHeading} id="foundations-heading">
              A durable structure for a changing point of view.
            </h2>
            <p className={css.docsLead}>
              Pearl keeps its defaults quiet enough for information, then lets a distinctive undertone
              surface in the seams: focus, selection, and the response of a surface to interaction.
            </p>
          </section>

          <section className={css.specimenGrid} id="components" aria-labelledby="components-heading">
            <div>
              <p className={css.sectionEyebrow}>Components / 02</p>
              <h2 className={css.sectionHeading} id="components-heading">Decisive by default.</h2>
              <p className={css.sectionCopy}>
                The primary action is ink, not a brand-colored button. Oyster stone is held for identity
                and orientation, so the interface stays useful before it becomes expressive.
              </p>
              <div className={css.actionRow}>
                <Button size="lg">Read the principles</Button>
                <Button size="lg" variant="secondary">Inspect tokens</Button>
              </div>
            </div>

            <Card>
              <Card.Header>
                <p className={css.sectionEyebrow}>System status</p>
                <p className={css.releaseTitle}>Foundation coverage</p>
              </Card.Header>
              <Card.Body>
                <Input aria-label="Search documentation" placeholder="Search documentation" />
              </Card.Body>
            </Card>
          </section>

          <section className={css.specimenGrid} aria-label="Release and material specimen">
            <div className={css.releaseModule} tabIndex={0}>
              <div className={css.releaseContent}>
                <span className={css.releaseNumber}>0.1</span>
                <div>
                  <h2 className={css.releaseTitle}>The first layer</h2>
                  <p className={css.releaseCopy}>
                    Hover to see the material response: quiet at rest, perceptible only in motion.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className={css.sectionEyebrow}>Material / 03</p>
              <h2 className={css.sectionHeading}>Luster is not decoration.</h2>
              <p className={css.sectionCopy}>
                It is a restrained cue for interaction. The effect is localized, honors reduced-motion
                settings, and never competes with the information on the surface.
              </p>
            </div>
          </section>

          <section className={css.playground} id="playground" aria-labelledby="playground-heading">
            <div className={css.playgroundCopy}>
              <p className={css.sectionEyebrow}>Token Playground / 03</p>
              <h2 className={css.playgroundTitle} id="playground-heading">Change the values. Keep the system.</h2>
              <p className={css.playgroundBody}>
                These controls override the active semantic CSS variables in real time. The landing, docs,
                and components all update together because none own their visual values.
              </p>
            </div>
            <div className={css.tokenEditor} aria-label="Live semantic token editor">
              {editorControls.map(({ key, label }) => (
                <label className={css.tokenRow} key={key}>
                  <span className={css.tokenName}>{label}</span>
                  <input
                    className={css.colorInput}
                    aria-label={`${label} color`}
                    type="color"
                    value={values[key]}
                    onChange={(event) => updateToken(key, event.target.value)}
                  />
                  <input
                    className={css.tokenValue}
                    aria-label={`${label} hex value`}
                    value={values[key]}
                    maxLength={7}
                    onChange={(event) => updateToken(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const meta: Meta<typeof PearlExperience> = {
  title: 'Pearl/Experience',
  component: PearlExperience,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof PearlExperience>;

export const LandingToDocs: Story = {};
