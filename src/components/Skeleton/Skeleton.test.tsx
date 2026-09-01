import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders the override contract attribute and defaults to the text variant', () => {
    render(<Skeleton data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('data-component', 'skeleton');
    expect(el).toHaveAttribute('data-variant', 'text');
  });

  it('is hidden from assistive tech — the region announces loading, not each placeholder', () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies width and height to the element', () => {
    render(
      <Skeleton data-testid="s" variant="block" width={120} height={40} />,
    );
    const el = screen.getByTestId('s');
    expect(el.style.width).toBe('120px');
    expect(el.style.height).toBe('40px');
  });

  it('lets a caller-supplied style survive alongside the dimension props', () => {
    render(
      <Skeleton data-testid="s" width={50} style={{ marginTop: '4px' }} />,
    );
    const el = screen.getByTestId('s');
    expect(el.style.width).toBe('50px');
    expect(el.style.marginTop).toBe('4px');
  });

  it('merges a custom className', () => {
    render(<Skeleton data-testid="s" className="custom" />);
    expect(screen.getByTestId('s').className).toContain('custom');
  });

  it('carries no text content for a screen reader to read', () => {
    const { container } = render(<Skeleton />);
    expect(container.textContent).toBe('');
  });
});
