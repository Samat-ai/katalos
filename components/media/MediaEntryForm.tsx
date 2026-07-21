'use client';

import { useRef, useState } from 'react';
import type { MediaEntry } from '@/lib/media/types';
import { MediaEntryInputSchema, type MediaEntryInput } from '@/lib/media/schema';
import type { CatalogCandidate } from '@/lib/catalog/schema';
import { CatalogSearchPicker } from './CatalogSearchPicker';

export type { MediaEntryInput } from '@/lib/media/schema';

export function MediaEntryForm({ initialEntry, onSave, onCancel }: { initialEntry?: MediaEntry; onSave: (entry: MediaEntryInput) => void | Promise<void>; onCancel?: () => void }) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
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
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const parsed = MediaEntryInputSchema.safeParse(values); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check this entry'); if (parsed.error.issues[0]?.path[0] === 'title') titleRef.current?.focus(); return; } setError(''); setSaving(true); try { await onSave(parsed.data); } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not save that entry.'); } finally { setSaving(false); } };
  return <form className="entry-form" onSubmit={submit} noValidate>
    <h2>{initialEntry ? 'EDIT MEDIA' : 'ADD MEDIA'}</h2>
    <section className="form-step"><h3>1 · TYPE</h3><div className="type-tiles">{(['book', 'manga', 'anime', 'movie'] as const).map((type) => <button key={type} type="button" aria-pressed={values.type === type} onClick={() => update('type', type)}><span aria-hidden="true">{type === 'book' ? '▤' : type === 'manga' ? '▥' : type === 'anime' ? '▶' : '▣'}</span>{type}</button>)}</div></section>
    <section className="form-step"><h3>2 · FIND</h3><CatalogSearchPicker type={values.type as MediaEntry['type']} onSelect={chooseCatalogItem} /><p className="manual-copy">Or enter it manually below.</p></section>
    <section className="form-step form-take"><h3>3 · YOUR TAKE</h3><label>Title<input ref={titleRef} value={values.title} onChange={(e) => update('title', e.target.value)} /></label><label>Cover URL <small>(optional)</small><input value={values.coverUrl} onChange={(e) => update('coverUrl', e.target.value)} placeholder="https://…" /></label><label>Synopsis<textarea value={values.synopsis} onChange={(e) => update('synopsis', e.target.value)} /></label><fieldset className="choice-group"><legend>Status</legend>{(['planned', 'in_progress', 'finished', 'abandoned'] as const).map((status) => <button key={status} type="button" className={`status-chip ${status}`} aria-pressed={values.status === status} onClick={() => update('status', status)}>{status.replace('_', ' ')}</button>)}</fieldset><fieldset className="choice-group"><legend>Rating</legend><div className="rating-stars">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" aria-label={`${rating} stars`} aria-pressed={values.rating === String(rating)} onClick={() => update('rating', values.rating === String(rating) ? '' : String(rating))}>{rating <= Number(values.rating || 0) ? '★' : '☆'}</button>)}</div></fieldset><label>Note<textarea value={values.note} onChange={(e) => update('note', e.target.value)} /></label><fieldset className="choice-group"><legend>Visibility</legend><div className="visibility-toggle"><button type="button" aria-pressed={values.visibility === 'public'} onClick={() => update('visibility', 'public')}>Public</button><button type="button" aria-pressed={values.visibility === 'private'} onClick={() => update('visibility', 'private')}>Private</button></div><small>Private entries are never shown, hinted, or counted in your public room.</small></fieldset></section>
    <section className="form-step form-save"><h3>4 · SAVE</h3>{error && <p role="alert">{error}</p>}<div><button type="submit" disabled={saving}>{saving ? 'SAVING…' : 'SAVE TO ROOM'}</button>{onCancel && <button type="button" disabled={saving} onClick={onCancel}>CANCEL</button>}</div></section>
  </form>;
}
