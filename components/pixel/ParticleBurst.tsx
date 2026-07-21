import { useCallback, useEffect, useRef, useState } from 'react';

export type ParticleKind = 'heart' | 'leaf' | 'spark';

export type ParticleBurstProps = {
  kind: ParticleKind;
  count?: number;
  className?: string;
};

export function ParticleBurst({ kind, count = 1, className }: ParticleBurstProps) {
  return <span className={['particle-burst', className].filter(Boolean).join(' ')} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <span className={`pixel-particle ${kind}`} key={index} />)}
  </span>;
}

export function useParticleBurst(duration = 800) {
  const [particles, setParticles] = useState<Array<{ id: number; kind: ParticleKind }>>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<number>());
  const pop = useCallback((kind: ParticleKind) => {
    const id = ++nextId.current;
    setParticles((current) => [...current, { id, kind }]);
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      setParticles((current) => current.filter((particle) => particle.id !== id));
    }, duration);
    timers.current.add(timer);
  }, [duration]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  return { particles, pop };
}
