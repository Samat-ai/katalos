import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { demoEntries } from '@/lib/media/demo-data';
import { MediaRoom } from './MediaRoom';

afterEach(cleanup);

it('opens a selected media entry in the detail drawer', async () => {
  const user = userEvent.setup();

  render(<MediaRoom entries={demoEntries} readOnly />);

  await user.click(screen.getByRole('button', { name: /spirited away/i }));

  expect(screen.getByText(/a beloved fantasy/i)).toBeVisible();
});

it('exposes labeled reading and TV regions with selectable media covers', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);

  expect(screen.getByRole('region', { name: /reading nook/i })).toBeVisible();
  expect(screen.getByRole('region', { name: /tv nook/i })).toBeVisible();
  expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  expect(screen.getByRole('region', { name: /reading nook/i }).closest('.knookwrap')).not.toBeNull();
});

it('shows a themed title tooltip instead of relying on a browser title tooltip', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);
  fireEvent.mouseEnter(screen.getByRole('button', { name: /spirited away/i }));

  expect(screen.getByRole('tooltip')).toHaveTextContent(/spirited away.*movie/i);
});
