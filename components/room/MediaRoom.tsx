'use client';

import { useState } from 'react';
import type { MediaEntry, RoomZone } from '@/lib/media/types';
import { getRoomZone } from '@/lib/room/placement';
import { MediaCover } from './MediaCover';
import { MediaDetailDrawer } from './MediaDetailDrawer';

const zones: Record<RoomZone, string> = {
  'reading-shelf': 'Finished shelf', 'reading-nearby': 'Reading nearby', 'reading-abandoned-pile': 'Abandoned reading pile',
  'tv-cabinet': 'Finished cabinet', 'tv-player': 'Now playing', 'tv-planned-stack': 'Watch next stack', 'tv-abandoned-pile': 'Abandoned watch pile',
};

export function MediaRoom({ entries, readOnly: _readOnly, avatar = 'girl' }: { entries: MediaEntry[]; readOnly: boolean; avatar?: 'girl' | 'boy' }) {
  const [selected, setSelected] = useState<MediaEntry | null>(null);
  const [tooltip, setTooltip] = useState<{ entry: MediaEntry; x: number; y: number } | null>(null);
  const reading = entries.filter((entry) => entry.type === 'book' || entry.type === 'manga');
  const watching = entries.filter((entry) => entry.type === 'anime' || entry.type === 'movie');
  const renderZone = (zone: RoomZone, items: MediaEntry[]) => <div className={`room-zone ${zone}`} aria-label={zones[zone]}>{items.length ? items.slice(0, 12).map((entry, index) => <MediaCover key={entry.id} entry={entry} index={index} onSelect={setSelected} onShowTooltip={(tipEntry, anchor) => setTooltip({ entry: tipEntry, x: anchor.left + anchor.width / 2, y: anchor.top })} onHideTooltip={() => setTooltip(null)} />) : <span className="empty-footprint">nothing here yet</span>}{items.length > 12 && <button className="zone-more" type="button">+{items.length - 12} more</button>}</div>;
  const renderNook = (title: string, items: MediaEntry[], zoneNames: RoomZone[], nook: string) => <section className={`room-nook ${nook} avatar-${avatar}`} aria-label={title}><div className="nook-plaque">{title}</div><div className="nook-window" aria-hidden="true"><span /><span /></div><div className="pixel-sprite" aria-hidden="true"><i /><b /></div><div className="nook-furniture" aria-hidden="true" /><div className="nook-scene">{zoneNames.map((zone) => <div className="scene-zone" key={zone}>{renderZone(zone, items.filter((entry) => getRoomZone(entry) === zone))}</div>)}</div></section>;
  return <div className="media-room">{renderNook('Reading nook', reading, ['reading-shelf', 'reading-nearby', 'reading-abandoned-pile'], 'reader')}{renderNook('TV nook', watching, ['tv-cabinet', 'tv-player', 'tv-planned-stack', 'tv-abandoned-pile'], 'watcher')}{tooltip && <span className="pixel-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{tooltip.entry.title} <em>· {tooltip.entry.type}</em></span>}<MediaDetailDrawer entry={selected} onClose={() => setSelected(null)} /></div>;
}
