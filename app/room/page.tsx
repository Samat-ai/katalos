'use client';

import { useEffect, useState } from 'react';
import { MediaEntryForm, type MediaEntryInput } from '@/components/media/MediaEntryForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import { demoEntries } from '@/lib/media/demo-data';
import type { MediaEntry } from '@/lib/media/types';
import { createClient } from '@/lib/supabase/client';

type MediaRow = { id: string; title: string; type: MediaEntry['type']; status: MediaEntry['status']; cover_url: string | null; synopsis: string; rating: number | null; note: string | null; visibility: MediaEntry['visibility'] };
const fromRow = (row: MediaRow): MediaEntry => ({ id: row.id, title: row.title, type: row.type, status: row.status, coverUrl: row.cover_url ?? undefined, synopsis: row.synopsis, rating: row.rating ?? undefined, note: row.note ?? undefined, visibility: row.visibility });
const toRow = (entry: MediaEntryInput) => ({ title: entry.title, type: entry.type, status: entry.status, cover_url: entry.coverUrl ?? null, synopsis: entry.synopsis, rating: entry.rating ?? null, note: entry.note ?? null, visibility: entry.visibility });

export default function OwnerRoomPage() {
  const [entries, setEntries] = useState<MediaEntry[]>(demoEntries);
  const [editing, setEditing] = useState<MediaEntry | null | undefined>(undefined);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [message, setMessage] = useState('Demo mode — add Supabase variables to persist your room.');

  useEffect(() => {
    try {
      const supabase = createClient();
      void (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setMessage('Sign in with Supabase to save your room.'); return; }
        setProfileId(user.id);
        const { data, error } = await supabase.from('media_entries').select('id, title, type, status, cover_url, synopsis, rating, note, visibility').eq('profile_id', user.id).order('created_at', { ascending: false });
        if (error) { setMessage(error.message); return; }
        setEntries((data as MediaRow[]).map(fromRow));
        setMessage('Your room is saved to Supabase.');
      })();
    } catch { /* Demo data remains available until Supabase is configured. */ }
  }, []);

  const save = async (entry: MediaEntryInput) => {
    if (!profileId) { setEntries((items) => editing ? items.map((item) => item.id === editing.id ? { ...entry, id: item.id } : item) : [...items, { ...entry, id: crypto.randomUUID() }]); setEditing(undefined); return; }
    const supabase = createClient();
    const selectedFields = 'id, title, type, status, cover_url, synopsis, rating, note, visibility';
    if (editing) {
      const { data, error } = await supabase.from('media_entries').update(toRow(entry)).eq('id', editing.id).eq('profile_id', profileId).select(selectedFields).single();
      if (error) { setMessage(error.message); return; }
      setEntries((items) => items.map((item) => item.id === editing.id ? fromRow(data as MediaRow) : item));
    } else {
      const { data, error } = await supabase.from('media_entries').insert({ ...toRow(entry), profile_id: profileId }).select(selectedFields).single();
      if (error) { setMessage(error.message); return; }
      setEntries((items) => [...items, fromRow(data as MediaRow)]);
    }
    setEditing(undefined);
  };
  const remove = async (entry: MediaEntry) => {
    if (profileId) { const { error } = await createClient().from('media_entries').delete().eq('id', entry.id).eq('profile_id', profileId); if (error) { setMessage(error.message); return; } }
    setEntries((items) => items.filter((item) => item.id !== entry.id));
  };
  return <main className="owner-page"><header><div><p className="eyebrow">Your room</p><h1>Make your taste tangible.</h1><p>{message}</p></div><button onClick={() => setEditing(null)}>Add media</button></header>{editing !== undefined && <MediaEntryForm initialEntry={editing ?? undefined} onSave={save} onCancel={() => setEditing(undefined)} />}<MediaRoom entries={entries} readOnly={false} /><section className="entry-list" aria-label="Your media"><h2>Manage media</h2>{entries.map((entry) => <div key={entry.id}><span>{entry.title}</span><button onClick={() => setEditing(entry)}>Edit</button><button onClick={() => void remove(entry)}>Delete</button></div>)}</section></main>;
}
