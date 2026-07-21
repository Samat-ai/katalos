'use client';

import { useEffect, useRef, useState } from 'react';
import type { MediaEntry, RoomZone } from '@/lib/media/types';
import { getRoomZone } from '@/lib/room/placement';
import { MediaCover } from './MediaCover';
import { MediaDetailDrawer } from './MediaDetailDrawer';
import { PongChannel } from './PongChannel';

const zones: Record<RoomZone, string> = {
  'reading-shelf': 'Finished shelf', 'reading-nearby': 'Reading nearby', 'reading-abandoned-pile': 'Abandoned reading pile',
  'tv-cabinet': 'Finished cabinet', 'tv-player': 'Now playing', 'tv-planned-stack': 'Watch next stack', 'tv-abandoned-pile': 'Abandoned watch pile',
};

function NookScaleWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const fitNook = () => wrapper.style.setProperty('--kscale', Math.min(1, wrapper.clientWidth / 416).toFixed(4));
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

export function MediaRoom({ entries, readOnly: _readOnly, avatar = 'girl' }: { entries: MediaEntry[]; readOnly: boolean; avatar?: 'girl' | 'boy' }) {
  const [selected, setSelected] = useState<MediaEntry | null>(null);
  const [tooltip, setTooltip] = useState<{ entry: MediaEntry; x: number; y: number } | null>(null);
  const [lampOn, setLampOn] = useState(true);
  const [tvChannel, setTvChannel] = useState(1);
  const [tvPower, setTvPower] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; kind: string }>>([]);
  const reading = entries.filter((entry) => entry.type === 'book' || entry.type === 'manga');
  const watching = entries.filter((entry) => entry.type === 'anime' || entry.type === 'movie');
  const renderZone = (zone: RoomZone, items: MediaEntry[]) => <div className={`room-zone ${zone}`} aria-label={zones[zone]}>{items.length ? items.slice(0, 12).map((entry, index) => <MediaCover key={entry.id} entry={entry} index={index} onSelect={setSelected} onShowTooltip={(tipEntry, anchor) => setTooltip({ entry: tipEntry, x: anchor.left + anchor.width / 2, y: anchor.top })} onHideTooltip={() => setTooltip(null)} />) : <span className="empty-footprint">nothing here yet</span>}{items.length > 12 && <button className="zone-more" type="button">+{items.length - 12} more</button>}</div>;
  const pop = (kind: string) => { const id = Date.now(); setParticles((current) => [...current, { id, kind }]); window.setTimeout(() => setParticles((current) => current.filter((particle) => particle.id !== id)), 800); };
  const renderNook = (title: string, items: MediaEntry[], zoneNames: RoomZone[], nook: string) => <NookScaleWrapper><section className={`room-nook knook ${nook} avatar-${avatar}`} aria-label={title}><div className="nook-plaque">{title}</div><div className="nook-window" aria-hidden="true"><span /><span /></div><div className="pixel-sprite" aria-hidden="true"><i /><b /></div>{nook === 'reader' ? <><div className="nook-furniture" aria-hidden="true" /><div className={`lamp-glow ${lampOn ? 'is-on' : ''}`} aria-hidden="true" /><button className="scene-toy toy-lamp" type="button" aria-label="Toggle reading lamp" aria-pressed={lampOn} onClick={() => { setLampOn((on) => !on); pop('spark'); }}><i /><b /></button><button className="scene-toy toy-plant" type="button" aria-label="Pet the plant" onClick={() => pop('leaf')}><i /><b /></button><button className="scene-toy toy-cat" type="button" aria-label="Pet the cat" onClick={() => pop('heart')}><i /><b /></button></> : <div className="nook-furniture tv-set"><div className={`tv-screen ${tvPower ? `channel-${tvChannel}` : 'is-off'}`} aria-label={tvPower ? `TV channel ${tvChannel}` : 'TV off'}>{tvPower ? <><span className="tv-bug">CH{tvChannel}</span>{tvChannel === 2 ? <PongChannel /> : <span className="tv-image">{tvChannel === 1 ? 'DVD' : tvChannel === 3 ? 'SUNSET' : tvChannel === 4 ? 'STARS' : 'STATIC'}</span>}</> : <span className="standby-dot" />}</div><button className="scene-toy toy-antenna" type="button" aria-label="Wiggle the antenna" onClick={() => pop('spark')}><i /><b /></button><button className="tv-knob channel-knob" type="button" aria-label="Change channel" onClick={() => setTvChannel((channel) => channel === 5 ? 1 : channel + 1)} /><button className="tv-knob power-knob" type="button" aria-label="Power on or off" aria-pressed={tvPower} onClick={() => setTvPower((on) => !on)} /></div>}<div className="nook-scene">{zoneNames.map((zone) => <div className="scene-zone" key={zone}>{renderZone(zone, items.filter((entry) => getRoomZone(entry) === zone))}</div>)}</div>{particles.map((particle) => <span className={`pixel-particle ${particle.kind}`} key={particle.id} aria-hidden="true" />)}</section></NookScaleWrapper>;
  return <div className="media-room">{renderNook('Reading nook', reading, ['reading-shelf', 'reading-nearby', 'reading-abandoned-pile'], 'reader')}{renderNook('TV nook', watching, ['tv-cabinet', 'tv-player', 'tv-planned-stack', 'tv-abandoned-pile'], 'watcher')}{tooltip && <span className="pixel-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{tooltip.entry.title} <em>· {tooltip.entry.type}</em></span>}<MediaDetailDrawer entry={selected} onClose={() => setSelected(null)} /></div>;
}
