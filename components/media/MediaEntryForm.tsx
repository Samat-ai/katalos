'use client';

import { useState } from 'react';
import type { MediaEntry } from '@/lib/media/types';
import { MediaEntryInputSchema, type MediaEntryInput } from '@/lib/media/schema';
import type { CatalogCandidate } from '@/lib/catalog/schema';
import { CatalogSearchPicker } from './CatalogSearchPicker';

export type { MediaEntryInput } from '@/lib/media/schema';

export function MediaEntryForm({ initialEntry, onSave, onCancel }: { initialEntry?: MediaEntry; onSave: (entry: MediaEntryInput) => void; onCancel?: () => void }) {
  const [error, setError] = useState('');
  const [values, setValues] = useState({ title: initialEntry?.title ?? '', type: initialEntry?.type ?? 'book', status: initialEntry?.status ?? 'planned', coverUrl: initialEntry?.coverUrl ?? '', synopsis: initialEntry?.synopsis ?? '', rating: initialEntry?.rating?.toString() ?? '', note: initialEntry?.note ?? '', visibility: initialEntry?.visibility ?? 'public' });
  const update = (name: keyof typeof values, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const chooseCatalogItem = async (candidate: CatalogCandidate) => {
    try {
      const response = await fetch('/api/catalog/details', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...candidate, type: values.type }) });
      const body = await response.json() as { prefill?: { title: string; coverUrl?: string; synopsis: string }; error?: string };
      if (!response.ok || !body.prefill) throw new Error(body.error);
      setValues((current) => ({ ...current, title: body.prefill!.title, coverUrl: body.prefill!.coverUrl ?? current.coverUrl, synopsis: body.prefill!.synopsis }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Details are unavailable. You can add this item manually.'); }
  };
  const submit = (event: React.FormEvent) => { event.preventDefault(); const parsed = MediaEntryInputSchema.safeParse(values); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check this entry'); return; } setError(''); onSave(parsed.data); };
  return <form className="entry-form" onSubmit={submit} noValidate>
    <h2>{initialEntry ? 'EDIT MEDIA' : 'ADD MEDIA'}</h2>
    <section className="form-step"><h3>1 · TYPE</h3><div className="type-tiles">{(['book', 'manga', 'anime', 'movie'] as const).map((type) => <button key={type} type="button" aria-pressed={values.type === type} onClick={() => update('type', type)}><span aria-hidden="true">{type === 'book' ? '▤' : type === 'manga' ? '▥' : type === 'anime' ? '▶' : '▣'}</span>{type}</button>)}</div></section>
    <section className="form-step"><h3>2 · FIND</h3><CatalogSearchPicker type={values.type as MediaEntry['type']} onSelect={(candidate) => void chooseCatalogItem(candidate)} /><p className="manual-copy">Or enter it manually below.</p></section>
    <section className="form-step form-take"><h3>3 · YOUR TAKE</h3><label>Title<input value={values.title} onChange={(e) => update('title', e.target.value)} /></label><label>Cover URL <small>(optional)</small><input value={values.coverUrl} onChange={(e) => update('coverUrl', e.target.value)} placeholder="https://…" /></label><label>Synopsis<textarea value={values.synopsis} onChange={(e) => update('synopsis', e.target.value)} /></label><label>Status<select value={values.status} onChange={(e) => update('status', e.target.value)}>{['planned', 'in_progress', 'finished', 'abandoned'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label><label>Rating (0–5)<input type="number" min="1" max="5" value={values.rating} onChange={(e) => update('rating', e.target.value)} /></label><label>Note<textarea value={values.note} onChange={(e) => update('note', e.target.value)} /></label><label>Visibility<select value={values.visibility} onChange={(e) => update('visibility', e.target.value)}><option value="public">Public</option><option value="private">Private</option></select><small>Private entries are never shown, hinted, or counted in your public room.</small></label></section>
    <section className="form-step form-save"><h3>4 · SAVE</h3>{error && <p role="alert">{error}</p>}<div><button type="submit">SAVE TO ROOM</button>{onCancel && <button type="button" onClick={onCancel}>CANCEL</button>}</div></section>
  </form>;
}
