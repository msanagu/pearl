import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input by default with the override contract attribute', () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('data-component', 'input');
  });

  it('respects an explicit type', () => {
    render(<Input type="email" aria-label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts user typing', async () => {
    render(<Input aria-label="Typed" />);
    const input = screen.getByRole('textbox', { name: 'Typed' });
    await userEvent.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('merges a custom className', () => {
    render(<Input aria-label="Styled" className="custom" />);
    expect(screen.getByRole('textbox', { name: 'Styled' }).className).toContain(
      'custom',
    );
  });
});
