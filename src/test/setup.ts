// Extends Vitest's `expect` with @testing-library/jest-dom matchers
// (toBeInTheDocument, toHaveAttribute, toHaveAccessibleName, ...).
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// RTL's auto-cleanup only self-registers when `test.globals` is enabled;
// this project uses explicit imports instead, so wire it up manually.
afterEach(() => {
  cleanup();
});
