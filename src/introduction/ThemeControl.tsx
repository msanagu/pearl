import { PiMoonBold, PiSunBold } from 'react-icons/pi';
import { Icon } from '@components/Icon/Icon';
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

export interface ThemeControlProps {
  theme: string;
  mode: string;
  onThemeChange: (theme: string) => void;
  onModeChange: (mode: string) => void;
}

/**
 * `ModeToggle` — a sun/moon icon button standing in for a two-option select.
 *
 * This is deliberately an Introduction-only extension, not a shipped
 * component: no `IconButton` primitive exists yet in `src/components/`, and
 * one earns its place from repeated real use (see decision 0002 in the
 * Introduction page's own Conventions index), not built ahead of a second
 * call site. It's kept self-contained on purpose — no Storybook globals, no
 * page-specific state, just `mode`/`onModeChange` in, an icon `<button>` out —
 * so promoting it later is a file move plus a generic name, not a rewrite.
 *
 * Icon shows the *current* mode (sun while light, moon while dark), the way a
 * state indicator reads rather than a "switch to X" prompt; the accessible
 * name carries the action instead (`aria-label`, `aria-pressed`).
 */
function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: string;
  onModeChange: (mode: string) => void;
}) {
  const isDark = mode === 'dark';
  return (
    <button
      type="button"
      className={css.modeToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      onClick={() => onModeChange(isDark ? 'light' : 'dark')}
    >
      <Icon icon={isDark ? PiMoonBold : PiSunBold} size={18} aria-hidden="true" />
    </button>
  );
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
      <ModeToggle mode={mode} onModeChange={onModeChange} />
    </div>
  );
}
