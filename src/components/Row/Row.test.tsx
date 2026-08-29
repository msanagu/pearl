import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from './Row';
import { Stack } from '@components/Stack/Stack';

describe('Row', () => {
  it('renders a div by default with children', () => {
    render(
      <Row data-testid="row">
        <span>Item</span>
      </Row>,
    );
    const row = screen.getByTestId('row');
    expect(row.tagName).toBe('DIV');
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders the element passed via `as`', () => {
    render(<Row as="nav" data-testid="row" />);
    expect(screen.getByTestId('row').tagName).toBe('NAV');
  });

  it('applies a direction class distinct from Stack (row vs column)', () => {
    render(<Row data-testid="row" />);
    render(<Stack data-testid="stack" />);
    expect(screen.getByTestId('row').className).not.toBe(screen.getByTestId('stack').className);
  });

  it('merges a custom className', () => {
    render(<Row className="custom" data-testid="row" />);
    expect(screen.getByTestId('row').className).toContain('custom');
  });
});
