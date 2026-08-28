import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders the override contract attribute and defaults to the info variant', () => {
    render(<Alert data-testid="alert">A message</Alert>);
    const el = screen.getByTestId('alert');
    expect(el).toHaveAttribute('data-component', 'alert');
    expect(el).not.toHaveAttribute('role');
  });

  it('sets role="alert" only on the urgent variants', () => {
    const { rerender } = render(
      <Alert data-testid="alert" variant="negative">
        Error
      </Alert>,
    );
    expect(screen.getByTestId('alert')).toHaveAttribute('role', 'alert');

    rerender(
      <Alert data-testid="alert" variant="warn">
        Warning
      </Alert>,
    );
    expect(screen.getByTestId('alert')).toHaveAttribute('role', 'alert');

    rerender(
      <Alert data-testid="alert" variant="positive">
        Success
      </Alert>,
    );
    expect(screen.getByTestId('alert')).not.toHaveAttribute('role');
  });

  it('renders heading and children', () => {
    render(<Alert heading="Heads up">Details here</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('renders without a heading', () => {
    render(<Alert>Just a message</Alert>);
    expect(screen.getByText('Just a message')).toBeInTheDocument();
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<Alert>No dismiss</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a dismiss button and calls onDismiss when clicked', async () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Dismissible</Alert>);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('merges a custom className', () => {
    render(<Alert data-testid="alert" className="custom">content</Alert>);
    expect(screen.getByTestId('alert').className).toContain('custom');
  });
});
