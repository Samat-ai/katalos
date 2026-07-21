'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { CoverBlock } from '@/components/pixel/CoverBlock';
import { PixelTooltip, type TooltipAnchorRect } from '@/components/pixel/PixelTooltip';
import type { MediaEntry } from '@/lib/media/types';

export function MediaCover({ entry, index, onSelect, showPrivateMarker = false }: { entry: MediaEntry; index: number; onSelect: (entry: MediaEntry) => void; showPrivateMarker?: boolean }) {
  const style = { '--cover-offset': `${index * 12}px` } as CSSProperties;
  const [anchorRect, setAnchorRect] = useState<TooltipAnchorRect | null>(null);
  const showTooltip = (target: HTMLElement) => setAnchorRect(target.getBoundingClientRect());
  const privateEntry = showPrivateMarker && entry.visibility === 'private';
  return <><button className={`media-cover ${entry.type} ${privateEntry ? 'is-private' : ''}`} style={style} onClick={() => onSelect(entry)} onMouseEnter={(event) => showTooltip(event.currentTarget)} onMouseLeave={() => setAnchorRect(null)} onFocus={(event) => showTooltip(event.currentTarget)} onBlur={() => setAnchorRect(null)} aria-label={`Open ${entry.title}`}><CoverBlock title={entry.title} coverUrl={entry.coverUrl} />{privateEntry && <b aria-label="Private">P</b>}</button>{anchorRect && <PixelTooltip label={`${entry.title} · ${entry.type}`} anchorRect={anchorRect} />}</>;
}
