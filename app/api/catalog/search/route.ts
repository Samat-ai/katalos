import { NextResponse } from 'next/server';
import { CatalogSearchRequestSchema } from '@/lib/catalog/schema';
import { searchCatalog } from '@/lib/catalog/provider';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const parsed = CatalogSearchRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid catalog search.' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to search the catalog.' }, { status: 401 });

  try {
    const results = await searchCatalog(parsed.data, {
      openLibraryContact: process.env.OPEN_LIBRARY_CONTACT_EMAIL ?? 'contact@example.com',
      tmdbToken: process.env.TMDB_READ_ACCESS_TOKEN,
    });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Catalog search is unavailable. You can add this item manually.', manualFallback: true }, { status: 503 });
  }
}
