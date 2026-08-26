import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

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
});
