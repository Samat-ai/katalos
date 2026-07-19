import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from './page';

it('introduces Katalos', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /katalos/i })).toBeInTheDocument();
});

it('lets visitors explore a featured room before signing in', () => {
  render(<Home />);
  expect(screen.getAllByRole('region', { name: /reading nook/i }).at(-1)).toBeVisible();
  expect(screen.getAllByRole('button', { name: /spirited away/i }).at(-1)).toBeVisible();
});
