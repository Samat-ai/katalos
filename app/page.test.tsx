import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import Home from './page';

afterEach(cleanup);

it('mounts the literal Katalos landing handoff', () => {
  render(<Home />);
  expect(screen.getByTitle('Katalos landing')).toHaveAttribute('src', '/handoff/landing.dc.html');
});

it('keeps the source document in an accessible named frame', () => {
  render(<Home />);
  expect(screen.getByTitle('Katalos landing')).toBeVisible();
});

it('uses the handoff hero with a separate taste-tangible badge', () => {
  render(<Home />);

  expect(document.querySelector('.landing-hero')).not.toBeNull();
  expect(screen.getByLabelText(/make your taste tangible/i)).toHaveClass('hero-badge');
  expect(screen.getByText(/momo.s room.*live demo/i)).toHaveClass('landing-room-label');
});
