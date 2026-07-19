import { NextResponse } from 'next/server';
import { getCatalogDetails } from '@/lib/catalog/provider';
import { CatalogDetailsRequestSchema } from '@/lib/catalog/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const parsed = CatalogDetailsRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid catalog item.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to use catalog details.' }, { status: 401 });
  try {
    const { type, ...candidate } = parsed.data;
    const cacheKey = `detail:${candidate.externalId}`;
    const { data: cached } = await supabase.rpc('catalog_get_cached_results', { p_provider: candidate.source, p_cache_key: cacheKey });
    if (cached) return NextResponse.json({ prefill: cached, cached: true });
    const { data: allowed } = await supabase.rpc('catalog_consume_quota');
    if (!allowed) return NextResponse.json({ error: 'Catalog search limit reached. Please try again in a minute.', manualFallback: true }, { status: 429 });
    const prefill = await getCatalogDetails(candidate, type, { openLibraryContact: process.env.OPEN_LIBRARY_CONTACT_EMAIL ?? 'contact@example.com', tmdbToken: process.env.TMDB_READ_ACCESS_TOKEN });
    await supabase.rpc('catalog_put_cached_results', { p_provider: candidate.source, p_cache_key: cacheKey, p_results: prefill });
    return NextResponse.json({ prefill });
  } catch {
    return NextResponse.json({ error: 'Details are unavailable. You can add this item manually.', manualFallback: true }, { status: 503 });
  }
}
