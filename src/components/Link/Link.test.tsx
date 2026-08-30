import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with the override contract attribute', () => {
    render(<Link href="/docs">Docs</Link>);
    const el = screen.getByRole('link', { name: 'Docs' });
    expect(el).toHaveAttribute('data-component', 'link');
    expect(el).toHaveAttribute('href', '/docs');
  });

  it('forwards arbitrary anchor attributes', () => {
    render(
      <Link href="https://example.com" target="_blank" rel="noreferrer">
        External
      </Link>,
    );
    const el = screen.getByRole('link', { name: 'External' });
    expect(el).toHaveAttribute('target', '_blank');
    expect(el).toHaveAttribute('rel', 'noreferrer');
  });

  it('merges a custom className', () => {
    render(
      <Link href="#" className="custom">
        Label
      </Link>,
    );
    expect(screen.getByRole('link').className).toContain('custom');
  });
});
