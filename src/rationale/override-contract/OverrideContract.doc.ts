import type { StoryDoc } from '@/storydoc/types';

export const overrideContractDoc: StoryDoc = {
  name: 'overrideContract',
  heading: 'Override Contract',
  concept:
    'The stable data-component/data-part/data-variant attributes every component renders are the sanctioned way to extend past a documented variant — never inline styles or internal classes.',
  overview:
    'Every shipped component renders data-component/data-part/data-variant attributes — the seam for styling past what composition or a documented variant already covers. Reach for it before an inline style, an internal class name, or a one-off CSS-variable prop.',
  sections: [
    {
      kind: 'guidelines',
      title: 'The extension mechanism',
      items: [
        {
          level: 'must',
          statement:
            'Target the stable data-component/data-part/data-variant attributes.',
          detail:
            'The intended extension point, not an implementation detail. To style past a documented variant — a destructive action when only primary/secondary exist — target the closest variant from a feature stylesheet: [data-component="button"][data-variant="primary"] { ... }.',
        },
        {
          level: 'must-not',
          statement:
            "Never use inline style={{...}} to change a component's visual treatment.",
          detail:
            "It's invisible to the app and to this system's maintainers — unfindable, unauditable, impossible to promote into a real token later.",
        },
        {
          level: 'must-not',
          statement:
            "Never import the library's internal class tokens or add a bespoke CSS-variable prop per element.",
          detail:
            'Both substitute for targeting data attributes, and both couple consumer code to internals that are free to change.',
        },
        {
          level: 'must-not',
          statement: 'Never hand-type a CSS custom-property name.',
          detail:
            "e.g. var(--color-negative-icon) — vanilla-extract compiles these at build time, undocumented and unstable across builds. A wrong guess doesn't error; it silently fails to apply.",
        },
        {
          level: 'must',
          statement: 'Always reference the real token object as a JS value.',
          detail:
            'color.negative.surface, never a hand-typed custom-property name — its resolved value is guaranteed correct by construction.',
        },
      ],
    },
    {
      kind: 'guidelines',
      title: 'Using an override responsibly',
      items: [
        {
          level: 'must',
          statement: 'Compose shipped components as-is by default.',
          detail:
            "Stack/Row for layout — correct tokens, visuals, and accessibility included, nothing targeting internals. An override is a costed, visible exception: whoever writes one owns keeping it correct as the component's internals move, since the contract only guarantees the data-* names.",
        },
        {
          level: 'must',
          statement: 'Reach for className only for single-instance overrides.',
          detail:
            "When two instances of one component need different tweaks and data attributes can't disambiguate. Use it for layout and spacing, not for reaching into a specific part — prefer data-component/data-part selectors for that.",
        },
      ],
    },
    {
      kind: 'steps',
      items: [
        {
          title:
            'Verify an override is flagged in both places before shipping: a code comment at the site and a plain statement in prose alongside the generated code.',
          description:
            'e.g. "override: no destructive Button variant — styling primary as danger". Unflagged, it\'s lost evidence the variant set is incomplete, not a signal the system can act on.',
        },
        {
          title:
            "Verify a feature override reaches a descendant via globalStyle, not style()'s selectors key.",
          description:
            'style()\'s own selectors (&:hover, `${parent} &`) can only target the class itself, never a nested data-part. Use globalStyle(`${wrapperClass} [data-component="card"] [data-part="header"]`, {...}) instead.',
        },
      ],
    },
    {
      kind: 'note',
      title: 'Why data-attribute targeting is the default',
      body: 'Zero setup cost: attributes are already rendered, no exported style token or className needed. Specificity resolves predictably without @layer: a compound selector always outranks the base single-class style, regardless of build order, as long as base styles stay single-selector. Decoupled from implementation, unlike importing generated class tokens, which breaks silently if internal DOM shifts. Doubles as a QA/automation selector. Category-wide: one rule styles every instance of "a card header" in the feature.',
    },
    {
      kind: 'note',
      title: 'Limit: themes do not nest',
      body: "A theme styles components via globalStyle descendant selectors keyed on its theme class. Nest one theme's subtree inside another theme's page and both selectors match the inner button at identical specificity — CSS breaks the tie by source order, not proximity, so the inner theme can lose. Custom properties (vars.*) nest correctly; globalStyle rules (font family, casing, borders) leak into nested subtrees regardless. Two themes can't render side by side by nesting — only real isolation (separate frames) works.",
    },
    {
      kind: 'note',
      title: 'Explicitly banned',
      body: "Importing the library's internal hashed class tokens couples consumer code to internal refactors — a rename breaks the consumer silently, no compile error. A bespoke custom-property injection prop per sub-element (e.g. Card accepting headerBgVar) is banned the same way — it turns every token into a prop, duplicating what a CSS selector already does. Target stable attribute selectors from the consumer's own stylesheet instead.",
    },
  ],
};
