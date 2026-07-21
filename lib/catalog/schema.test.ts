import { describe, expect, it } from 'vitest';
import { CatalogSearchRequestSchema, normalizeCatalogCandidate } from './schema';

describe('CatalogSearchRequestSchema', () => {
  it('accepts a typed search query and normalizes its whitespace', () => {
    expect(CatalogSearchRequestSchema.parse({ type: 'book', query: '  Dune  ' })).toEqual({ type: 'book', query: 'Dune' });
  });

  it('rejects a query shorter than three characters', () => {
    expect(CatalogSearchRequestSchema.safeParse({ type: 'movie', query: 'Up' }).success).toBe(false);
  });
});

describe('normalizeCatalogCandidate', () => {
  it('keeps only safe browser fields from an Open Library result', () => {
    expect(normalizeCatalogCandidate('open_library', {
      key: '/works/OL123W',
      title: 'Dune',
      author_name: ['Frank Herbert'],
      cover_i: 12345,
      unexpected: 'never expose this',
    })).toEqual({
      source: 'open_library',
      externalId: 'OL123W',
      title: 'Dune',
      subtitle: 'Frank Herbert',
      thumbnailUrl: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
    });
  });
});
