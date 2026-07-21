'use client';

import { useState } from 'react';
import type { TasteProfile } from '@/lib/taste/schema';

type TasteProfilerCardProps = {
  username: string;
  displayName?: string;
  publicCount?: number;
};

export function TasteProfilerCard({ username, displayName = username, publicCount }: TasteProfilerCardProps) {
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const name = displayName.toUpperCase();

  async function read() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/taste-profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setProfile(body.profile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The profiler is napping. Try again — the room works fine without it.');
    } finally {
      setLoading(false);
    }
  }

  if (profile) {
    return <section className="taste-card">
      <p className="eyebrow">Powered by Gemini · public entries only</p>
      <h2>{profile.archetype}</h2>
      <p>{profile.profile}</p>
      <ul>{profile.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
      <p><strong>First pick: {profile.firstPick.title}</strong> — {profile.firstPick.reason}</p>
    </section>;
  }

  const needsMorePicks = publicCount !== undefined && publicCount < 3;
  return <section className="taste-card" aria-live="polite">
    <p className="eyebrow">Powered by Gemini · public entries only</p>
    <h2>WHAT DOES THIS ROOM SAY?</h2>
    {needsMorePicks ? <p className="taste-card-note">{name} NEEDS 3 PUBLIC PICKS</p> : <>
      {error && <p role="alert">{error}</p>}
      {loading ? <p className="profiler-loading" role="status" aria-label={`Consulting ${displayName}'s shelves`}>
        <span aria-hidden="true">CONSULTING THE SHELVES</span>
        <span className="profiler-steps" aria-hidden="true">
          <i data-testid="profiler-step" /><i data-testid="profiler-step" /><i data-testid="profiler-step" />
        </span>
      </p> : <button type="button" onClick={() => void read()}>{error ? 'TRY AGAIN' : `READ ${name}'S TASTE`}</button>}
    </>}
  </section>;
}
