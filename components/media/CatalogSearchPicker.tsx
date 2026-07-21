'use client';

import { useEffect, useRef, useState } from 'react';
import type { MediaType } from '@/lib/media/types';
import type { CatalogCandidate } from '@/lib/catalog/schema';

export function CatalogSearchPicker({ type, onSelect, fetcher = fetch }: { type: MediaType; onSelect: (candidate: CatalogCandidate) => void; fetcher?: typeof fetch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogCandidate[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const lastSearch = useRef('');
  const label = type === 'manga' ? 'manga' : `${type}s`;

  async function search(term = query) {
    const normalized = term.trim();
    if (normalized.length < 3) return;
    const searchKey = `${type}:${normalized.toLowerCase()}`;
    if (lastSearch.current === searchKey) return;
    lastSearch.current = searchKey;
    setLoading(true);
    setMessage('Searching catalog…');
    try {
      const response = await fetcher('/api/catalog/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, query: normalized }) });
      const body = await response.json() as { results?: CatalogCandidate[]; error?: string };
      if (!response.ok) throw new Error(body.error);
      setResults(body.results ?? []);
      setMessage((body.results ?? []).length ? '' : 'No matches found. You can add this item manually.');
    } catch (error) { lastSearch.current = ''; setResults([]); setMessage(error instanceof Error ? `${error.message} You can add this item manually.` : 'Catalog search is unavailable. You can add this item manually.'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (query.trim().length < 3) return;
    const timeout = window.setTimeout(() => void search(query), 350);
    return () => window.clearTimeout(timeout);
  }, [query, type]);

  return <section className="catalog-picker" aria-label="Catalog search">
    <label>Search {label}<input aria-label={`Search ${label}`} value={query} minLength={3} onChange={(event) => setQuery(event.target.value)} /></label>
    <button type="button" onClick={() => { lastSearch.current = ''; void search(); }} disabled={query.trim().length < 3 || loading}>{loading ? 'SEARCHING…' : 'SEARCH CATALOG'}</button>
    {message && <p role="status">{message}</p>}
    <ul className="catalog-results">{results.map((result) => <li key={`${result.source}-${result.externalId}`}>{result.thumbnailUrl ? <img src={result.thumbnailUrl} alt="" /> : <span className="catalog-cover-fallback" aria-hidden="true">{result.title.slice(0, 1)}</span>}<span><strong>{result.title}</strong>{result.subtitle && <small>{result.subtitle}</small>}</span><button type="button" onClick={() => onSelect(result)} aria-label={`Select ${result.title}`}>USE</button></li>)}</ul>
  </section>;
}
