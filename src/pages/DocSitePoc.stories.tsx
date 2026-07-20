import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import {
  tahitianLightThemeClass,
  tahitianDarkThemeClass,
} from '../themes/tahitian.css';
import {
  freshwaterLightThemeClass,
  freshwaterDarkThemeClass,
} from '../themes/freshwater.css';
import {
  southSeaLightThemeClass,
  southSeaDarkThemeClass,
} from '../themes/south-sea.css';
import { color, space } from '../tokens';
import * as css from './doc-site-poc.css';

type ThemeName = 'tahitian' | 'freshwater' | 'southSea';
type Mode = 'light' | 'dark';

// This page is a POC of the real doc site, not a Storybook story wrapped in
// Storybook's own preview chrome — a production site can't depend on the
// Storybook toolbar, so theme×mode switching is reimplemented natively here:
// local React state + a real in-page control, applying one of the six real
// theme classes directly. Nothing here reads Storybook globals.
const themeMatrix: Record<ThemeName, Record<Mode, string>> = {
  tahitian: { light: tahitianLightThemeClass, dark: tahitianDarkThemeClass },
  freshwater: { light: freshwaterLightThemeClass, dark: freshwaterDarkThemeClass },
  southSea: { light: southSeaLightThemeClass, dark: southSeaDarkThemeClass },
};

const themeLabels: Record<ThemeName, string> = {
  tahitian: 'Tahitian',
  freshwater: 'Freshwater',
  southSea: 'South Sea',
};

type EditableToken = 'background' | 'surface' | 'text' | 'border' | 'accent' | 'focusRing';

interface EditorControl {
  key: EditableToken;
  label: string;
  reference: string;
}

// The editor overrides emitted CSS custom properties on the preview wrapper —
// it does not recompile a theme. This is the runtime proof that every
// component consumes the semantic contract rather than hard-coded values.
const editorControls: readonly EditorControl[] = [
  { key: 'background', label: 'Background', reference: color.background },
  { key: 'surface', label: 'Surface', reference: color.surface },
  { key: 'text', label: 'Text', reference: color.text },
  { key: 'border', label: 'Border', reference: color.border },
  { key: 'accent', label: 'Accent', reference: color.accent },
  { key: 'focusRing', label: 'Focus', reference: color.focusRing },
];

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

function DocSitePoc() {
  const [theme, setTheme] = useState<ThemeName>('tahitian');
  const [mode, setMode] = useState<Mode>('dark');
  const themeClass = themeMatrix[theme][mode];

  const rootRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<EditableToken, string> | null>(null);

  // Changing theme/mode must clear any manual override FIRST (batched into the
  // same commit as the theme/mode change itself), before the resync effect
  // below measures anything — an inline style override outranks a class-based
  // CSS custom property, so measuring while the OLD override is still applied
  // would just read the old override back, never the new theme's real values.
  function selectTheme(name: ThemeName) {
    setTheme(name);
    setValues(null);
  }
  function selectMode(m: Mode) {
    setMode(m);
    setValues(null);
  }

  // Whenever the real theme/mode changes, re-sync the editor's displayed
  // values from the DOM's actually-resolved CSS custom properties — rather
  // than a hardcoded guess, this always reflects whichever of the six real
  // themes is active. Manual edits below still apply on top via `style`.
  useEffect(() => {
    if (!rootRef.current) return;
    const computed = getComputedStyle(rootRef.current);
    const next = {} as Record<EditableToken, string>;
    for (const { key, reference } of editorControls) {
      const raw = computed.getPropertyValue(customPropertyName(reference)).trim();
      next[key] = raw || '#000000';
    }
    setValues(next);
    // Intentionally re-run on [theme, mode] only, not on `values` — this
    // effect exists to resync from the DOM, it must not react to its own writes.
  }, [theme, mode]);

  const overrideStyle = useMemo<CSSProperties>(
    () => (values ? inlineThemeOverrides(values) : {}),
    [values],
  );

  function updateToken(key: EditableToken, value: string) {
    setValues((current) => (current ? { ...current, [key]: value.toUpperCase() } : current));
  }

  return (
    <div ref={rootRef} className={`${themeClass} ${css.experience}`} style={overrideStyle}>
      <section className={css.hero} aria-labelledby="pearl-hero-heading">
        <header className={css.heroMeta}>
          <span className={css.brandMark}>Pearl / DS</span>

          <div
            className={css.switcherGroup}
            role="group"
            aria-label="Theme"
            style={{ marginLeft: 'auto', marginRight: space.md }}
          >
            {(Object.keys(themeMatrix) as ThemeName[]).map((name) => (
              <button
                key={name}
                type="button"
                className={css.switcherButton}
                data-active={theme === name}
                aria-pressed={theme === name}
                onClick={() => selectTheme(name)}
              >
                {themeLabels[name]}
              </button>
            ))}
          </div>

          <div className={css.switcherGroup} role="group" aria-label="Mode">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={css.switcherButton}
                data-active={mode === m}
                aria-pressed={mode === m}
                onClick={() => selectMode(m)}
              >
                {m === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>

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
                These controls override the active semantic CSS variables in real time, on top of
                whichever theme/mode is selected above. The landing, docs, and components all update
                together because none own their visual values.
              </p>
            </div>
            <div className={css.tokenEditor} aria-label="Live semantic token editor">
              {values &&
                editorControls.map(({ key, label }) => (
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

const meta: Meta<typeof DocSitePoc> = {
  title: 'POC/Landing',
  component: DocSitePoc,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof DocSitePoc>;

export const Landing: Story = {};
