import { describe, expect, it } from 'vitest';
import { getCatalogDetails, searchCatalog } from './provider';

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

  it('falls back to AniList when Jikan cannot reach MyAnimeList', async () => {
    const fetcher = async (input: string | URL) => {
      const url = String(input);
      if (url.includes('api.jikan.moe')) return new Response(JSON.stringify({ status: 504 }), { status: 504 });
      if (url.includes('graphql.anilist.co')) {
        return json({ data: { Page: { media: [{ id: 21, title: { english: 'One Piece', romaji: 'One Piece' }, coverImage: { large: 'https://cdn.example/one-piece.jpg' } }] } } });
      }
      throw new Error(`Unexpected request: ${url}`);
    };

    await expect(searchCatalog({ type: 'manga', query: 'One Piece' }, { fetcher, openLibraryContact: 'team@example.com' })).resolves.toMatchObject([
      { source: 'anilist', externalId: '21', title: 'One Piece', thumbnailUrl: 'https://cdn.example/one-piece.jpg' },
    ]);
  });

  it('gets AniList details for fallback search results', async () => {
    const fetcher = async (input: string | URL) => {
      expect(String(input)).toContain('graphql.anilist.co');
      return json({ data: { Media: { title: { english: 'One Piece', romaji: 'One Piece' }, coverImage: { large: 'https://cdn.example/one-piece-large.jpg' }, description: 'A pirate<br><br><i>adventure</i> &amp; friendship.' } } });
    };

    await expect(getCatalogDetails({ source: 'anilist', externalId: '21', title: 'One Piece' }, 'manga', { fetcher, openLibraryContact: 'team@example.com' })).resolves.toEqual({
      title: 'One Piece', coverUrl: 'https://cdn.example/one-piece-large.jpg', synopsis: 'A pirate\n\nadventure & friendship.',
    });
  });

  it('normalizes markup from every catalog synopsis provider', async () => {
    const fetcher = async (input: string | URL) => {
      const url = String(input);
      if (url.includes('openlibrary.org')) return json({ title: 'Dune', description: 'A desert<br>epic &amp; prophecy.' });
      if (url.includes('themoviedb.org')) return json({ title: 'Spirited Away', overview: 'A <i>beloved</i> fantasy.' });
      if (url.includes('jikan.moe')) return json({ data: { title: 'Frieren', synopsis: 'An elf<br><br>looks back.' } });
      throw new Error(`Unexpected request: ${url}`);
    };
    const config = { fetcher, openLibraryContact: 'team@example.com', tmdbToken: 'token' };

    await expect(getCatalogDetails({ source: 'open_library', externalId: 'OL1W', title: 'Dune' }, 'book', config)).resolves.toMatchObject({ synopsis: 'A desert\nepic & prophecy.' });
    await expect(getCatalogDetails({ source: 'tmdb', externalId: '3', title: 'Spirited Away' }, 'movie', config)).resolves.toMatchObject({ synopsis: 'A beloved fantasy.' });
    await expect(getCatalogDetails({ source: 'jikan', externalId: '2', title: 'Frieren' }, 'anime', config)).resolves.toMatchObject({ synopsis: 'An elf\n\nlooks back.' });
  });
});
