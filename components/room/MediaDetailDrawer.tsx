'use client';

import { useEffect, useRef } from 'react';
import type { MediaEntry } from '@/lib/media/types';

export function MediaDetailDrawer({ entry, onClose }: { entry: MediaEntry | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!entry) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [entry, onClose]);
  if (!entry) return null;
  const rating = entry.rating ? `${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}` : 'No rating yet';
  return <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close details" onClick={onClose} /><aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`${entry.title} details`}><button ref={closeButtonRef} className="drawer-close" onClick={onClose} aria-label="Close details">×</button><p className="eyebrow">{entry.type} · {entry.status.replace('_', ' ')}</p><div className="drawer-content"><div className="drawer-cover">{entry.coverUrl ? <img src={entry.coverUrl} alt="" /> : entry.title.slice(0, 2).toUpperCase()}</div><div><h2>{entry.title}</h2><p className="drawer-rating">{rating}</p></div></div><p>{entry.synopsis}</p>{entry.note && <p className="drawer-note"><strong>My note</strong>{entry.note}</p>}</aside></div>;
}
