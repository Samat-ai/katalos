import { describe, expect, it } from 'vitest';
import { getRoomZone } from './placement';

describe('getRoomZone', () => {
  it.each([
    ['book', 'finished', 'reading-shelf'],
    ['manga', 'abandoned', 'reading-abandoned-pile'],
    ['anime', 'in_progress', 'tv-player'],
    ['movie', 'planned', 'tv-planned-stack'],
  ] as const)('places %s with %s in %s', (type, status, expected) => {
    expect(getRoomZone({ type, status })).toBe(expected);
  });
});
