import { describe, expect, it } from 'vitest';
import { getRoomZone } from './placement';

describe('getRoomZone', () => {
  it.each([
    ['book', 'finished', 'reading-shelf'],
    ['book', 'planned', 'reading-nearby'],
    ['manga', 'abandoned', 'reading-abandoned-pile'],
    ['manga', 'in_progress', 'reading-nearby'],
    ['anime', 'finished', 'tv-cabinet'],
    ['anime', 'in_progress', 'tv-player'],
    ['movie', 'planned', 'tv-planned-stack'],
    ['movie', 'abandoned', 'tv-abandoned-pile'],
  ] as const)('places %s with %s in %s', (type, status, expected) => {
    expect(getRoomZone({ type, status })).toBe(expected);
  });
});
