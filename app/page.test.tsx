import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import Home from './page';

afterEach(cleanup);

it('introduces Katalos', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /katalos/i })).toBeInTheDocument();
});

it('lets visitors explore a featured room before signing in', () => {
  render(<Home />);
  expect(screen.getAllByRole('region', { name: /reading nook/i }).at(-1)).toBeVisible();
  expect(screen.getAllByRole('button', { name: /spirited away/i }).at(-1)).toBeVisible();
});

it('pairs the demo room with a wall-side sign-in invitation', () => {
  render(<Home />);

  expect(screen.getAllByRole('link', { name: /make your room/i }).at(-1)).toHaveAttribute('href', '/signin');
  expect(screen.getByRole('link', { name: /already have a room/i })).toHaveAttribute('href', '/signin');
});

it('uses the handoff hero with a separate taste-tangible badge', () => {
  render(<Home />);

  expect(document.querySelector('.landing-hero')).not.toBeNull();
  expect(screen.getByLabelText(/make your taste tangible/i)).toHaveClass('hero-badge');
  expect(screen.getByText(/momo.s room.*live demo/i)).toHaveClass('landing-room-label');
});
