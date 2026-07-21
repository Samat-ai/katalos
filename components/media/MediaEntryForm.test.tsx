import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { MediaEntryForm } from './MediaEntryForm';

afterEach(cleanup);

it('requires a title before saving an entry', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();

  render(<MediaEntryForm onSave={onSave} />);

  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByText(/title is required/i)).toBeVisible();
  expect(onSave).not.toHaveBeenCalled();
});

it('uses status chips, star buttons, and a public/private toggle without changing its submitted payload', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  render(<MediaEntryForm onSave={onSave} />);

  await user.type(screen.getByLabelText('Title'), 'Dune');
  await user.click(screen.getByRole('button', { name: /finished/i }));
  await user.click(screen.getByRole('button', { name: '4 stars' }));
  await user.click(screen.getByRole('button', { name: /private/i }));
  await user.click(screen.getByRole('button', { name: /save to room/i }));

  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Dune', status: 'finished', rating: '4', visibility: 'private' }));
});

it('focuses the required title and locks saving until an asynchronous save resolves', async () => {
  const user = userEvent.setup();
  let resolveSave: (() => void) | undefined;
  const onSave = vi.fn(() => new Promise<void>((resolve) => { resolveSave = resolve; }));
  render(<MediaEntryForm onSave={onSave} />);

  await user.click(screen.getByRole('button', { name: /save to room/i }));
  expect(screen.getByLabelText('Title')).toHaveFocus();
  await user.type(screen.getByLabelText('Title'), 'Dune');
  await user.click(screen.getByRole('button', { name: /save to room/i }));

  expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  resolveSave?.();
  await waitFor(() => expect(screen.getByRole('button', { name: /save to room/i })).toBeEnabled());
});
