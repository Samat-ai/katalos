'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OnboardingSchema } from '@/lib/auth/schema';

export function OnboardingForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<'girl' | 'boy'>('girl');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = OnboardingSchema.safeParse({ displayName, username, avatar });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check your profile.'); return; }
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/profile', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      router.replace('/room');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not save your profile.');
    } finally { setSaving(false); }
  }

  return <form className="entry-form onboarding-form" onSubmit={submit} noValidate>
    <h2>NAME YOUR ROOM</h2>
    <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} /></label>
    <label>Username<input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} maxLength={32} aria-describedby="username-help" /></label>
    <p id="username-help">Lowercase letters, numbers, and underscores only. This becomes your public room link.</p>
    <section className="avatar-picker"><h3>WHO&apos;S IN YOUR ROOM?</h3><div><button type="button" aria-pressed={avatar === 'girl'} onClick={() => setAvatar('girl')}><span className="avatar-preview girl" aria-hidden="true" />GIRL</button><button type="button" aria-pressed={avatar === 'boy'} onClick={() => setAvatar('boy')}><span className="avatar-preview boy" aria-hidden="true" />BOY</button></div><p>Same sprite reads and watches in both nooks · changeable later.</p></section>
    {error && <p role="alert">{error}</p>}
    <div><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create my room'}</button></div>
  </form>;
}
