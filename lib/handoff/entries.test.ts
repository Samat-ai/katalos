import { expect, it } from 'vitest';
import { toHandoffShelves } from './entries';

it('places live reading and watching entries into the literal handoff slots', () => {
  const shelves = toHandoffShelves([
    { id: 'book', title: 'Book', type: 'book', status: 'finished', synopsis: '', rating: 4, visibility: 'public' },
    { id: 'anime', title: 'Anime', type: 'anime', status: 'in_progress', synopsis: '', visibility: 'public' },
  ]);

  expect(shelves.shelf1[0]).toMatchObject({ id: 'book', t: 'Book', ty: 'book', st: 'finished' });
  expect(shelves.nowPlaying[0]).toMatchObject({ id: 'anime', t: 'Anime', ty: 'anime', st: 'in progress' });
});
