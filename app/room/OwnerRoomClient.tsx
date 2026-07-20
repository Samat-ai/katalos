'use client';

import { useState } from 'react';
import { MediaEntryForm, type MediaEntryInput } from '@/components/media/MediaEntryForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import type { MediaEntry } from '@/lib/media/types';

type ApiResult = { entry?: MediaEntry; error?: string };

export function OwnerRoomClient({ initialEntries, username, avatar = 'girl' }: { initialEntries: MediaEntry[]; username: string; avatar?: 'girl' | 'boy' }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<MediaEntry | null | undefined>(initialEntries.length ? undefined : null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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
    try { await navigator.clipboard.writeText(`${window.location.origin}/u/${username}`); setMessage('✓ copied'); }
    catch { setMessage("Couldn’t copy — long-press the URL."); }
  }

  return <>
    <header className="owner-header"><div><p className="eyebrow">Your room</p><h1>{username}&apos;S ROOM</h1><p className="room-url">katalos.app/u/{username}</p></div><div className="owner-actions"><button onClick={() => setEditing(null)}>+ ADD MEDIA</button><button onClick={() => void copyPublicLink()}>COPY PUBLIC LINK</button></div></header>
    {message && <p role="status">{message}</p>}
    {editing !== undefined && <MediaEntryForm initialEntry={editing ?? undefined} onSave={(entry) => void save(entry)} onCancel={() => setEditing(undefined)} />}
    <MediaRoom entries={entries} readOnly={false} avatar={avatar} />
    {!entries.length && <section className="empty-state"><h2>Your room is ready for its first story.</h2><p>Nothing here yet—and that&apos;s fine. Add a book, manga, anime, or movie to start the scene.</p></section>}
    <section className="entry-list" aria-label="Your media"><h2>MANAGE MEDIA</h2>{entries.map((entry) => <div key={entry.id} className="manage-row"><span className="type-chip">{entry.type}</span><strong>{entry.title}</strong><span className={`status-chip ${entry.status}`}>{entry.status.replace('_', ' ')}</span><span className="visibility-chip">{entry.visibility === 'public' ? 'PUB' : 'PRI'}</span>{pendingDelete === entry.id ? <span className="delete-confirm">DELETE? <button onClick={() => void remove(entry)}>DELETE</button><button onClick={() => setPendingDelete(null)}>KEEP</button></span> : <span><button onClick={() => setEditing(entry)}>EDIT</button><button onClick={() => setPendingDelete(entry.id)}>DELETE</button></span>}</div>)}</section>
  </>;
}
