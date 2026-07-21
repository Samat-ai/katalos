import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { SiteNav } from './SiteNav';

afterEach(cleanup);

it('keeps the handoff header logo, room theme selector, and action', () => {
  render(<SiteNav actionHref="/signin" actionLabel="MAKE YOUR ROOM" />);

  expect(screen.getByRole('link', { name: 'KATALOS' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('group', { name: /room theme/i })).toBeVisible();
  expect(screen.getByRole('link', { name: 'MAKE YOUR ROOM' })).toHaveAttribute('href', '/signin');
});
