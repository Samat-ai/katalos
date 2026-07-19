import { expect, it } from 'vitest';
import { MediaEntryInputSchema } from './schema';

it('accepts a complete public media entry', () => {
  expect(MediaEntryInputSchema.parse({
    title: 'A film', type: 'movie', status: 'finished', coverUrl: '', synopsis: '', rating: '', note: '', visibility: 'public',
  }).title).toBe('A film');
});

it('rejects ratings outside the supported five-star scale', () => {
  expect(() => MediaEntryInputSchema.parse({
    title: 'A film', type: 'movie', status: 'finished', coverUrl: '', synopsis: '', rating: '6', note: '', visibility: 'public',
  })).toThrow(/rating/i);
});
