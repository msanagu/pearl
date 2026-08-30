import { useState } from 'react';
import type { FormEvent } from 'react';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Field } from '@components/Field/Field';
import { Input } from '@components/Input/Input';
import { Alert } from '@components/Alert/Alert';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { color, space } from '@tokens';

interface FormValues {
  fullName: string;
  email: string;
  company: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  referralCode: string;
}

const initialValues: FormValues = {
  fullName: '',
  email: '',
  company: '',
  addressLine1: '',
  city: '',
  postalCode: '',
  referralCode: '',
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalCodePattern = /^\d{5}(-\d{4})?$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';

  if (!values.email.trim()) errors.email = 'Enter an email address.';
  else if (!emailPattern.test(values.email))
    errors.email = 'Enter a valid email address.';

  if (!values.addressLine1.trim())
    errors.addressLine1 = 'Enter a street address.';
  if (!values.city.trim()) errors.city = 'Enter a city.';

  if (!values.postalCode.trim()) errors.postalCode = 'Enter a postal code.';
  else if (!postalCodePattern.test(values.postalCode)) {
    errors.postalCode = 'Use the format 12345 or 12345-6789.';
  }

  return errors;
}

/**
 * A multi-section form template — composed entirely from existing primitives
 * (`Field`, `Input`, `Alert`, `Card`, `Button`, `Text`, `Stack`, `Row`). Real
 * `useState`-backed values, submit-time validation, per-field `Field` errors,
 * and a page-level `Alert` for the overall outcome, so the pattern is visible
 * end to end rather than mocked with static props.
 *
 * No `Select`/`Checkbox`/`Radio`/`Textarea` exist in the system yet (see
 * template README/story notes) — every field here is deliberately an `Input`,
 * so the showcase never reaches for a control the system doesn't have.
 */
export function Form() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatus(Object.keys(nextErrors).length === 0 ? 'success' : 'idle');
  }

  const errorCount = Object.keys(errors).length;

  return (
    <Stack
      as="form"
      gap="xl"
      onSubmit={handleSubmit}
      noValidate
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: `${space['2xl']} ${space.xl}`,
      }}
    >
      <Stack gap="xs">
        <Text typeScale="displaySm" as="h1" style={{ margin: 0 }}>
          Shipping details
        </Text>
        <Text typeScale="bodyMd" prominence="subtle" as="p" measure="md">
          Required fields are marked. Submitting with missing or invalid values
          surfaces both an inline error on the field and a summary banner above
          the form.
        </Text>
      </Stack>

      {errorCount > 0 && (
        <Alert variant="negative" heading="Fix the following before continuing">
          {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'}{' '}
          attention below.
        </Alert>
      )}
      {status === 'success' && errorCount === 0 && (
        <Alert variant="positive" heading="Order details saved">
          We'll use this information for your next shipment.
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2" style={{ margin: 0 }}>
            Contact
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <Field label="Full name" required error={errors.fullName}>
              {(injected) => (
                <Input
                  {...injected}
                  value={values.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  autoComplete="name"
                />
              )}
            </Field>
            <Field
              label="Email"
              required
              error={errors.email}
              hint="We'll send order updates here."
            >
              {(injected) => (
                <Input
                  {...injected}
                  type="email"
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  autoComplete="email"
                />
              )}
            </Field>
            <Field label="Company" error={errors.company}>
              {(injected) => (
                <Input
                  {...injected}
                  value={values.company}
                  onChange={(e) => setField('company', e.target.value)}
                  autoComplete="organization"
                />
              )}
            </Field>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2" style={{ margin: 0 }}>
            Shipping address
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <Field label="Address line 1" required error={errors.addressLine1}>
              {(injected) => (
                <Input
                  {...injected}
                  value={values.addressLine1}
                  onChange={(e) => setField('addressLine1', e.target.value)}
                  autoComplete="address-line1"
                />
              )}
            </Field>
            <Row gap="lg" wrap>
              <div style={{ flex: '1 1 240px' }}>
                <Field label="City" required error={errors.city}>
                  {(injected) => (
                    <Input
                      {...injected}
                      value={values.city}
                      onChange={(e) => setField('city', e.target.value)}
                      autoComplete="address-level2"
                    />
                  )}
                </Field>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <Field
                  label="Postal code"
                  required
                  error={errors.postalCode}
                  hint="Format: 12345"
                >
                  {(injected) => (
                    <Input
                      {...injected}
                      value={values.postalCode}
                      onChange={(e) => setField('postalCode', e.target.value)}
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                  )}
                </Field>
              </div>
            </Row>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2" style={{ margin: 0 }}>
            Preferences
          </Text>
        </Card.Header>
        <Card.Body>
          <Field
            label="Referral code"
            hint="Optional — applies a discount at checkout."
          >
            {(injected) => (
              <Input
                {...injected}
                value={values.referralCode}
                onChange={(e) => setField('referralCode', e.target.value)}
              />
            )}
          </Field>
        </Card.Body>
      </Card>

      <Row
        gap="sm"
        justify="end"
        style={{ borderTop: `1px solid ${color.border}`, paddingTop: space.lg }}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setValues(initialValues);
            setErrors({});
            setStatus('idle');
          }}
        >
          Reset
        </Button>
        <Button type="submit" variant="primary">
          Save shipping details
        </Button>
      </Row>
    </Stack>
  );
}
