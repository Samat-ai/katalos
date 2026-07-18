'use client';

import { useState } from 'react';
import { MediaEntryForm, type MediaEntryInput } from '@/components/media/MediaEntryForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import { demoEntries } from '@/lib/media/demo-data';
import type { MediaEntry } from '@/lib/media/types';

export default function OwnerRoomPage() {
  const [entries, setEntries] = useState(demoEntries);
  const [editing, setEditing] = useState<MediaEntry | null | undefined>(null);
  const save = (entry: MediaEntryInput) => { if (editing) setEntries((items) => items.map((item) => item.id === editing.id ? { ...entry, id: item.id } : item)); else setEntries((items) => [...items, { ...entry, id: crypto.randomUUID() }]); setEditing(undefined); };
  return <main className="owner-page"><header><p className="eyebrow">Your room</p><h1>Make your taste tangible.</h1><button onClick={() => setEditing(null)}>Add media</button></header>{editing !== undefined && <MediaEntryForm initialEntry={editing ?? undefined} onSave={save} onCancel={() => setEditing(undefined)} />}<MediaRoom entries={entries} readOnly={false} /><section className="entry-list" aria-label="Your media"><h2>Manage media</h2>{entries.map((entry) => <div key={entry.id}><span>{entry.title}</span><button onClick={() => setEditing(entry)}>Edit</button><button onClick={() => setEntries((items) => items.filter((item) => item.id !== entry.id))}>Delete</button></div>)}</section></main>;
}
