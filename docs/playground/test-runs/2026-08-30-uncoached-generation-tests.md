# Playground test run — 2026-08-30 · uncoached prompt

**What changed since the previous log entry** ([2026-08-30-account-settings-generation.md](./2026-08-30-account-settings-generation.md)):
`pearl-playground`'s `systemPrompt.ts` was rewritten to remove all bespoke
usage coaching — the explain-vs-generate job split, the "treat examples as
a template" instruction, and the "ground rules" anti-hallucination
reminders are gone entirely (not toggled off — deleted, on purpose). The
prompt now ships only the raw manifest data (theme roles/treatments,
component props, real usage examples) plus one exception: the mechanical
"how this sandbox executes your code" contract (no imports, one `render()`
call), since that's a fact about `CanvasPreview`'s renderer, not design-
system guidance, and cutting it would fail every test for an unrelated
plumbing reason instead of testing the manifest's sufficiency.

**Why:** the previous coaching layer was masking exactly the failure modes
(hallucinated props, invented components, ignored constraints) an
unassisted external tool — Bolt, Copilot, a bare Claude/GPT session — would
hit with the same on-disk data and no hand-holding. If uncoached generation
starts failing, that's the real, wanted signal, not something to quietly
patch away in this prompt.

## Test 1 — Metrics dashboard, Pearl theme

**Prompt:** "Build a metrics dashboard showing revenue, active users,
churn rate, and a list of recent signups."

Rendered cleanly on the first attempt: revenue/active-users/churn-rate
stat cards, a "churn is trending up" alert, and a recent-signups list with
avatar/name/email/plan-tag/timestamp rows. No crashes, no invented
components.

**Self-flagged uncertainty (unprompted — no ground rules told it to do
this):**

- `Row`/`Stack gap="2xs"` aren't in the extracted manifest — only `gap`/
  `wrap` are confirmed from usage examples. Explicitly noted that if
  `justify`/`align` (which it used) aren't real props, "they'll be silently
  dropped and the signup rows will left-align instead of spreading."
- Mapped rising churn to `Tag variant="negative"` despite the number going
  up, reasoning the sentiment variants read as good/bad rather than
  directionally — flagged this as an assumption to correct if the
  convention is meant to be directional.

## Test 2 — Metrics dashboard, Freshwater theme (same conversation, turn 2)

**Same prompt, same conversation thread** — not a fresh single-shot
request. Worth weighing as a confound: this run had Test 1's own reasoning
already in context, which is not equivalent to how a cold external tool
would see the same prompt.

Rendered cleanly, correct Freshwater theme (uppercase headings, its
typeface). Notably **self-corrected** relative to Test 1: explicitly said
it was removing the props it had flagged as guesses last time (`Row`
`justify`/`align`, `Stack gap="2xs"`) and switched to plain flex `div`s for
alignment it couldn't verify from the manifest.

**Takeaway on Tests 1–2:** the model's own hedging was accurate — it
correctly identified that `Row`/`Stack`'s prop surface is genuinely thin in
the extracted manifest (a real gap in what `react-docgen` could resolve,
not a made-up caveat) — but the cross-turn self-correction means Test 2
isn't a clean independent data point. For a real sample, each theme/prompt
combination should run in its own fresh conversation (page reload resets
`pearl-playground`'s chat state).

## Test 3 — Shipping address form, South Sea theme, dark mode (fresh single-shot)

Reloaded the app first to guarantee a clean conversation with zero prior
turns in context — this is the clean single-shot data point.

**Prompt:** "Build a shipping address form with fields for name, street
address, city, state, zip code, and a submit button."

Rendered correctly in South Sea dark mode on the first attempt: a
"Checkout / Step 2" card with name/street/city/state/zip fields (state and
zip laid out in an unequal-width row alongside city), a submit + cancel
button pair, and working client-side ZIP-format validation with an inline
field error.

**Self-flagged uncertainty (unprompted):**

- State is a free-text `Input` capped at 2 characters with a placeholder —
  explicitly called out as "a stand-in, not a recommendation," since Pearl
  doesn't expose a Select/Combobox in the manifest, so a real 50-state
  picker isn't buildable from documented components at all.
- Used `maxLength`, `placeholder`, `autoComplete`, `inputMode` on `Input`
  despite none of them appearing in `Input`'s extracted props (only `type`
  is documented) — flagged this explicitly as relying on the common
  "forwards extra props to the underlying `<input>`" pattern, which the
  manifest does not confirm, and said so: "if `Input` filters props, those
  attributes will silently drop — worth checking against the actual
  component source."
