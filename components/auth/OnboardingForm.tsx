'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AvatarPicker } from '@/components/auth/AvatarPicker';
import { OnboardingSchema } from '@/lib/auth/schema';

export function OnboardingForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('Momo');
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
      router.replace('/room?add=1');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not save your profile.');
    } finally { setSaving(false); }
  }

  return <form className="entry-form onboarding-form" onSubmit={submit} noValidate>
    <h2>NAME YOUR ROOM</h2>
    <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} /></label>
    <label>Username<input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} maxLength={32} aria-describedby="username-help" /></label>
    <p id="username-help">Use 3–32 lowercase letters, numbers, or underscores — this becomes your public room link.</p>
    <p className="room-url">www.katalos.tech/u/{username || '<username>'}</p>
    <AvatarPicker value={avatar} onChange={setAvatar} />
    {error && <p role="alert">{error}</p>}
    <div><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create my room'}</button></div>
  </form>;
}
