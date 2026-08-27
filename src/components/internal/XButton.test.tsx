import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { XButton } from './XButton';

describe('XButton', () => {
  it('defaults to an accessible name of "Close"', () => {
    render(<XButton />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('accepts an aria-label override', () => {
    render(<XButton aria-label="Dismiss notification" />);
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<XButton onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
