import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { color, space, text } from './tokens';
import {
  tahitianLightThemeClass,
  tahitianDarkThemeClass,
} from './themes/tahitian/tahitian.css';

// Phase 1 smoke tests: prove the token layer resolves and the test harness
// (Vitest + RTL + jsdom + jest-dom matchers) is wired end-to-end. Real
// component tests arrive with Button in Phase 2.

describe('token layer', () => {
  it('exposes the documented token groups', () => {
    expect(color.accent).toBeTruthy();
    expect(color.backgroundInverse).toBeTruthy();
    expect(color.negative.icon).toBeTruthy();
    expect(space['2xl']).toBeTruthy();
    expect(text.headingLg.fontSize).toBeTruthy();
  });
});

describe('Tahitian theme', () => {
  it('both modes fulfill the same theme contract', () => {
    expect(typeof tahitianLightThemeClass).toBe('string');
    expect(tahitianLightThemeClass.length).toBeGreaterThan(0);
    expect(typeof tahitianDarkThemeClass).toBe('string');
    expect(tahitianDarkThemeClass.length).toBeGreaterThan(0);
  });
});

describe('test harness', () => {
  it('renders and queries the DOM via RTL', () => {
    render(
      <button type="button" className={tahitianDarkThemeClass}>
        Click me
      </button>,
    );
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });
});
