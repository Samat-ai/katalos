'use client';

import { useState } from 'react';
import { MediaEntryForm, type MediaEntryInput } from '@/components/media/MediaEntryForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import type { MediaEntry } from '@/lib/media/types';

type ApiResult = { entry?: MediaEntry; error?: string };

export function OwnerRoomClient({ initialEntries, username }: { initialEntries: MediaEntry[]; username: string }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<MediaEntry | null | undefined>(undefined);
  const [message, setMessage] = useState('');

  async function save(entry: MediaEntryInput) {
    const endpoint = editing ? `/api/media/${editing.id}` : '/api/media';
    const response = await fetch(endpoint, { method: editing ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
    const body = await response.json() as ApiResult;
    if (!response.ok || !body.entry) { setMessage(body.error ?? 'We could not save that entry.'); return; }
    setEntries((current) => editing ? current.map((item) => item.id === editing.id ? body.entry! : item) : [body.entry!, ...current]);
    setEditing(undefined);
    setMessage('Saved.');
  }

  async function remove(entry: MediaEntry) {
    const response = await fetch(`/api/media/${entry.id}`, { method: 'DELETE' });
    if (!response.ok) { const body = await response.json() as ApiResult; setMessage(body.error ?? 'We could not delete that entry.'); return; }
    setEntries((current) => current.filter((item) => item.id !== entry.id));
    setMessage('Deleted.');
  }

  async function copyPublicLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
    setMessage('Public room link copied.');
  }

  return <>
    <header><div><p className="eyebrow">Your room</p><h1>Make your taste tangible.</h1><p>Share only what belongs in public: <a href={`/u/${username}`}>/u/{username}</a></p></div><div><button onClick={() => void copyPublicLink()}>Copy public link</button><button onClick={() => setEditing(null)}>Add media</button></div></header>
    {message && <p role="status">{message}</p>}
    {editing !== undefined && <MediaEntryForm initialEntry={editing ?? undefined} onSave={(entry) => void save(entry)} onCancel={() => setEditing(undefined)} />}
    {entries.length ? <MediaRoom entries={entries} readOnly={false} /> : <section className="empty-state"><h2>Your room is ready for its first story.</h2><p>Add a book, manga, anime, or movie. Set it private to keep it out of your public room and Taste Profile.</p></section>}
    <section className="entry-list" aria-label="Your media"><h2>Manage media</h2>{entries.map((entry) => <div key={entry.id}><span>{entry.title} <small>({entry.visibility})</small></span><button onClick={() => setEditing(entry)}>Edit</button><button onClick={() => void remove(entry)}>Delete</button></div>)}</section>
  </>;
}
