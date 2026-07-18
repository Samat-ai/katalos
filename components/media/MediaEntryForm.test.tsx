import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MediaEntryForm } from './MediaEntryForm';

it('requires a title before saving an entry', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();

  render(<MediaEntryForm onSave={onSave} />);

  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByText(/title is required/i)).toBeVisible();
  expect(onSave).not.toHaveBeenCalled();
});
