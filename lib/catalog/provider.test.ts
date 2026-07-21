import { describe, expect, it } from 'vitest';
import { searchCatalog } from './provider';

const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

describe('searchCatalog', () => {
  it('normalizes results from each media provider', async () => {
    const fetcher = async (input: string | URL) => {
      const url = String(input);
      if (url.includes('openlibrary')) return json({ docs: [{ key: '/works/OL1W', title: 'Dune', author_name: ['Frank Herbert'], cover_i: 1 }] });
      if (url.includes('jikan')) return json({ data: [{ mal_id: 2, title: 'Frieren', title_english: 'Frieren', images: { jpg: { image_url: 'https://cdn.example/frieren.jpg' } }, synopsis: 'An elf looks back.' }] });
      return json({ results: [{ id: 3, title: 'Spirited Away', poster_path: '/spirited.jpg', overview: 'A beloved fantasy.' }] });
    };

    await expect(searchCatalog({ type: 'book', query: 'Dune' }, { fetcher, openLibraryContact: 'team@example.com' })).resolves.toMatchObject([{ source: 'open_library', externalId: 'OL1W', title: 'Dune' }]);
    await expect(searchCatalog({ type: 'anime', query: 'Frieren' }, { fetcher, openLibraryContact: 'team@example.com' })).resolves.toMatchObject([{ source: 'jikan', externalId: '2', title: 'Frieren' }]);
    await expect(searchCatalog({ type: 'movie', query: 'Spirited Away' }, { fetcher, tmdbToken: 'token', openLibraryContact: 'team@example.com' })).resolves.toMatchObject([{ source: 'tmdb', externalId: '3', title: 'Spirited Away' }]);
  });

  it('requires a server-side TMDB token for movie searches', async () => {
    await expect(searchCatalog({ type: 'movie', query: 'Dune' }, { fetcher: fetch, openLibraryContact: 'team@example.com' })).rejects.toThrow(/TMDB/);
  });
});
