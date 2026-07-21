'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { MediaEntry } from '@/lib/media/types';

export function MediaCover({ entry, index, onSelect, onShowTooltip, onHideTooltip }: { entry: MediaEntry; index: number; onSelect: (entry: MediaEntry) => void; onShowTooltip?: (entry: MediaEntry, anchor: DOMRect) => void; onHideTooltip?: () => void }) {
  const style = { '--cover-offset': `${index * 12}px` } as CSSProperties;
  const [coverFailed, setCoverFailed] = useState(false);
  const showTooltip = (target: HTMLElement) => onShowTooltip?.(entry, target.getBoundingClientRect());
  return <button className={`media-cover ${entry.type} ${entry.visibility === 'private' ? 'is-private' : ''}`} style={style} onClick={() => onSelect(entry)} onMouseEnter={(event) => showTooltip(event.currentTarget)} onMouseLeave={onHideTooltip} onFocus={(event) => showTooltip(event.currentTarget)} onBlur={onHideTooltip} aria-label={`Open ${entry.title}`}>{entry.coverUrl && !coverFailed ? <img src={entry.coverUrl} alt={entry.title} onError={() => setCoverFailed(true)} /> : <span>{entry.title.slice(0, 18)}</span>}{entry.visibility === 'private' && <b aria-label="Private">P</b>}</button>;
}
