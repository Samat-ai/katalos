'use client';

import { useState } from 'react';
import { ParticleBurst, useParticleBurst } from '@/components/pixel/ParticleBurst';
import { PixelTooltip, type TooltipAnchorRect } from '@/components/pixel/PixelTooltip';
import { SceneSprite } from './SceneSprite';

export function ReadingNook({ avatar, children }: { avatar: 'girl' | 'boy'; children: React.ReactNode }) {
  const [lampOn, setLampOn] = useState(true);
  const { particles, pop } = useParticleBurst();
  const [tooltip, setTooltip] = useState<{ label: string; anchorRect: TooltipAnchorRect } | null>(null);
  const showTooltip = (label: string, target: HTMLElement) => setTooltip({ label, anchorRect: target.getBoundingClientRect() });
  const toyEvents = (label: string) => ({ onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => showTooltip(label, event.currentTarget), onMouseLeave: () => setTooltip(null), onFocus: (event: React.FocusEvent<HTMLButtonElement>) => showTooltip(label, event.currentTarget), onBlur: () => setTooltip(null) });

  return <section className={`room-nook knook reader avatar-${avatar}`} aria-label="Reading nook"><div className="nook-plaque">Reading nook</div><div className="nook-window" aria-hidden="true"><span /><span /></div><span className="scene-rug" aria-hidden="true" /><SceneSprite role="reader" avatar={avatar} /><div className="nook-furniture" aria-hidden="true" /><div className={`lamp-glow ${lampOn ? 'is-on' : ''}`} aria-hidden="true" /><button className="scene-toy toy-lamp" type="button" aria-label="Toggle reading lamp" aria-pressed={lampOn} onClick={() => setLampOn((on) => !on)} {...toyEvents('Toggle reading lamp')}><i className="lamp-wedge" /><b /></button><button className="scene-toy toy-plant" type="button" aria-label="Pet the plant" onClick={() => pop('leaf')} {...toyEvents('Pet the plant')}><i /><b /></button><button className="scene-toy toy-cat" type="button" aria-label="Pet the cat" onClick={() => pop('heart')} {...toyEvents('Pet the cat')}><SceneSprite role="cat" /></button><div className="nook-scene">{children}</div><span className="nook-particle-layer" aria-hidden="true">{particles.map((particle) => <ParticleBurst kind={particle.kind} key={particle.id} />)}</span>{tooltip && <PixelTooltip label={tooltip.label} anchorRect={tooltip.anchorRect} />}</section>;
}
