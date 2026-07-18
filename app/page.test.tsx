import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from './page';

it('introduces Katalos', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /katalos/i })).toBeInTheDocument();
});
