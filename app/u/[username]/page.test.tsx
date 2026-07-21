import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));

import PublicProfilePage from './page';

const profile = { id: 'profile-1', username: 'momo', display_name: 'Momo', avatar: 'girl' };
const entries = [
  { id: 'book-1', title: 'Book One', type: 'book', status: 'finished', cover_url: null, synopsis: '', rating: null, note: null, visibility: 'public' },
  { id: 'book-2', title: 'Book Two', type: 'book', status: 'planned', cover_url: null, synopsis: '', rating: null, note: null, visibility: 'public' },
  { id: 'movie-1', title: 'Movie One', type: 'movie', status: 'finished', cover_url: null, synopsis: '', rating: null, note: null, visibility: 'public' },
];

function mockPublicPage(publicEntries = entries) {
  const profileQuery = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data: profile }),
  };
  profileQuery.select.mockReturnValue(profileQuery);
  profileQuery.eq.mockReturnValue(profileQuery);
  const entryQuery = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn().mockResolvedValue({ data: publicEntries }),
  };
  entryQuery.select.mockReturnValue(entryQuery);
  entryQuery.eq.mockReturnValue(entryQuery);
  mocks.createClient.mockResolvedValue({ from: vi.fn((table: string) => table === 'profiles' ? profileQuery : entryQuery) });
}

beforeEach(() => {
  mocks.createClient.mockReset();
  mocks.notFound.mockReset();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('uses privacy-safe copy for a room with no public entries', async () => {
  mockPublicPage([]);
  render(await PublicProfilePage({ params: Promise.resolve({ username: 'momo' }) }));

  expect(screen.getByRole('heading', { name: 'THE PUBLIC SHELVES ARE EMPTY' })).toBeVisible();
  expect(screen.getByText("Momo hasn't shared any media here yet.")).toBeVisible();
  expect(screen.queryByText(/private/i)).not.toBeInTheDocument();
});

it('keeps the public MediaRoom rendered when profiler generation fails and can retry', async () => {
  const user = userEvent.setup();
  mockPublicPage();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'The profiler is taking a tea break. Please retry.' }), { status: 502 })));
  render(await PublicProfilePage({ params: Promise.resolve({ username: 'momo' }) }));

  await user.click(screen.getByRole('button', { name: "READ MOMO'S TASTE" }));

  expect(await screen.findByRole('alert')).toHaveTextContent('The profiler is taking a tea break. Please retry.');
  expect(screen.getByRole('button', { name: 'TRY AGAIN' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Reading nook' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Open Book One' })).toBeVisible();
});
