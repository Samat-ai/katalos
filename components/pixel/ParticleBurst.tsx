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
