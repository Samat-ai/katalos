'use client';

import { useState } from 'react';
import { ParticleBurst, useParticleBurst } from '@/components/pixel/ParticleBurst';
import { PixelTooltip, type TooltipAnchorRect } from '@/components/pixel/PixelTooltip';
import { PongChannel } from './PongChannel';
import { SceneSprite } from './SceneSprite';

export function TVNook({ avatar, children }: { avatar: 'girl' | 'boy'; children: React.ReactNode }) {
  const [channel, setChannel] = useState(1);
  const [power, setPower] = useState(true);
  const { particles, pop } = useParticleBurst();
  const [tooltip, setTooltip] = useState<{ label: string; anchorRect: TooltipAnchorRect } | null>(null);
  const showTooltip = (label: string, target: HTMLElement) => setTooltip({ label, anchorRect: target.getBoundingClientRect() });
  const toyEvents = (label: string) => ({ onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => showTooltip(label, event.currentTarget), onMouseLeave: () => setTooltip(null), onFocus: (event: React.FocusEvent<HTMLButtonElement>) => showTooltip(label, event.currentTarget), onBlur: () => setTooltip(null) });

  return <section className={`room-nook knook watcher avatar-${avatar}`} aria-label="TV nook"><div className="nook-plaque">TV nook</div><div className="nook-window" aria-hidden="true"><span /><span /></div><SceneSprite role="watcher" avatar={avatar} /><div className="nook-furniture tv-set"><div className={`tv-screen ${power ? `channel-${channel}` : 'is-off'}`} aria-label={power ? `TV channel ${channel}` : 'TV off'}>{power ? <><span className="tv-bug">CH{channel}</span>{channel === 2 ? <PongChannel active={power && channel === 2} /> : <span className="tv-image">{channel === 1 ? 'DVD' : channel === 3 ? 'SUNSET' : channel === 4 ? 'STARS' : 'STATIC'}</span>}</> : <span className="standby-dot" />}</div><button className="scene-toy toy-antenna" type="button" aria-label="Wiggle the antenna" onClick={() => pop('spark')} {...toyEvents('Wiggle the antenna')}><i /><b /></button><button className="tv-knob channel-knob" type="button" aria-label="Change channel" onClick={() => setChannel((current) => current === 5 ? 1 : current + 1)} /><button className="tv-knob power-knob" type="button" aria-label="Power on or off" aria-pressed={power} onClick={() => setPower((on) => !on)} /></div><div className="nook-scene">{children}</div><span className="nook-particle-layer" aria-hidden="true">{particles.map((particle) => <ParticleBurst kind={particle.kind} key={particle.id} />)}</span>{tooltip && <PixelTooltip label={tooltip.label} anchorRect={tooltip.anchorRect} />}</section>;
}
