import { z } from 'zod';

export const MediaEntryInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  type: z.enum(['book', 'manga', 'anime', 'movie']),
  status: z.enum(['planned', 'in_progress', 'finished', 'abandoned']),
  coverUrl: z.string().trim().max(2_000),
  synopsis: z.string().trim().max(5_000),
  rating: z.string().regex(/^[1-5]?$/, 'Rating must be between 1 and 5'),
  note: z.string().trim().max(5_000),
  visibility: z.enum(['public', 'private']),
});

export type MediaEntryInput = z.infer<typeof MediaEntryInputSchema>;

export function mediaInputToRow(entry: MediaEntryInput) {
  return {
    title: entry.title,
    type: entry.type,
    status: entry.status,
    cover_url: entry.coverUrl || null,
    synopsis: entry.synopsis,
    rating: entry.rating ? Number(entry.rating) : null,
    note: entry.note || null,
    visibility: entry.visibility,
  };
}
