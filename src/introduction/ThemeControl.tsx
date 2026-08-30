import * as css from './ThemeControl.css';

/**
 * The page's own theme switcher, rendered in the hero nav. Presentational only —
 * the story decorator wires it to Storybook's `theme` / `mode` globals, so the
 * toolbar and this control are two UIs onto one source of truth and can't
 * diverge. In the standalone `iframe.html` embed the toolbar is gone and this
 * is the only switcher.
 *
 * Storybook preview hooks (`useGlobals`) only run in a decorator or story
 * function, never a nested component — that's why the globals plumbing lives in
 * the story, not here.
 */
const THEMES = [
  { value: 'pearl', label: 'Pearl' },
  { value: 'tahitian', label: 'Tahitian' },
  { value: 'freshwater', label: 'Freshwater' },
  { value: 'southSea', label: 'South Sea' },
];

const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export interface ThemeControlProps {
  theme: string;
  mode: string;
  onThemeChange: (theme: string) => void;
  onModeChange: (mode: string) => void;
}

export function ThemeControl({
  theme,
  mode,
  onThemeChange,
  onModeChange,
}: ThemeControlProps) {
  return (
    <div className={css.group}>
      <select
        className={css.select}
        aria-label="Theme"
        value={theme}
        onChange={(e) => onThemeChange(e.target.value)}
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <select
        className={css.select}
        aria-label="Mode"
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
      >
        {MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
