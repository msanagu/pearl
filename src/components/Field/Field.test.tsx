import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from '../Input/Input';

describe('Field', () => {
  it('associates the label with the injected input via id', () => {
    render(<Field label="Email">{(props) => <Input {...props} />}</Field>);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('renders the hint and links it via aria-describedby', () => {
    render(
      <Field label="Email" hint="We'll never share it">
        {(props) => <Input {...props} />}
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    const hint = screen.getByText("We'll never share it");
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('renders the error, sets aria-invalid, and describes it via role="alert"', () => {
    render(
      <Field label="Email" error="Required">
        {(props) => <Input {...props} />}
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Required');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('combines both hint and error ids in aria-describedby', () => {
    render(
      <Field label="Email" hint="hint text" error="error text">
        {(props) => <Input {...props} />}
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ')).toHaveLength(2);
  });

  it('sets aria-invalid false and omits aria-describedby when no hint/error', () => {
    render(<Field label="Email">{(props) => <Input {...props} />}</Field>);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
