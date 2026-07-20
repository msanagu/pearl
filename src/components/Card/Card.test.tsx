import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders the root with the override contract attribute', () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId('card')).toHaveAttribute('data-component', 'card');
  });

  it('renders Header and Body with matching data-part attributes', () => {
    render(
      <Card>
        <Card.Header data-testid="header">Title</Card.Header>
        <Card.Body data-testid="body">Body</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('header')).toHaveAttribute('data-part', 'header');
    expect(screen.getByTestId('body')).toHaveAttribute('data-part', 'body');
  });

  it('merges custom className on each part', () => {
    render(
      <Card className="root-custom">
        <Card.Header className="header-custom" data-testid="header">
          Title
        </Card.Header>
      </Card>,
    );
    expect(screen.getByTestId('header').className).toContain('header-custom');
  });

  it('renders composed content', () => {
    render(
      <Card>
        <Card.Header>Profile</Card.Header>
        <Card.Body>Details</Card.Body>
      </Card>,
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
