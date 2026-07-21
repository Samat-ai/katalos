import { z } from 'zod';
import type { MediaType } from '@/lib/media/types';

export const CatalogSourceSchema = z.enum(['open_library', 'jikan', 'anilist', 'tmdb']);
export type CatalogSource = z.infer<typeof CatalogSourceSchema>;

export const CatalogSearchRequestSchema = z.object({
  type: z.enum(['book', 'manga', 'anime', 'movie']),
  query: z.string().trim().min(3, 'Enter at least three characters.').max(120),
});
export type CatalogSearchRequest = z.infer<typeof CatalogSearchRequestSchema>;

export const CatalogCandidateSchema = z.object({
  source: CatalogSourceSchema,
  externalId: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().min(1).max(200).optional(),
  thumbnailUrl: z.string().url().startsWith('https://').optional(),
});
export type CatalogCandidate = z.infer<typeof CatalogCandidateSchema>;

export const CatalogDetailsRequestSchema = CatalogCandidateSchema.extend({
  type: z.enum(['book', 'manga', 'anime', 'movie']),
});

export const CatalogPrefillSchema = z.object({
  title: z.string().trim().min(1).max(200),
  coverUrl: z.string().url().startsWith('https://').optional(),
  synopsis: z.string().trim().max(5_000),
});
export type CatalogPrefill = z.infer<typeof CatalogPrefillSchema>;

type OpenLibraryResult = { key?: unknown; title?: unknown; author_name?: unknown; cover_i?: unknown };

export function sourceForType(type: MediaType): CatalogSource {
  if (type === 'book') return 'open_library';
  if (type === 'movie') return 'tmdb';
  return 'jikan';
}

export function normalizeCatalogCandidate(source: CatalogSource, result: unknown): CatalogCandidate | null {
  if (source !== 'open_library' || !result || typeof result !== 'object') return null;
  const value = result as OpenLibraryResult;
  const key = typeof value.key === 'string' ? value.key.split('/').filter(Boolean).pop() : undefined;
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  if (!key || !title) return null;
  const author = Array.isArray(value.author_name) && typeof value.author_name[0] === 'string' ? value.author_name[0].trim() : undefined;
  const cover = typeof value.cover_i === 'number' && Number.isFinite(value.cover_i)
    ? `https://covers.openlibrary.org/b/id/${value.cover_i}-M.jpg`
    : undefined;
  return CatalogCandidateSchema.parse({ source, externalId: key, title, ...(author ? { subtitle: author } : {}), ...(cover ? { thumbnailUrl: cover } : {}) });
}
