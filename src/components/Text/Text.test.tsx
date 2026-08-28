import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import { measure } from './Text.css';

describe('Text', () => {
  it('renders as a span by default', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders the element passed via `as`, independent of variant', () => {
    render(
      <Text as="h1" typeScale="bodyMd">
        Title
      </Text>,
    );
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H1');
  });

  it('sets data-role when a role is passed', () => {
    render(<Text role="preheading">Plate 01</Text>);
    const el = screen.getByText('Plate 01');
    expect(el.dataset.role).toBe('preheading');
  });

  it('merges custom className and forwards other props', () => {
    render(
      <Text className="custom" data-testid="text-el">
        Styled
      </Text>,
    );
    const el = screen.getByTestId('text-el');
    expect(el.className).toContain('custom');
  });

  it('changes visual class between variants', () => {
    const heading = render(<Text typeScale="headingLg">Heading</Text>);
    const headingClass = heading.getByText('Heading').className;
    heading.unmount();
    const body = render(<Text typeScale="bodySm">Body</Text>);
    expect(body.getByText('Body').className).not.toBe(headingClass);
  });

  it('changes visual class between tones', () => {
    const subtle = render(<Text prominence="subtle">Subtle</Text>);
    const subtleClass = subtle.getByText('Subtle').className;
    subtle.unmount();
    const defaultTone = render(<Text prominence="default">Default</Text>);
    expect(defaultTone.getByText('Default').className).not.toBe(subtleClass);
  });

  it('applies no measure by default, so text fills its container', () => {
    render(<Text as="p">Uncapped</Text>);
    expect(screen.getByText('Uncapped').dataset.measure).toBeUndefined();
  });

  it('caps line length only when measure is passed', () => {
    const plain = render(<Text as="p">Prose</Text>);
    const plainClass = plain.getByText('Prose').className;
    plain.unmount();
    const capped = render(
      <Text as="p" measure="md">
        Prose
      </Text>,
    );
    const el = capped.getByText('Prose');
    expect(el.className).not.toBe(plainClass);
    expect(el.dataset.measure).toBe('md');
  });

  it('changes visual class between measure steps', () => {
    const sm = render(<Text measure="sm">Copy</Text>);
    const smClass = sm.getByText('Copy').className;
    sm.unmount();
    const lg = render(<Text measure="lg">Copy</Text>);
    expect(lg.getByText('Copy').className).not.toBe(smClass);
  });

  it('keeps measure independent of `as` — a <p> is not capped implicitly', () => {
    render(
      <>
        <Text as="p">Hint</Text>
        <Text as="span" measure="sm">
          Capped span
        </Text>
      </>,
    );
    expect(screen.getByText('Hint').dataset.measure).toBeUndefined();
    expect(screen.getByText('Capped span').dataset.measure).toBe('sm');
  });

  it('every measure step clears the Impeccable line-length ceiling of 42.5em', () => {
    // The rule scores `width / (fontSize * 0.5)` and fires above 85. `1ch` is
    // ~0.607em in the body sans, so the widest step must stay under 42.5em.
    for (const value of Object.values(measure)) {
      const em = Number.parseFloat(value) * 0.607;
      expect(em).toBeLessThan(42.5);
    }
  });
});
