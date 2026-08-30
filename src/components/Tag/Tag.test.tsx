import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders the override contract attribute and defaults to the neutral variant', () => {
    render(<Tag data-testid="tag">Label</Tag>);
    const el = screen.getByTestId('tag');
    expect(el).toHaveAttribute('data-component', 'tag');
  });

  it('renders children', () => {
    render(<Tag>Design systems</Tag>);
    expect(screen.getByText('Design systems')).toBeInTheDocument();
  });

  it('is not a button or link — no interactive role', () => {
    render(<Tag>Static</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('merges a custom className', () => {
    render(
      <Tag data-testid="tag" className="custom">
        content
      </Tag>,
    );
    expect(screen.getByTestId('tag').className).toContain('custom');
  });
});
