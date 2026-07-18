import type { MediaEntry } from '@/lib/media/types';

export function MediaDetailDrawer({ entry, onClose }: { entry: MediaEntry | null; onClose: () => void }) {
  if (!entry) return null;
  return <aside className="detail-drawer" aria-label={`${entry.title} details`}><button className="drawer-close" onClick={onClose} aria-label="Close details">×</button><p className="eyebrow">{entry.type} · {entry.status.replace('_', ' ')}</p><h2>{entry.title}</h2><p>{entry.synopsis}</p>{entry.rating && <p><strong>Rating:</strong> {entry.rating}/5</p>}{entry.note && <p><strong>Note:</strong> {entry.note}</p>}</aside>;
}
