import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import type { MediaEntry } from '@/lib/media/types';

vi.mock('@/components/handoff/HandoffFrame', () => ({
  HandoffFrame: ({ onEntryOpen, onMakeRoom }: { onEntryOpen?: (entryId: string) => void; onMakeRoom?: () => void }) => <><button type="button" onClick={() => onEntryOpen?.('book')}>OPEN SCENE ENTRY</button><button type="button" onClick={onMakeRoom}>MAKE SCENE ADD</button></>,
}));

import { OwnerRoomClient } from './OwnerRoomClient';

afterEach(cleanup);

it('opens the first-add flow for a new room', () => {
  render(<OwnerRoomClient initialEntries={[]} username="katalos" />);
  expect(screen.getByRole('heading', { name: /add media/i })).toBeVisible();
  expect(screen.getByText(/room is ready for its first story/i)).toBeVisible();
});

it('opens the add form from the initial add query state even when the room has entries', () => {
  render(<OwnerRoomClient initialEntries={[{ id: 'book', title: 'Book', type: 'book', status: 'finished', synopsis: '', visibility: 'public' }]} username="katalos" initialAdd />);
  expect(screen.getByRole('heading', { name: /add media/i })).toBeVisible();
});

it('opens the live edit form when a scene entry is selected', async () => {
  const user = userEvent.setup();
  render(<OwnerRoomClient initialEntries={[{ id: 'book', title: 'Book', type: 'book', status: 'finished', synopsis: '', visibility: 'public' }]} username="katalos" />);

  await user.click(screen.getByRole('button', { name: 'OPEN SCENE ENTRY' }));

  expect(screen.getByRole('heading', { name: 'EDIT MEDIA' })).toBeVisible();
  expect(screen.getByLabelText('Title')).toHaveValue('Book');
});

it('opens the live add form from the handoff make control', async () => {
  const user = userEvent.setup();
  render(<OwnerRoomClient initialEntries={[{ id: 'book', title: 'Book', type: 'book', status: 'finished', synopsis: '', visibility: 'public' }]} username="katalos" />);

  await user.click(screen.getByRole('button', { name: 'MAKE SCENE ADD' }));

  expect(screen.getByRole('heading', { name: 'ADD MEDIA' })).toBeVisible();
});

it('filters by a selected status chip and shows private entries with a private badge', async () => {
  const user = userEvent.setup();
  const initialEntries: MediaEntry[] = [
    { id: 'planned', title: 'Planned', type: 'book', status: 'planned', synopsis: '', visibility: 'public' },
    { id: 'private', title: 'Private', type: 'movie', status: 'finished', synopsis: '', visibility: 'private' },
  ];
  render(<OwnerRoomClient initialEntries={initialEntries} username="katalos" />);

  const media = screen.getByRole('region', { name: 'Your media' });
  await user.click(within(media).getByRole('button', { name: /^planned$/i }));
  expect(within(media).getByText('Planned')).toBeVisible();
  expect(within(media).queryByText('Private')).not.toBeInTheDocument();
  await user.click(within(media).getByRole('button', { name: /all media/i }));
  expect(within(media).getByText('Planned')).toBeVisible();
  expect(within(media).getByLabelText('Private')).toBeVisible();
});

it('copies the public link using the runtime canonical origin', async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<OwnerRoomClient initialEntries={[]} username="katalos" />);

  await user.click(screen.getByRole('button', { name: /copy public link/i }));
  expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/u/katalos`);
});

it('filters the manage list when a scene zone overflows', () => {
  const initialEntries: MediaEntry[] = Array.from({ length: 13 }, (_, index) => ({ id: `book-${index}`, title: `Book ${index + 1}`, type: 'book' as const, status: 'finished' as const, synopsis: '', visibility: 'public' as const }));
  initialEntries.push({ id: 'movie', title: 'Movie', type: 'movie', status: 'planned', synopsis: '', visibility: 'public' });
  render(<OwnerRoomClient initialEntries={initialEntries} username="katalos" />);

  fireEvent.click(screen.getByRole('button', { name: '+1 more' }));

  expect(screen.getByRole('heading', { name: /manage media.*reading shelf/i })).toBeVisible();
  expect(screen.queryByText('Movie')).not.toBeInTheDocument();
});
