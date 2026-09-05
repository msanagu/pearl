import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '../../templates/Form/Form';

/**
 * Patterns → Forms: how label/control/error, section grouping, and
 * submit-time validation fit together across the form primitives. Not a new
 * component — a composition contract over Field, Input, Alert, Card. The
 * rendered story is the Templates/Form example; the guidance an agent reads
 * is in `parameters.manifest` below.
 */
function FormsPattern() {
  return <Form />;
}

const meta: Meta<typeof FormsPattern> = {
  title: 'Patterns/Forms',
  component: FormsPattern,
  parameters: {
    manifest: {
      name: 'forms',
      description:
        'The composition contract for a form: every control wrapped by Field for label/hint/error coordination, sections grouped in Card, and validation surfaced both inline and as a page-level summary.',
      related: [
        { rel: 'composes', to: 'component.Field' },
        { rel: 'composes', to: 'component.Input' },
        { rel: 'composes', to: 'component.Button' },
        { rel: 'composes', to: 'component.Card' },
        { rel: 'composes', to: 'component.Alert' },
        { rel: 'relates-to', to: 'foundation.space' },
        { rel: 'relates-to', to: 'foundation.radius' },
      ],
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          id: 'layout',
          title: 'Layout',
          items: [
            {
              level: 'must',
              statement:
                'Group related fields in a Card with a Card.Header heading (h2). Stack fields inside a section at gap="lg"; stack sections at gap="xl" — the ratio is what reads as grouping, not a rule or box.',
            },
            {
              level: 'must',
              statement:
                'Put the submit row last, outside every Card, justified end, separated by a border-top + paddingTop of a scale token (space.lg). Primary action rightmost; a secondary Reset/Cancel to its left is type="button", never type="submit".',
            },
            {
              level: 'should',
              statement:
                'Side-by-side fields (city + postal code) go in a Row gap="lg" wrap, each field in a flex child with its own flex-basis — never a fixed width, so they collapse to one column on a narrow container.',
            },
            {
              level: 'must',
              statement:
                'Controls sharing a row — an Input beside a Button, or two Inputs — render at the same height automatically: Input and Button are both controlHeight.md. Never set height or vertical padding on a control to adjust a row; a theme needing denser controls moves controlHeight.',
            },
            {
              level: 'must',
              statement:
                "Size each field's flex-basis to its content — wide enough that the longest placeholder or expected value shows without clipping. Input is width: 100% of its field, so a too-narrow field clips the placeholder; don't set a narrow fixed width for visual balance.",
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          id: 'form-controls',
          title: 'Form controls',
          items: [
            {
              level: 'must',
              statement:
                'Wrap every control in Field — it owns the label, the shared id, aria-describedby, aria-invalid, and (when required) required/aria-required, handed to the control via the children render-prop. Never author a bare <label> or wire aria-describedby by hand.',
            },
            {
              level: 'must',
              statement:
                'Input is the only control that exists today. No Select, Checkbox, Radio, or Textarea — use a native element wrapped in Field if one is unavoidable, and flag that the system is missing it rather than styling a substitute.',
            },
            {
              level: 'must-not',
              statement:
                'Do not set a corner radius on a control inside a form. The control sits at radius.control; the Card around it derives its own radius concentrically from its padding (see foundation.radius). Authoring either one breaks the nesting.',
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          id: 'validation',
          title: 'Validation and errors',
          items: [
            {
              level: 'must',
              statement:
                'Validate at submit, not on every keystroke. The form carries noValidate; run your own validate() on submit, set per-field errors and a status together.',
            },
            {
              level: 'must',
              statement:
                'Surface a failure twice: the field\'s own Field error prop (renders role="alert" inline) and a page-level Alert variant="negative" above the form counting how many fields need attention. On success, swap the summary for an Alert variant="positive".',
            },
            {
              level: 'must',
              statement:
                'Write the error message as the action to take ("Enter a valid email address."), not a diagnosis ("Email is invalid."). Hints (Field hint) describe the expected format up front; errors repeat it only after a failure.',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Why the summary and the inline error both',
          body: "The inline Field error is where the fix happens; the page-level Alert is how someone who submitted a long form knows anything failed without scrolling. The count in the summary and the number of inline errors are derived from the same errors object in one render — they can't disagree. The summary is not a list of links today; it points down, the inline errors carry the specifics.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormsPattern>;

export const Default: Story = {};
