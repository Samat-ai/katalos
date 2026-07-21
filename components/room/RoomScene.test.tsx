import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { MediaEntry } from '@/lib/media/types';
import { RoomScene } from './RoomScene';

afterEach(cleanup);

function book(id: number, visibility: MediaEntry['visibility'] = 'public'): MediaEntry {
  return { id: `book-${id}`, title: `Book ${id}`, type: 'book', status: 'finished', synopsis: '', visibility };
}

it('renders only the newest twelve entries in a zone', () => {
  render(<RoomScene entries={Array.from({ length: 13 }, (_, index) => book(index + 1))} avatar="girl" owner onSelect={vi.fn()} onZoneOverflow={vi.fn()} />);

  expect(screen.getAllByRole('button', { name: /open book/i })).toHaveLength(12);
  expect(screen.queryByRole('button', { name: /open book 13/i })).not.toBeInTheDocument();
});

it('notifies its owner when a zone has more entries', () => {
  const onZoneOverflow = vi.fn();
  render(<RoomScene entries={Array.from({ length: 13 }, (_, index) => book(index + 1))} avatar="girl" owner onSelect={vi.fn()} onZoneOverflow={onZoneOverflow} />);

  fireEvent.click(screen.getByRole('button', { name: '+1 more' }));

  expect(onZoneOverflow).toHaveBeenCalledWith('reading-shelf');
});

it('does not render private entries in a public scene', () => {
  render(<RoomScene entries={[book(1), book(2, 'private')]} avatar="boy" owner={false} onSelect={vi.fn()} onZoneOverflow={vi.fn()} />);

  expect(screen.getByRole('button', { name: /open book 1/i })).toBeVisible();
  expect(screen.queryByRole('button', { name: /open book 2/i })).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Private')).not.toBeInTheDocument();
});

it('gives each empty zone a directional caption', () => {
  render(<RoomScene entries={[]} avatar="girl" owner={false} onSelect={vi.fn()} onZoneOverflow={vi.fn()} />);

  expect(screen.getByText(/finish a book to fill this shelf/i)).toBeVisible();
  expect(screen.getByText(/pick something up to read here/i)).toBeVisible();
  expect(screen.getByText(/set aside a show or movie here/i)).toBeVisible();
});
