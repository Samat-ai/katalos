'use client';

import { useState } from 'react';
import { SceneSprite } from './SceneSprite';

export function ReadingNook({ avatar, children }: { avatar: 'girl' | 'boy'; children: React.ReactNode }) {
  const [lampOn, setLampOn] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; kind: string }>>([]);
  const pop = (kind: string) => {
    const id = Date.now();
    setParticles((current) => [...current, { id, kind }]);
    window.setTimeout(() => setParticles((current) => current.filter((particle) => particle.id !== id)), 800);
  };

  return <section className={`room-nook knook reader avatar-${avatar}`} aria-label="Reading nook"><div className="nook-plaque">Reading nook</div><div className="nook-window" aria-hidden="true"><span /><span /></div><span className="scene-rug" aria-hidden="true" /><SceneSprite role="reader" avatar={avatar} /><div className="nook-furniture" aria-hidden="true" /><div className={`lamp-glow ${lampOn ? 'is-on' : ''}`} aria-hidden="true" /><button className="scene-toy toy-lamp" type="button" aria-label="Toggle reading lamp" aria-pressed={lampOn} onClick={() => { setLampOn((on) => !on); pop('spark'); }}><i className="lamp-wedge" /><b /></button><button className="scene-toy toy-plant" type="button" aria-label="Pet the plant" onClick={() => pop('leaf')}><i /><b /></button><button className="scene-toy toy-cat" type="button" aria-label="Pet the cat" onClick={() => pop('heart')}><SceneSprite role="cat" /></button><div className="nook-scene">{children}</div>{particles.map((particle) => <span className={`pixel-particle ${particle.kind}`} key={particle.id} aria-hidden="true" />)}</section>;
}
