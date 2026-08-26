/**
 * `jest-axe@10` ships no bundled types and there is no `@types/jest-axe` for
 * this major. Declared narrowly here — only the two members `axe.ts` uses —
 * rather than `declare module 'jest-axe'` (which would widen both to `any`).
 */
declare module 'jest-axe' {
  import type { AxeResults, RunOptions } from 'axe-core';

  export function axe(
    html: Element | string,
    options?: RunOptions,
  ): Promise<AxeResults>;

  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): {
      pass: boolean;
      message(): string;
    };
  };
}
