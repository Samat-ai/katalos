import type { MediaStatus, MediaType, RoomZone } from '@/lib/media/types';

export function getRoomZone(entry: Pick<{ type: MediaType; status: MediaStatus }, 'type' | 'status'>): RoomZone {
  const isReading = entry.type === 'book' || entry.type === 'manga';

  if (isReading) {
    if (entry.status === 'finished') return 'reading-shelf';
    if (entry.status === 'abandoned') return 'reading-abandoned-pile';
    return 'reading-nearby';
  }

  if (entry.status === 'finished') return 'tv-cabinet';
  if (entry.status === 'in_progress') return 'tv-player';
  if (entry.status === 'planned') return 'tv-planned-stack';
  return 'tv-abandoned-pile';
}
