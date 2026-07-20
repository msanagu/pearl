import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a div by default with children', () => {
    render(
      <Stack data-testid="stack">
        <span>Item</span>
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('DIV');
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders the element passed via `as`', () => {
    render(<Stack as="section" data-testid="stack" />);
    expect(screen.getByTestId('stack').tagName).toBe('SECTION');
  });

  it('applies a gap-specific class distinct from another gap value', () => {
    const sm = render(<Stack gap="sm" data-testid="sm" />);
    const smClass = sm.getByTestId('sm').className;
    sm.unmount();
    const lg = render(<Stack gap="lg" data-testid="lg" />);
    expect(lg.getByTestId('lg').className).not.toBe(smClass);
  });

  it('merges a custom className', () => {
    render(<Stack className="custom" data-testid="stack" />);
    expect(screen.getByTestId('stack').className).toContain('custom');
  });
});
