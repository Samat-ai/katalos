'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { MediaEntry } from '@/lib/media/types';

export function MediaCover({ entry, index, onSelect }: { entry: MediaEntry; index: number; onSelect: (entry: MediaEntry) => void }) {
  const style = { '--cover-offset': `${index * 12}px` } as CSSProperties;
  const [coverFailed, setCoverFailed] = useState(false);
  return <button className={`media-cover ${entry.type} ${entry.visibility === 'private' ? 'is-private' : ''}`} style={style} onClick={() => onSelect(entry)} aria-label={`Open ${entry.title}`}>{entry.coverUrl && !coverFailed ? <img src={entry.coverUrl} alt={entry.title} onError={() => setCoverFailed(true)} /> : <span>{entry.title.slice(0, 18)}</span>}{entry.visibility === 'private' && <b aria-label="Private">P</b>}</button>;
}
