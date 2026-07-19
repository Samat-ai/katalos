import type { MediaEntry, MediaStatus, MediaType } from './types';

export type MediaRow = {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  cover_url: string | null;
  synopsis: string;
  rating: number | null;
  note: string | null;
  visibility: 'public' | 'private';
};

export type ProfilerEntry = Pick<MediaEntry, 'title' | 'type' | 'status' | 'synopsis' | 'rating'>;

export function toMediaEntry(row: MediaRow): MediaEntry {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    coverUrl: row.cover_url ?? undefined,
    synopsis: row.synopsis,
    rating: row.rating ?? undefined,
    note: row.note ?? undefined,
    visibility: row.visibility,
  };
}

function boundedText(value: string, limit: number) {
  return value.trim().slice(0, limit);
}

export function publicEntryForProfiler(row: MediaRow): ProfilerEntry {
  return {
    title: boundedText(row.title, 160),
    type: row.type,
    status: row.status,
    synopsis: boundedText(row.synopsis, 1_000),
    ...(row.rating === null ? {} : { rating: row.rating }),
  };
}

export function publicEntriesForProfiler(rows: MediaRow[]): ProfilerEntry[] {
  return rows.filter((row) => row.visibility === 'public').map(publicEntryForProfiler);
}
