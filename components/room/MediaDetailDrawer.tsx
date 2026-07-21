'use client';

import { useEffect, useRef } from 'react';
import type { MediaEntry } from '@/lib/media/types';
import { CoverBlock } from '@/components/pixel/CoverBlock';

export function MediaDetailDrawer({ entry, onClose }: { entry: MediaEntry | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!entry) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();
    return () => { document.removeEventListener('keydown', closeOnEscape); returnFocusRef.current?.focus(); };
  }, [entry, onClose]);
  if (!entry) return null;
  const rating = entry.rating ? `${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}` : 'No rating yet';
  return <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close details" onClick={onClose} /><aside ref={drawerRef} className="detail-drawer drawer-responsive" role="dialog" aria-modal="true" aria-label={`${entry.title} details`}><header className="drawer-header"><p className="eyebrow">{entry.type} · {entry.status.replace('_', ' ')}</p><button ref={closeButtonRef} className="drawer-close" onClick={onClose} aria-label="Close details">×</button></header><div className="drawer-body"><div className="drawer-content"><CoverBlock className="drawer-cover" title={entry.title} coverUrl={entry.coverUrl} /><div><h2>{entry.title}</h2><p className="drawer-rating">{rating}</p></div></div><p className="drawer-synopsis">{entry.synopsis}</p>{entry.note && <p className="drawer-note"><strong>My note</strong>{entry.note}</p>}</div></aside></div>;
}
