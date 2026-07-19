'use client';

import { useState } from 'react';
import type { MediaType } from '@/lib/media/types';
import type { CatalogCandidate } from '@/lib/catalog/schema';

export function CatalogSearchPicker({ type, onSelect, fetcher = fetch }: { type: MediaType; onSelect: (candidate: CatalogCandidate) => void; fetcher?: typeof fetch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogCandidate[]>([]);
  const [message, setMessage] = useState('');
  const label = type === 'manga' ? 'manga' : `${type}s`;

  async function search() {
    setMessage('');
    try {
      const response = await fetcher('/api/catalog/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, query }) });
      const body = await response.json() as { results?: CatalogCandidate[]; error?: string };
      if (!response.ok) throw new Error(body.error);
      setResults(body.results ?? []);
      if (!(body.results ?? []).length) setMessage('No matches found. You can add this item manually.');
    } catch (error) { setResults([]); setMessage(error instanceof Error ? error.message : 'Catalog search is unavailable. You can add this item manually.'); }
  }

  return <section className="catalog-picker" aria-label="Catalog search">
    <label>Search {label}<input aria-label={`Search ${label}`} value={query} minLength={3} onChange={(event) => setQuery(event.target.value)} /></label>
    <button type="button" onClick={() => void search()} disabled={query.trim().length < 3}>Search catalog</button>
    {message && <p role="status">{message}</p>}
    <ul>{results.map((result) => <li key={`${result.source}-${result.externalId}`}><button type="button" onClick={() => onSelect(result)} aria-label={`Select ${result.title}`}>{result.title}{result.subtitle ? ` — ${result.subtitle}` : ''}</button><small>{result.source.replace('_', ' ')}</small></li>)}</ul>
  </section>;
}
