import { expect, it } from 'vitest';
import { publicEntriesForProfiler, publicEntryForProfiler, toMediaEntry } from './serialization';

const row = {
  id: 'entry-1',
  title: '  A Quiet Story  ',
  type: 'book' as const,
  status: 'finished' as const,
  cover_url: null,
  synopsis: 'A calm tale.',
  rating: 5,
  note: 'Do not send this private note to the profiler.',
  visibility: 'public' as const,
};

it('maps a Supabase row into the application media shape', () => {
  expect(toMediaEntry(row)).toMatchObject({ id: 'entry-1', title: '  A Quiet Story  ', visibility: 'public' });
});

it('sends only bounded public fields to the profiler', () => {
  expect(publicEntryForProfiler(row)).toEqual({
    title: 'A Quiet Story',
    type: 'book',
    status: 'finished',
    synopsis: 'A calm tale.',
    rating: 5,
  });
});

it('excludes private entries before preparing profiler input', () => {
  expect(publicEntriesForProfiler([row, { ...row, id: 'entry-2', visibility: 'private' }])).toHaveLength(1);
});
