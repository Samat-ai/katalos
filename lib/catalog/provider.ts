import type { CatalogCandidate, CatalogSearchRequest } from './schema';
import type { MediaType } from '@/lib/media/types';
import { CatalogCandidateSchema } from './schema';
import type { CatalogPrefill } from './schema';

export type CatalogProviderConfig = {
  fetcher?: typeof fetch;
  openLibraryContact: string;
  tmdbToken?: string;
};

function candidate(value: unknown): CatalogCandidate | null {
  const parsed = CatalogCandidateSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

async function readJson(response: Response) {
  if (!response.ok) throw new Error(`Catalog provider request failed (${response.status}).`);
  return response.json() as Promise<unknown>;
}

type AniListMedia = {
  id?: number;
  title?: { english?: string; romaji?: string; native?: string };
  coverImage?: { large?: string; medium?: string };
  description?: string;
};

const aniListEndpoint = 'https://graphql.anilist.co';

async function aniListRequest<T>(fetcher: typeof fetch, query: string, variables: Record<string, unknown>): Promise<T> {
  return readJson(await fetcher(aniListEndpoint, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })) as Promise<T>;
}

function aniListTitle(media: AniListMedia) {
  return media.title?.english ?? media.title?.romaji ?? media.title?.native;
}

async function searchAniList(request: CatalogSearchRequest, fetcher: typeof fetch): Promise<CatalogCandidate[]> {
  const body = await aniListRequest<{ data?: { Page?: { media?: AniListMedia[] } } }>(fetcher, `query SearchCatalog($search: String!, $type: MediaType!) {
    Page(page: 1, perPage: 8) { media(search: $search, type: $type) { id title { english romaji native } coverImage { large medium } } }
  }`, { search: request.query, type: request.type.toUpperCase() });
  return (body.data?.Page?.media ?? []).map((item) => candidate({
    source: 'anilist', externalId: item.id?.toString(), title: aniListTitle(item), thumbnailUrl: item.coverImage?.large ?? item.coverImage?.medium,
  })).filter((item): item is CatalogCandidate => item !== null);
}

export async function searchCatalog(request: CatalogSearchRequest, config: CatalogProviderConfig): Promise<CatalogCandidate[]> {
  const fetcher = config.fetcher ?? fetch;
  if (request.type === 'book') {
    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.set('q', request.query); url.searchParams.set('limit', '8');
    const body = await readJson(await fetcher(url, { headers: { 'user-agent': `Katalos (${config.openLibraryContact})` } })) as { docs?: Array<{ key?: string; title?: string; author_name?: string[]; cover_i?: number }> };
    return (body.docs ?? []).map((item) => candidate({ source: 'open_library', externalId: item.key?.split('/').filter(Boolean).pop(), title: item.title, subtitle: item.author_name?.[0], thumbnailUrl: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : undefined })).filter((item): item is CatalogCandidate => item !== null);
  }
  if (request.type === 'movie') {
    if (!config.tmdbToken) throw new Error('TMDB is not configured. Set TMDB_READ_ACCESS_TOKEN.');
    const url = new URL('https://api.themoviedb.org/3/search/movie'); url.searchParams.set('query', request.query); url.searchParams.set('page', '1');
    const body = await readJson(await fetcher(url, { headers: { authorization: `Bearer ${config.tmdbToken}` } })) as { results?: Array<{ id?: number; title?: string; release_date?: string; poster_path?: string; overview?: string }> };
    return (body.results ?? []).slice(0, 8).map((item) => candidate({ source: 'tmdb', externalId: item.id?.toString(), title: item.title, subtitle: item.release_date?.slice(0, 4), thumbnailUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : undefined })).filter((item): item is CatalogCandidate => item !== null);
  }
  try {
    const url = new URL(`https://api.jikan.moe/v4/${request.type}`); url.searchParams.set('q', request.query); url.searchParams.set('limit', '8');
    const body = await readJson(await fetcher(url)) as {
      data?: Array<{ mal_id?: number; title?: string; title_english?: string; images?: { jpg?: { image_url?: string } } }>;
    };
    return (body.data ?? []).map((item) => candidate({ source: 'jikan', externalId: item.mal_id?.toString(), title: item.title_english ?? item.title, thumbnailUrl: item.images?.jpg?.image_url })).filter((item): item is CatalogCandidate => item !== null);
  } catch {
    return searchAniList(request, fetcher);
  }
}

export async function getCatalogDetails(candidate: CatalogCandidate, type: MediaType, config: CatalogProviderConfig): Promise<CatalogPrefill> {
  const fetcher = config.fetcher ?? fetch;
  if (candidate.source === 'open_library') {
    const body = await readJson(await fetcher(`https://openlibrary.org/works/${candidate.externalId}.json`, { headers: { 'user-agent': `Katalos (${config.openLibraryContact})` } })) as { title?: string; description?: string | { value?: string } };
    const synopsis = typeof body.description === 'string' ? body.description : body.description?.value ?? '';
    return { title: body.title ?? candidate.title, coverUrl: candidate.thumbnailUrl, synopsis };
  }
  if (candidate.source === 'tmdb') {
    if (!config.tmdbToken) throw new Error('TMDB is not configured. Set TMDB_READ_ACCESS_TOKEN.');
    const body = await readJson(await fetcher(`https://api.themoviedb.org/3/movie/${candidate.externalId}`, { headers: { authorization: `Bearer ${config.tmdbToken}` } })) as { title?: string; overview?: string; poster_path?: string };
    return { title: body.title ?? candidate.title, coverUrl: body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : candidate.thumbnailUrl, synopsis: body.overview ?? '' };
  }
  if (candidate.source === 'anilist') {
    const id = Number(candidate.externalId);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid AniList media id.');
    const body = await aniListRequest<{ data?: { Media?: AniListMedia } }>(fetcher, `query CatalogDetails($id: Int!, $type: MediaType!) {
      Media(id: $id, type: $type) { title { english romaji native } coverImage { large medium } description(asHtml: false) }
    }`, { id, type: type.toUpperCase() });
    const media = body.data?.Media;
    return { title: media ? aniListTitle(media) ?? candidate.title : candidate.title, coverUrl: media?.coverImage?.large ?? media?.coverImage?.medium ?? candidate.thumbnailUrl, synopsis: media?.description ?? '' };
  }
  const kind = type === 'manga' ? 'manga' : 'anime';
  const body = await readJson(await fetcher(`https://api.jikan.moe/v4/${kind}/${candidate.externalId}/full`)) as { data?: { title?: string; title_english?: string; synopsis?: string; images?: { jpg?: { large_image_url?: string } } } };
  return { title: body.data?.title_english ?? body.data?.title ?? candidate.title, coverUrl: body.data?.images?.jpg?.large_image_url ?? candidate.thumbnailUrl, synopsis: body.data?.synopsis ?? '' };
}
