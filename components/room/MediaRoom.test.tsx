import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { demoEntries } from '@/lib/media/demo-data';
import { MediaRoom } from './MediaRoom';

it('opens a selected media entry in the detail drawer', async () => {
  const user = userEvent.setup();

  render(<MediaRoom entries={demoEntries} readOnly />);

  await user.click(screen.getByRole('button', { name: /spirited away/i }));

  expect(screen.getByText(/a beloved fantasy/i)).toBeVisible();
});
