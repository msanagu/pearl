import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

export async function runAxe(container: HTMLElement) {
  const { axe } = await import('jest-axe');
  // jest-axe exports `axe` which uses axe-core under the hood
  // run and return the results so tests can assert
  return axe(container);
}
