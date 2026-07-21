import type { MediaEntry } from '@/lib/media/types';

export type HandoffItem = { id: string; t: string; ty: MediaEntry['type']; st: 'planned' | 'in progress' | 'finished' | 'abandoned'; r: number; n: string; syn: string; c: string };
export type HandoffShelves = Record<'shelf1' | 'shelf2' | 'nowStack' | 'pileBooks' | 'cabinet' | 'nowPlaying' | 'watchNext' | 'pausedTapes', HandoffItem[]>;

const colors = ['#6fb3a4', '#e0a458', '#c4523e', '#4e7a9a', '#7a9a4e', '#8a5a8f'];
const empty = (): HandoffShelves => ({ shelf1: [], shelf2: [], nowStack: [], pileBooks: [], cabinet: [], nowPlaying: [], watchNext: [], pausedTapes: [] });

export function toHandoffShelves(entries: MediaEntry[]): HandoffShelves {
  const shelves = empty();
  entries.forEach((entry, index) => {
    const item: HandoffItem = { id: entry.id, t: entry.title, ty: entry.type, st: entry.status.replace('_', ' ') as HandoffItem['st'], r: entry.rating ?? 0, n: entry.note ?? '', syn: entry.synopsis, c: colors[index % colors.length] };
    const reading = entry.type === 'book' || entry.type === 'manga';
    if (entry.status === 'finished') (reading ? shelves.shelf1 : shelves.cabinet).push(item);
    else if (entry.status === 'in_progress') (reading ? shelves.nowStack : shelves.nowPlaying).push(item);
    else if (entry.status === 'planned') (reading ? shelves.shelf2 : shelves.watchNext).push(item);
    else (reading ? shelves.pileBooks : shelves.pausedTapes).push(item);
  });
  return shelves;
}
