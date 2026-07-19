'use client';

import { useState } from 'react';
import type { MediaEntry } from '@/lib/media/types';
import { MediaEntryInputSchema, type MediaEntryInput } from '@/lib/media/schema';

export type { MediaEntryInput } from '@/lib/media/schema';

export function MediaEntryForm({ initialEntry, onSave, onCancel }: { initialEntry?: MediaEntry; onSave: (entry: MediaEntryInput) => void; onCancel?: () => void }) {
  const [error, setError] = useState('');
  const [values, setValues] = useState({ title: initialEntry?.title ?? '', type: initialEntry?.type ?? 'book', status: initialEntry?.status ?? 'planned', coverUrl: initialEntry?.coverUrl ?? '', synopsis: initialEntry?.synopsis ?? '', rating: initialEntry?.rating?.toString() ?? '', note: initialEntry?.note ?? '', visibility: initialEntry?.visibility ?? 'public' });
  const update = (name: keyof typeof values, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); const parsed = MediaEntryInputSchema.safeParse(values); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check this entry'); return; } setError(''); onSave(parsed.data); };
  return <form className="entry-form" onSubmit={submit} noValidate><h2>{initialEntry ? 'Edit media' : 'Add media'}</h2><label>Title<input value={values.title} onChange={(e) => update('title', e.target.value)} /></label><label>Type<select value={values.type} onChange={(e) => update('type', e.target.value)}>{['book', 'manga', 'anime', 'movie'].map((type) => <option key={type}>{type}</option>)}</select></label><label>Status<select value={values.status} onChange={(e) => update('status', e.target.value)}>{['planned', 'in_progress', 'finished', 'abandoned'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label><label>Cover URL<input value={values.coverUrl} onChange={(e) => update('coverUrl', e.target.value)} placeholder="Optional" /></label><label>Synopsis<textarea value={values.synopsis} onChange={(e) => update('synopsis', e.target.value)} /></label><label>Rating (1–5)<input type="number" min="1" max="5" value={values.rating} onChange={(e) => update('rating', e.target.value)} /></label><label>Note<textarea value={values.note} onChange={(e) => update('note', e.target.value)} /></label><label>Visibility<select value={values.visibility} onChange={(e) => update('visibility', e.target.value)}><option value="public">Public</option><option value="private">Private</option></select></label>{error && <p role="alert">{error}</p>}<div><button type="submit">Save media</button>{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}</div></form>;
}
