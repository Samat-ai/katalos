import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { OwnerRoomClient } from './OwnerRoomClient';

afterEach(cleanup);

it('opens the first-add flow for a new room', () => {
  render(<OwnerRoomClient initialEntries={[]} username="katalos" />);
  expect(screen.getByRole('heading', { name: /add media/i })).toBeVisible();
  expect(screen.getByText(/room is ready for its first story/i)).toBeVisible();
});

it('filters the manage list when a scene zone overflows', () => {
  const initialEntries = Array.from({ length: 13 }, (_, index) => ({ id: `book-${index}`, title: `Book ${index + 1}`, type: 'book' as const, status: 'finished' as const, synopsis: '', visibility: 'public' as const }));
  initialEntries.push({ id: 'movie', title: 'Movie', type: 'movie', status: 'planned', synopsis: '', visibility: 'public' });
  render(<OwnerRoomClient initialEntries={initialEntries} username="katalos" />);

  fireEvent.click(screen.getByRole('button', { name: '+1 more' }));

  expect(screen.getByRole('heading', { name: /manage media.*reading shelf/i })).toBeVisible();
  expect(screen.queryByText('Movie')).not.toBeInTheDocument();
});