- Used a plain flex `div` (not `Row`) for the uneven city/state/zip column
  widths, again citing `Row`'s undocumented prop surface, and separately
  flagged that `space`'s call shape (`space.md` vs. `space('md')`) isn't
  documented here either, so it used raw pixel gaps instead of guessing.

### Full generated code

```tsx
const ShippingAddressForm = () => {
  const [values, setValues] = React.useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [zipError, setZipError] = React.useState('');

  const update = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    if (key === 'zip') setZipError('');
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.zip && !/^\d{5}(-\d{4})?$/.test(values.zip)) {
      setZipError('Enter a 5-digit ZIP, optionally +4.');
      return;
    }
    setZipError('');
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <Stack gap="xs">
              <Text role="preheading" prominence="subtle" as="p">
                Checkout / Step 2
              </Text>
              <Text typeScale="headingSm" as="h2">
                Shipping address
              </Text>
            </Stack>
          </Card.Header>

          <Card.Body>
            <Stack gap="md">
              <Text prominence="subtle" typeScale="bodySm" as="p" measure="md">
                We ship to residential and business addresses in the{' '}
                <Text as="span" role="inlineEmphasis">
                  United States
                </Text>{' '}
                only.
              </Text>

              {submitted ? (
                <Alert
                  variant="positive"
                  heading="Address saved"
                  onDismiss={() => setSubmitted(false)}
                >
                  We'll deliver to {values.name || 'this recipient'} in{' '}
                  {values.city || 'the city listed'}.
                </Alert>
              ) : null}

              <Field label="Full name" required>
                {(props) => (
                  <Input
                    {...props}
                    value={values.name}
                    onChange={update('name')}
                    autoComplete="name"
                  />
                )}
              </Field>

              <Field
                label="Street address"
                required
                hint="Include apartment, suite, or unit number."
              >
                {(props) => (
                  <Input
                    {...props}
                    value={values.street}
                    onChange={update('street')}
                    autoComplete="street-address"
                  />
                )}
              </Field>

              <div
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
              >
                <div style={{ flex: '3 1 0', minWidth: 0 }}>
                  <Field label="City" required>
                    {(props) => (
                      <Input
                        {...props}
                        value={values.city}
                        onChange={update('city')}
                        autoComplete="address-level2"
                      />
                    )}
                  </Field>
                </div>

                <div style={{ flex: '1 1 0', minWidth: 0 }}>
                  <Field label="State" required>
                    {(props) => (
                      <Input
                        {...props}
                        value={values.state}
                        onChange={update('state')}
                        autoComplete="address-level1"
                        maxLength={2}
                        placeholder="CA"
                      />
                    )}
                  </Field>
                </div>

                <div style={{ flex: '2 1 0', minWidth: 0 }}>
                  <Field
                    label="ZIP code"
                    required
                    error={zipError || undefined}
                  >
                    {(props) => (
                      <Input
                        {...props}
                        value={values.zip}
                        onChange={update('zip')}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="94110"
                      />
                    )}
                  </Field>
                </div>
              </div>

              <Row gap="sm">
                <Button type="submit" variant="primary">
                  Save address
                  <Icon icon={PiArrowRight} size={16} />
                </Button>
                <Button variant="secondary">Cancel</Button>
              </Row>
            </Stack>
          </Card.Body>
        </Card>
      </form>
    </div>
  );
};

render(<ShippingAddressForm />);
```

## Overall takeaway

Across all three uncoached runs, zero hallucinated components or props
reached rendered output — every guess the model made (`Row`/`Stack`
alignment props, `Input`'s pass-through attributes, `space`'s call shape)
was an honestly-flagged uncertainty about a genuinely thin extraction
(`react-docgen` returning few or no props for `Row`/`Stack`/`Card`), not an
invention. That thinness is itself a real, useful finding about the
manifest's current coverage, independent of the coaching-removal
experiment: `Row`, `Stack`, and `Card` all show `(no props extracted)` in
`dist/manifest/base.json` today, which is an honest extractor limitation
(a complex/forwarded prop type `react-docgen` can't resolve) rather than
those components truly having no props — worth a follow-up look at
whether `react-docgen`'s config can be pushed to resolve more of them,
since every uncoached test so far spent real effort hedging around this
exact gap.
