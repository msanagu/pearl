# Vanilla-Extract Theming Example: Contract + Light/Dark + Multiple Themes

## 1. Define the theme contract (the shape, no values yet)

This is the single source of truth for what tokens exist. Every theme you create later must fulfill this exact shape — TypeScript will error if a theme is missing a token.

```ts
// theme.css.ts
import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    textPrimary: null,
    textSecondary: null,
    brandPrimary: null,
    brandSecondary: null,
    border: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
  },
});
```

## 2. Implement a light theme against that contract

```ts
// themes/light.css.ts
import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const lightThemeClass = createTheme(vars, {
  color: {
    background: '#ffffff',
    surface: '#f5f5f7',
    textPrimary: '#111111',
    textSecondary: '#5f5f5f',
    brandPrimary: '#3b5bfd',
    brandSecondary: '#7c4dff',
    border: '#e0e0e0',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
});
```

## 3. Implement a dark theme against the *same* contract

```ts
// themes/dark.css.ts
import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const darkThemeClass = createTheme(vars, {
  color: {
    background: '#0e0e10',
    surface: '#1a1a1d',
    textPrimary: '#f5f5f7',
    textSecondary: '#a0a0a5',
    brandPrimary: '#6d84ff',
    brandSecondary: '#9c7bff',
    border: '#2c2c30',
  },
  space: {
    // spacing scale usually stays identical across light/dark —
    // only repeated here because the contract requires every key
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
});
```

## 4. Using the theme classes at the root of your app

```tsx
// App.tsx
import { lightThemeClass } from './themes/light.css';
import { darkThemeClass } from './themes/dark.css';
import { useState } from 'react';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const themeClass = mode === 'light' ? lightThemeClass : darkThemeClass;

  return (
    <div className={themeClass}>
      {/* everything inside now resolves vars.color.background, etc,
          to whichever theme class wraps it — zero runtime JS involved */}
      <YourApp />
    </div>
  );
}
```

## 5. Consuming tokens inside a component

```ts
// Button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const button = style({
  backgroundColor: vars.color.brandPrimary,
  color: vars.color.background,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});
```

```tsx
// Button.tsx
import { button } from './Button.css';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={button}>{children}</button>;
}
```

No conditional logic, no props for color — the button automatically re-themes based on whichever `themeClass` is an ancestor in the DOM. This is the payoff of the contract pattern: components don't know or care which theme is active.

---

## 6. Extending to *multiple brand themes*, each with light/dark

This is where the contract pattern really earns its keep — say you want a "default" brand and an "ocean" brand, each with their own light/dark pair. Same contract, four implementations:

```ts
// themes/default-light.css.ts
export const defaultLightClass = createTheme(vars, { /* ... */ });

// themes/default-dark.css.ts
export const defaultDarkClass = createTheme(vars, { /* ... */ });

// themes/ocean-light.css.ts
export const oceanLightClass = createTheme(vars, {
  color: {
    brandPrimary: '#0088cc',
    brandSecondary: '#00c2a8',
    // ...rest of contract filled in
  },
  // ...
});

// themes/ocean-dark.css.ts
export const oceanDarkClass = createTheme(vars, {
  color: {
    brandPrimary: '#3aa8e0',
    brandSecondary: '#2de0c2',
    // ...
  },
  // ...
});
```

Then resolve which class to apply based on two independent selections (brand + mode):

```tsx
const themeMap = {
  default: { light: defaultLightClass, dark: darkThemeClass },
  ocean: { light: oceanLightClass, dark: oceanDarkClass },
};

const themeClass = themeMap[brand][mode];
```

## Why this matters for your project specifically

- **Type safety is the real win**: if a theme implementation is missing a token or has a typo in a key name, TypeScript catches it at compile time — no "forgot to define `--color-brand-secondary` in dark mode" bugs that only show up visually.
- **Zero runtime cost**: switching themes is just swapping a class name on a wrapper element — no JS recalculation, no re-render cascade, just CSS custom properties resolving differently under a different ancestor class.
- **This maps directly onto your "dumb outside its four walls" philosophy**: `Button` never imports a theme, never checks `mode`, never branches on brand. It only ever references `vars.*`. The theme is applied structurally (by wrapping ancestor), not through props threaded into every component.
