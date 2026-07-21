import { useEffect, useRef } from 'react';
import type { MediaEntry, RoomZone } from '@/lib/media/types';
import { getRoomZone } from '@/lib/room/placement';
import { MediaCover } from './MediaCover';
import { ReadingNook } from './ReadingNook';
import { TVNook } from './TVNook';

const zoneLabels: Record<RoomZone, string> = {
  'reading-shelf': 'Finished shelf', 'reading-nearby': 'Reading nearby', 'reading-abandoned-pile': 'Abandoned reading pile',
  'tv-cabinet': 'Finished cabinet', 'tv-player': 'Now playing', 'tv-planned-stack': 'Watch next stack', 'tv-abandoned-pile': 'Abandoned watch pile',
};

const emptyCaptions: Record<RoomZone, string> = {
  'reading-shelf': 'Finish a book to fill this shelf.', 'reading-nearby': 'Pick something up to read here.', 'reading-abandoned-pile': "Set aside a book you won't finish.",
  'tv-cabinet': 'Finish something to add it here.', 'tv-player': 'Start watching something to put it here.', 'tv-planned-stack': 'Plan your next watch here.', 'tv-abandoned-pile': 'Set aside a show or movie here.',
};

function NookScaleWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const fitNook = () => wrapper.style.setProperty('--kscale', String(Math.min(1, wrapper.clientWidth / 416)));
    fitNook();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fitNook);
      return () => window.removeEventListener('resize', fitNook);
    }
    const observer = new ResizeObserver(fitNook);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return <div ref={wrapperRef} className="knookwrap">{children}</div>;
}

export function RoomScene({ entries, avatar, owner, onSelect, onZoneOverflow }: { entries: MediaEntry[]; avatar: 'girl' | 'boy'; owner: boolean; onSelect: (entry: MediaEntry) => void; onZoneOverflow: (zone: RoomZone) => void }) {
  const sceneEntries = owner ? entries : entries.filter((entry) => entry.visibility === 'public');
  const renderZone = (zone: RoomZone) => {
    const items = sceneEntries.filter((entry) => getRoomZone(entry) === zone);
    return <div className={`scene-zone ${zone}`} key={zone}><div className="room-zone" aria-label={zoneLabels[zone]}>{items.length ? items.slice(0, 12).map((entry, index) => <MediaCover key={entry.id} entry={entry} index={index} onSelect={onSelect} showPrivateMarker={owner} />) : <span className="empty-footprint">{emptyCaptions[zone]}</span>}{items.length > 12 && <button className="zone-more" type="button" onClick={() => onZoneOverflow(zone)}>+{items.length - 12} more</button>}</div></div>;
  };

  return <div className="media-room"><NookScaleWrapper><ReadingNook avatar={avatar}>{(['reading-shelf', 'reading-nearby', 'reading-abandoned-pile'] as const).map(renderZone)}</ReadingNook></NookScaleWrapper><NookScaleWrapper><TVNook avatar={avatar}>{(['tv-cabinet', 'tv-player', 'tv-planned-stack', 'tv-abandoned-pile'] as const).map(renderZone)}</TVNook></NookScaleWrapper></div>;
}
