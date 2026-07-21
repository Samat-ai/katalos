'use client';

import { useState } from 'react';
import { MediaEntryForm, type MediaEntryInput } from '@/components/media/MediaEntryForm';
import { HandoffFrame } from '@/components/handoff/HandoffFrame';
import { toHandoffShelves } from '@/lib/handoff/entries';
import type { MediaEntry, MediaStatus } from '@/lib/media/types';
import { getRoomZone } from '@/lib/room/placement';

type ApiResult = { entry?: MediaEntry; error?: string };

export function OwnerRoomClient({ initialEntries, username, avatar: _avatar = 'girl', initialAdd = false }: { initialEntries: MediaEntry[]; username: string; avatar?: 'girl' | 'boy'; initialAdd?: boolean }) {
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<MediaEntry | null | undefined>(initialAdd || !initialEntries.length ? null : undefined);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [manageZone, setManageZone] = useState<ReturnType<typeof getRoomZone> | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | MediaStatus | 'private'>('all');
  const shelfOverflow = entries.filter((entry) => getRoomZone(entry) === 'reading-shelf').length - 12;

  async function save(entry: MediaEntryInput) {
    const endpoint = editing ? `/api/media/${editing.id}` : '/api/media';
    const response = await fetch(endpoint, { method: editing ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
    const body = await response.json() as ApiResult;
    if (!response.ok || !body.entry) { setMessage(body.error ?? 'We could not save that entry.'); return; }
    setEntries((current) => editing ? current.map((item) => item.id === editing.id ? body.entry! : item) : [body.entry!, ...current]);
    setEditing(undefined);
    setMessage('Shelved.');
  }

  async function remove(entry: MediaEntry) {
    const response = await fetch(`/api/media/${entry.id}`, { method: 'DELETE' });
    if (!response.ok) { const body = await response.json() as ApiResult; setMessage(body.error ?? 'We could not delete that entry.'); return; }
    setEntries((current) => current.filter((item) => item.id !== entry.id));
    setPendingDelete(null);
    setMessage('Deleted.');
  }

  async function copyPublicLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/u/${username}`); setMessage('✓ copied'); }
    catch { setMessage("Couldn’t copy — long-press the URL."); }
  }

  return <>
    {message && <p role="status">{message}</p>}
    {editing !== undefined && <MediaEntryForm initialEntry={editing ?? undefined} onSave={save} onCancel={() => setEditing(undefined)} />}
    <div className="handoff-room-shell"><HandoffFrame src="/handoff/landing.dc.html" title={`${username}'s room`} shelves={toHandoffShelves(entries)} onEntryOpen={(entryId) => { const entry = entries.find((item) => item.id === entryId); if (entry) setEditing(entry); }} onMakeRoom={() => setEditing(null)} /><div className="handoff-owner-actions"><span>@{username}</span><button onClick={() => setEditing(null)}>+ ADD MEDIA</button><button onClick={() => void copyPublicLink()}>COPY PUBLIC LINK</button></div>{shelfOverflow > 0 && <button className="handoff-overflow" type="button" onClick={() => setManageZone('reading-shelf')}>+{shelfOverflow} more</button>}</div>
    {!entries.length && <section className="empty-state"><h2>Your room is ready for its first story.</h2><p>Nothing here yet—and that&apos;s fine. Add a book, manga, anime, or movie to start the scene.</p></section>}
    <section className="entry-list" aria-label="Your media"><h2>MANAGE MEDIA{manageZone ? ` · ${manageZone.replace(/-/g, ' ')}` : ''}</h2><div className="manage-filters" aria-label="Media filters"><button type="button" aria-pressed={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>ALL MEDIA</button>{(['planned', 'in_progress', 'finished', 'abandoned'] as const).map((status) => <button key={status} type="button" aria-pressed={activeFilter === status} onClick={() => setActiveFilter(status)}>{status.replace('_', ' ')}</button>)}<button type="button" aria-pressed={activeFilter === 'private'} onClick={() => setActiveFilter('private')}>PRIVATE</button>{manageZone && <button type="button" onClick={() => setManageZone(null)}>SHOW ALL</button>}</div>{entries.filter((entry) => (!manageZone || getRoomZone(entry) === manageZone) && (activeFilter === 'all' || activeFilter === 'private' ? activeFilter === 'all' || entry.visibility === 'private' : entry.status === activeFilter)).map((entry) => <div key={entry.id} className="manage-row"><span className="type-chip">{entry.type}</span><strong>{entry.title}</strong><span className={`status-chip ${entry.status}`}>{entry.status.replace('_', ' ')}</span>{entry.visibility === 'private' ? <span className="visibility-chip" aria-label="Private">PRIVATE</span> : <span className="visibility-chip">PUBLIC</span>}{pendingDelete === entry.id ? <span className="delete-confirm">DELETE? <button onClick={() => void remove(entry)}>DELETE</button><button onClick={() => setPendingDelete(null)}>KEEP</button></span> : <span><button onClick={() => setEditing(entry)}>EDIT</button><button onClick={() => setPendingDelete(entry.id)}>DELETE</button></span>}</div>)}</section>
  </>;
}
