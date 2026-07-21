import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { MediaEntryForm } from './MediaEntryForm';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('requires a title before saving an entry', async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();

  render(<MediaEntryForm onSave={onSave} />);

  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByText(/title is required/i)).toBeVisible();
  expect(onSave).not.toHaveBeenCalled();
});

it('uses readable labeled type tiles instead of text-glyph icons', () => {
  render(<MediaEntryForm onSave={vi.fn()} />);

  expect(screen.getByRole('button', { name: /book/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /manga/i })).toBeVisible();
  expect(screen.queryByText('▤')).not.toBeInTheDocument();
  expect(screen.queryByText('▥')).not.toBeInTheDocument();
});

it('keeps the add-media sequence inside one pixel workbench', () => {
  const { container } = render(<MediaEntryForm onSave={vi.fn()} />);

  expect(container.querySelector('.media-workbench')).not.toBeNull();
  expect(screen.getByText('1 · TYPE')).toBeVisible();
  expect(screen.getByText('4 · SAVE')).toBeVisible();
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

it('keeps the selected catalog result in its USING state until details prefill completes', async () => {
  const user = userEvent.setup();
  let resolveDetails: ((response: Response) => void) | undefined;
  const fetcher = vi.fn((url: string) => url === '/api/catalog/search'
    ? Promise.resolve(new Response(JSON.stringify({ results: [{ source: 'open_library', externalId: 'OL1W', title: 'Dune' }] }), { status: 200 }))
    : new Promise<Response>((resolve) => { resolveDetails = resolve; }));
  vi.stubGlobal('fetch', fetcher);
  render(<MediaEntryForm onSave={vi.fn()} />);

  await user.type(screen.getByLabelText(/search books/i), 'Dune');
  await user.click(screen.getByRole('button', { name: /search catalog/i }));
  await user.click(await screen.findByRole('button', { name: /select dune/i }));

  expect(screen.getByRole('button', { name: 'USING…' })).toBeDisabled();
  resolveDetails?.(new Response(JSON.stringify({ prefill: { title: 'Dune', synopsis: 'Desert epic' } }), { status: 200 }));
  await waitFor(() => expect(screen.getByLabelText('Title')).toHaveValue('Dune'));
});
