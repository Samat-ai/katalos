import type { CSSProperties } from 'react';
import type { MediaEntry } from '@/lib/media/types';

export function MediaCover({ entry, index, onSelect }: { entry: MediaEntry; index: number; onSelect: (entry: MediaEntry) => void }) {
  const style = { '--cover-offset': `${index * 12}px` } as CSSProperties;
  return <button className="media-cover" style={style} onClick={() => onSelect(entry)} aria-label={`Open ${entry.title}`}><span>{entry.title}</span></button>;
}
