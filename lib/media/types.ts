export type MediaType = 'book' | 'manga' | 'anime' | 'movie';

export type MediaStatus = 'planned' | 'in_progress' | 'finished' | 'abandoned';

export type RoomZone =
  | 'reading-shelf'
  | 'reading-nearby'
  | 'reading-abandoned-pile'
  | 'tv-cabinet'
  | 'tv-player'
  | 'tv-planned-stack'
  | 'tv-abandoned-pile';

export type MediaEntry = {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  coverUrl?: string;
  synopsis: string;
  rating?: number;
  note?: string;
  visibility: 'public' | 'private';
};
