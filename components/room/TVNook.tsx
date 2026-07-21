'use client';

import { useState } from 'react';
import { PongChannel } from './PongChannel';

export function TVNook({ avatar, children }: { avatar: 'girl' | 'boy'; children: React.ReactNode }) {
  const [channel, setChannel] = useState(1);
  const [power, setPower] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; kind: string }>>([]);
  const pop = (kind: string) => {
    const id = Date.now();
    setParticles((current) => [...current, { id, kind }]);
    window.setTimeout(() => setParticles((current) => current.filter((particle) => particle.id !== id)), 800);
  };

  return <section className={`room-nook knook watcher avatar-${avatar}`} aria-label="TV nook"><div className="nook-plaque">TV nook</div><div className="nook-window" aria-hidden="true"><span /><span /></div><div className="pixel-sprite" aria-hidden="true"><i /><b /></div><div className="nook-furniture tv-set"><div className={`tv-screen ${power ? `channel-${channel}` : 'is-off'}`} aria-label={power ? `TV channel ${channel}` : 'TV off'}>{power ? <><span className="tv-bug">CH{channel}</span>{channel === 2 ? <PongChannel /> : <span className="tv-image">{channel === 1 ? 'DVD' : channel === 3 ? 'SUNSET' : channel === 4 ? 'STARS' : 'STATIC'}</span>}</> : <span className="standby-dot" />}</div><button className="scene-toy toy-antenna" type="button" aria-label="Wiggle the antenna" onClick={() => pop('spark')}><i /><b /></button><button className="tv-knob channel-knob" type="button" aria-label="Change channel" onClick={() => setChannel((current) => current === 5 ? 1 : current + 1)} /><button className="tv-knob power-knob" type="button" aria-label="Power on or off" aria-pressed={power} onClick={() => setPower((on) => !on)} /></div><div className="nook-scene">{children}</div>{particles.map((particle) => <span className={`pixel-particle ${particle.kind}`} key={particle.id} aria-hidden="true" />)}</section>;
}
