# Playground test run — 2026-08-30

**What was tested:** whether the manifest (`manifest.json`) and `llms.txt`
shipped in the installed `@msanagu/pearl` package accurately guide an LLM
client (Claude, via `pearl-playground`'s in-browser assistant) toward correct
design-system code generation, without hallucinating components, props, or
rules.

**Setup:** `pearl-playground` running locally, Pearl theme active, single
prompt to the assistant:

> Design and build a full account settings page: a profile section with
> name/email fields and a save button, a notifications section with a couple
> of toggleable-style options, a danger zone for deleting the account, and a
> status alert at the top confirming the last save succeeded. Use real Pearl
> components throughout.

## Result: manifest guidance held up

The assistant generated a single-render TSX component that rendered live
with zero console errors, using `Card`/`Stack`/`Row`/`Text`/`Field`/`Input`/
`Button`/`Alert`/`Tag` — all real exports. Interactive elements (notification
toggle buttons, the two-step delete confirmation) worked correctly when
clicked in the rendered preview.

### What it got right

1. **No invented components.** There is no `Switch`/`Toggle`/`Checkbox` in
   the manifest. Rather than hallucinating one, the assistant's own reasoning
   trace noted the gap and composed a toggle from a `Tag` (state) + `Button`
   (action) pair — a real, verifiable substitute.

2. **No invented prop values.** `Button.variant`'s extracted type is the
   unresolved union `ButtonVariants['variant']`, and the manifest's
   description only documents `primary`/`secondary`. The assistant declined
   to guess a `danger`/`destructive` variant might exist and instead carried
   the danger-zone's meaning through `Alert variant="negative"` + copy + a
   two-step confirm — the correct move when an extraction is honestly thin
   rather than complete.

3. **Correct role/treatment citations.** Every role name the assistant used
   in its design notes (`preheading` → `sansSentence`, `dataDigits` →
   `monoTabular`, `cardHover`/`secondaryHover` → `luster`) matches
   `manifest.json` exactly — none were fabricated.

4. **A non-obvious written rule was followed, not just recited.** The
   assistant quoted hairlineRule's guidance almost verbatim — "never more
   than one lustered surface in view at rest" — and the generated page
   respects it: no ambient luster was added anywhere, only the theme's
   existing hover-triggered treatments.

5. **Sandbox contract followed exactly:** one `tsx` block, no imports, one
   `render()` call, no undeclared identifiers.

### Weak spot / caveat

The test didn't produce a negative case — a role that _should_ have applied
but didn't, or a case where thin manifest data caused a visibly wrong
answer instead of an honest "I don't know." Everything the assistant
asserted was checkable against `manifest.json`, and it checked out, but this
single prompt didn't stress the manifest's gaps (e.g. what happens when a
component's prop table is fully empty, not just a partially-unresolved
union).

## Full generated code

```tsx
const AccountSettings = () => {
  const [name, setName] = React.useState('Mika Sanagu');
  const [email, setEmail] = React.useState('mika@example.com');
  const [savedVisible, setSavedVisible] = React.useState(true);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    product: true,
    digest: false,
  });

  const toggle = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const NotificationOption = ({ id, label, description }) => {
    const on = notifications[id];
    return (
      <Row
        gap="md"
        style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Stack gap="xs" style={{ maxWidth: 360 }}>
          <Text typeScale="bodyMd" weight="medium" as="span">
            {label}
          </Text>
          <Text typeScale="bodySm" prominence="subtle" as="span">
            {description}
          </Text>
        </Stack>
        <Row gap="sm" style={{ alignItems: 'center', flexShrink: 0 }}>
          <Tag variant={on ? 'positive' : 'neutral'}>{on ? 'On' : 'Off'}</Tag>
          <Button
            variant="secondary"
            onClick={() => toggle(id)}
            aria-pressed={on}
          >
            <Icon icon={on ? PiX : PiCheck} size={16} />
            {on ? 'Turn off' : 'Turn on'}
          </Button>
        </Row>
      </Row>
    );
  };

  return (
    <Stack gap="2xl" style={{ maxWidth: 640 }}>
      {savedVisible && (
        <Alert
          variant="positive"
          heading="Changes saved"
          onDismiss={() => setSavedVisible(false)}
        >
          Your account settings were updated a moment ago.
        </Alert>
      )}

      <Stack gap="xs">
        <Text role="preheading" prominence="subtle" as="p">
          Account
        </Text>
        <Text typeScale="headingMd" as="h1">
          Settings
        </Text>
      </Stack>

      <Card>
        <Card.Header>
          <Row gap="sm" style={{ alignItems: 'center' }}>
            <Icon icon={PiUser} size={20} />
            <Text typeScale="headingSm" as="h2">
              Profile
            </Text>
          </Row>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <Field
              label="Full name"
              required
              hint="Shown on your public profile."
            >
              {(props) => (
                <Input
                  {...props}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
            </Field>

            <Field
              label="Email address"
              required
              hint="Used for sign-in and account notices."
            >
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>

            <Row gap="sm" style={{ alignItems: 'center' }}>
              <Button onClick={() => setSavedVisible(true)}>
                Save changes
              </Button>
              <Text typeScale="bodySm" prominence="subtle" as="span">
                Last saved 2 minutes ago
              </Text>
            </Row>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2">
            Notifications
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <NotificationOption
              id="product"
              label="Product updates"
              description="New features, changes to existing behaviour, and release notes."
            />
            <NotificationOption
              id="digest"
              label="Weekly digest"
              description="A single summary email each Monday instead of per-event mail."
            />
            <Text typeScale="bodySm" prominence="subtle" as="p" measure="md">
              Security and billing notices are always sent and can't be turned
              off. <Link href="#">Read the notification policy</Link>.
            </Text>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Row gap="sm" style={{ alignItems: 'center' }}>
            <Text typeScale="headingSm" as="h2">
              Danger zone
            </Text>
            <Tag variant="warn">Irreversible</Tag>
          </Row>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <Alert
              variant="negative"
              heading="Deleting your account is permanent"
            >
              Your profile, saved settings, and all associated data are removed
              immediately. This cannot be undone.
            </Alert>

            {confirmingDelete ? (
              <Stack gap="sm">
                <Text typeScale="bodySm" as="p" measure="md">
                  Confirm you want to delete the account for{' '}
                  <Text as="span" role="dataDigits">
                    {email}
                  </Text>
                  .
                </Text>
                <Row gap="sm">
                  <Button onClick={() => setConfirmingDelete(false)}>
                    Keep my account
                  </Button>
                  <Button variant="secondary">
                    <Icon icon={PiWarningCircle} size={16} />
                    Yes, delete permanently
                  </Button>
                </Row>
              </Stack>
            ) : (
              <Row gap="sm">
                <Button
                  variant="secondary"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete account
                </Button>
              </Row>
            )}
          </Stack>
        </Card.Body>
      </Card>
    </Stack>
  );
};

render(<AccountSettings />);
```

## Takeaway

For this prompt, manifest + `llms.txt` fully prevented hallucinated APIs and
correctly transmitted at least one specific, non-obvious design constraint
(single-luster-at-rest) into working, constraint-respecting generated code.
Worth repeating with prompts specifically designed to hit thin/empty prop
extractions and cross-theme requests, to see whether the "say what you don't
know" behavior holds under more adversarial conditions.
