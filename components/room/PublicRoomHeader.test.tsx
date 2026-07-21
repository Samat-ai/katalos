import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { PublicRoomHeader } from './PublicRoomHeader';

afterEach(cleanup);

it('keeps public sharing and the make-your-own path in a compact room header', () => {
  render(<PublicRoomHeader displayName="Momo" username="momo" publicCount={3} />);

  expect(screen.getByRole('heading', { name: "Momo's room" })).toBeVisible();
  expect(screen.getByText('@momo')).toBeVisible();
  expect(screen.getByText('3 THINGS SHARED')).toBeVisible();
  expect(screen.getByRole('button', { name: /copy room link/i })).toBeVisible();
  expect(screen.getByRole('link', { name: /make your own/i })).toHaveAttribute('href', '/signin');
});
