import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { CatalogSearchPicker } from './CatalogSearchPicker';

afterEach(cleanup);

it('shows catalog results for the selected media type', async () => {
  const user = userEvent.setup();
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [{ source: 'open_library', externalId: 'OL1W', title: 'Dune', subtitle: 'Frank Herbert' }] }), { status: 200 }));
  render(<CatalogSearchPicker type="book" onSelect={vi.fn()} fetcher={fetcher} />);

  await user.type(screen.getByLabelText(/search books/i), 'Dune');
  await user.click(screen.getByRole('button', { name: /search catalog/i }));

  expect(await screen.findByRole('button', { name: /select dune/i })).toBeVisible();
  expect(fetcher).toHaveBeenCalledWith('/api/catalog/search', expect.objectContaining({ method: 'POST' }));
});

it('keeps the query editable while showing its search state', async () => {
  const user = userEvent.setup();
  const fetcher = vi.fn(() => new Promise<Response>(() => {}));
  render(<CatalogSearchPicker type="movie" onSelect={vi.fn()} fetcher={fetcher} />);

  await user.type(screen.getByLabelText(/search movies/i), 'Dune');
  await user.click(screen.getByRole('button', { name: /search catalog/i }));

  expect(screen.getByRole('status')).toHaveTextContent(/searching/i);
  expect(screen.getByLabelText(/search movies/i)).not.toBeDisabled();
});
