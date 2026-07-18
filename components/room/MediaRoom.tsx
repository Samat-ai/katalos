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

export function MediaRoom({ entries, readOnly: _readOnly }: { entries: MediaEntry[]; readOnly: boolean }) {
  const [selected, setSelected] = useState<MediaEntry | null>(null);
  const reading = entries.filter((entry) => entry.type === 'book' || entry.type === 'manga');
  const watching = entries.filter((entry) => entry.type === 'anime' || entry.type === 'movie');
  const renderZone = (zone: RoomZone, items: MediaEntry[]) => <div className={`room-zone ${zone}`} aria-label={zones[zone]}>{items.map((entry, index) => <MediaCover key={entry.id} entry={entry} index={index} onSelect={setSelected} />)}</div>;
  const renderNook = (title: string, items: MediaEntry[], zoneNames: RoomZone[], avatar: string) => <section className="room-nook" aria-label={title}><div className="nook-heading"><span className={`pixel-avatar ${avatar}`} aria-hidden="true" /> <h2>{title}</h2></div><div className="nook-scene">{zoneNames.map((zone) => <div key={zone}>{renderZone(zone, items.filter((entry) => getRoomZone(entry) === zone))}</div>)}</div></section>;
  return <div className="media-room">{renderNook('Reading nook', reading, ['reading-shelf', 'reading-nearby', 'reading-abandoned-pile'], 'reader')}{renderNook('TV nook', watching, ['tv-cabinet', 'tv-player', 'tv-planned-stack', 'tv-abandoned-pile'], 'watcher')}<MediaDetailDrawer entry={selected} onClose={() => setSelected(null)} /></div>;
}
