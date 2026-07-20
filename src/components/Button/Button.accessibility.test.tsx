import React from 'react';
import { render } from '@testing-library/react';
import Button from './Button';
import { runAxe } from '../../test/axe';

it('has no detectable accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await runAxe(container);
  expect(results).toHaveNoViolations();
});
